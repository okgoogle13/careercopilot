import genkit
from genkit.plugins import googleai
from app.core.secrets import get_user_secret
from app.core.db import db
import os
import base64
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.cloud.firestore import SERVER_TIMESTAMP

# Import the new flows
from .calendar_manager import createCalendarEvent
from .notifier import sendNewOpportunityNotification

# Initialize Genkit and the Gemini Pro model
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])
gemini_pro = googleai.gemini_pro

def get_gmail_service(user_id: str):
    """Creates a Gmail API service client for a given user."""
    # This function remains the same
    creds_json = get_user_secret(user_id, 'google_credentials')
    if not creds_json:
        raise Exception("User has not authenticated with Google.")
    
    credentials = Credentials.from_authorized_user_info(creds_json)
    return build('gmail', 'v1', credentials=credentials)


@genkit.flow()
def extract_job_details_from_email(email_content: str) -> dict:
    """Uses an AI model to extract structured job details from email text."""
    # This flow remains the same
    prompt = f"""
    Analyze the following email content and extract structured information about a job opportunity.
    The output must be a valid JSON object with the fields: "company", "title", "deadline" (in YYYY-MM-DD format), and "source_url".
    If any field is not present, use a value of null.
    If no clear job opportunity is found, return an empty JSON object {{}}.

    Email Content:
    ---
    {email_content}
    ---
    """
    response = gemini_pro.generate(
        prompt=prompt,
        config=googleai.GenerationConfig(response_mime_type="application/json")
    )
    try:
        return json.loads(response.text())
    except (json.JSONDecodeError, TypeError):
        return {}


@genkit.flow()
async def scanUserEmails(user_id: str) -> list:
    """
    Scans a user's unread emails for jobs, saves them, creates calendar events, and sends notifications.
    """
    try:
        # 1. Get user data for notifications
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if not user_doc.exists:
            raise Exception(f"User with ID {user_id} not found in Firestore.")
        user_data = user_doc.to_dict()

        service = get_gmail_service(user_id)
        # Refined query to be more specific
        query = "is:unread (from:greenhouse.io OR from:lever.co OR subject:('Your application for'))"
        results = service.users().messages().list(userId='me', q=query, maxResults=10).execute()
        messages = results.get('messages', [])
        
        saved_opportunities = []
        if not messages:
            return []

        for message_info in messages:
            msg = service.users().messages().get(userId='me', id=message_info['id'], format='full').execute()
            
            # Simplified body extraction logic
            parts = msg.get('payload', {}).get('parts', [])
            encoded_body = ""
            if parts:
                for part in parts:
                    if part.get('mimeType') == 'text/plain':
                        encoded_body = part.get('body', {}).get('data', '')
                        break
            
            if not encoded_body:
                continue

            email_body = base64.urlsafe_b64decode(encoded_body).decode('utf-8')
            job_details = await extract_job_details_from_email.run(email_body)

            if job_details and job_details.get("title"):
                # Save to Firestore
                update_time, opp_ref = user_ref.collection('opportunities').add({
                    **job_details,
                    'status': 'new',
                    'found_at': SERVER_TIMESTAMP,
                })
                
                # Add the new document ID for subsequent flows
                job_details['id'] = opp_ref.id
                saved_opportunities.append(job_details)

                # 2. Create Calendar Event (if a deadline was found)
                if job_details.get("deadline"):
                    try:
                        await createCalendarEvent.run(user_id, job_details)
                    except Exception as e:
                        print(f"Failed to create calendar event for opportunity {opp_ref.id}: {e}")
                
                # 3. Send Notification Email
                try:
                    await sendNewOpportunityNotification.run(user_data, job_details)
                except Exception as e:
                    print(f"Failed to send notification for opportunity {opp_ref.id}: {e}")
                
                # Mark email as read
                service.users().messages().modify(userId='me', id=message_info['id'], body={'removeLabelIds': ['UNREAD']}).execute()

        return saved_opportunities
    except HttpError as error:
        print(f"An error occurred with the Gmail API: {error}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred during email scanning: {e}")
        return []
