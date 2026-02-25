import base64
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.core.database import SessionLocal
from app.core.genkit import get_model
from app.core.prompt_service import format_prompt
from app.core.secrets import get_user_secret
from app.genkit_flows.flow_decorator import simple_genkit_flow
from app.models.database import User, Application

# Import the new flows
from .calendar_manager import createCalendarEvent
from .notifier import sendNewOpportunityNotification


def get_gmail_service(user_id: str):
    """Creates a Gmail API service client for a given user."""
    creds_json = get_user_secret(user_id, "google_credentials")
    if not creds_json:
        raise Exception("User has not authenticated with Google.")

    credentials = Credentials.from_authorized_user_info(creds_json)
    return build("gmail", "v1", credentials=credentials)


@simple_genkit_flow()
def extract_job_details_from_email(email_content: str) -> dict:
    """Uses an AI model to extract structured job details from email text."""

    prompt = format_prompt("email_job_extraction", email_content=email_content)
    model = get_model()

    response = model.generate(
        prompt=prompt,
        config={"response_mime_type": "application/json"},
    )

    return response.output()


@simple_genkit_flow()
async def scanEmailsForJobOpportunities(user_id: str) -> dict:
    """
    Enhanced version of email scanning that returns structured results.
    """
    try:
        opportunities = await scanUserEmails(user_id)
        return {
            "success": True,
            "opportunities_found": len(opportunities),
            "opportunities": opportunities,
            "scan_timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "opportunities_found": 0,
            "opportunities": [],
        }


async def scanUserEmails(user_id: str) -> list:
    """
    Scans a user's unread emails for jobs, saves them, creates calendar events, and sends notifications.
    """
    db = SessionLocal()
    try:
        # 1. Get user data for notifications
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise Exception(f"User with ID {user_id} not found in Database.")
        user_data = user.to_dict()

        service = get_gmail_service(user_id)
        query = (
            "is:unread (from:greenhouse.io OR from:lever.co OR subject:('Your application for'))"
        )
        results = service.users().messages().list(userId="me", q=query, maxResults=10).execute()
        messages = results.get("messages", [])

        saved_opportunities = []
        if not messages:
            return []

        for message_info in messages:
            msg = (
                service.users()
                .messages()
                .get(userId="me", id=message_info["id"], format="full")
                .execute()
            )

            parts = msg.get("payload", {}).get("parts", [])
            encoded_body = ""
            if parts:
                for part in parts:
                    if part.get("mimeType") == "text/plain":
                        encoded_body = part.get("body", {}).get("data", "")
                        break

            if not encoded_body:
                continue

            email_body = base64.urlsafe_b64decode(encoded_body).decode("utf-8")
            job_details = await extract_job_details_from_email.run(email_body)

            if job_details and job_details.get("title"):
                # Save to Applications table
                new_app = Application(
                    user_id=user_id,
                    job_title=job_details.get("title"),
                    company_name=job_details.get("company"),
                    job_description=job_details.get("description", ""),
                    status="new",
                    source="email",
                    applied_date=datetime.now(timezone.utc)
                )
                db.add(new_app)
                db.commit()
                db.refresh(new_app)

                # Add the new document ID
                job_details["id"] = str(new_app.id)
                saved_opportunities.append(job_details)

                # 2. Create Calendar Event
                if job_details.get("deadline"):
                    try:
                        await createCalendarEvent.run(user_id, job_details)
                    except Exception as e:
                        print(f"Failed to create calendar event: {e}")

                # 3. Send Notification Email
                try:
                    await sendNewOpportunityNotification.run(user_data, job_details)
                except Exception as e:
                    print(f"Failed to send notification: {e}")

                # Mark email as read
                service.users().messages().modify(
                    userId="me",
                    id=message_info["id"],
                    body={"removeLabelIds": ["UNREAD"]},
                ).execute()

        return saved_opportunities
    except HttpError as error:
        print(f"An error occurred with the Gmail API: {error}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred during email scanning: {e}")
        return []
    finally:
        db.close()
