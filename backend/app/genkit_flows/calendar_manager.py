import genkit
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from app.core.secrets import get_user_secret
from app.core.db import db
from datetime import datetime, timedelta

@genkit.flow()
def createCalendarEvent(user_id: str, opportunity_data: dict) -> str:
    """
    Creates a Google Calendar event for a job application deadline.
    """
    creds_json = get_user_secret(user_id, 'google_credentials')
    if not creds_json:
        raise Exception("User has not authenticated with Google.")

    credentials = Credentials.from_authorized_user_info(creds_json)
    service = build('calendar', 'v3', credentials=credentials)

    event_title = f"Application Deadline: {opportunity_data.get('title')} at {opportunity_data.get('company')}"
    
    # Assuming 'deadline' is a string in ISO format (e.g., 'YYYY-MM-DD')
    deadline_str = opportunity_data.get('deadline')
    if not deadline_str:
        raise ValueError("Opportunity data must include a 'deadline'.")
        
    deadline_date = datetime.fromisoformat(deadline_str).date()
    
    event = {
        'summary': event_title,
        'description': f"Reminder to submit your application for the {opportunity_data.get('title')} position. Good luck!",
        'start': {
            'date': deadline_date.isoformat(),
            'timeZone': 'America/Los_Angeles', # Or use a user-specific timezone
        },
        'end': {
            'date': (deadline_date + timedelta(days=1)).isoformat(),
            'timeZone': 'America/Los_Angeles',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60}, # 1 day before
                {'method': 'popup', 'minutes': 12 * 60},  # 12 hours before
            ],
        },
    }

    created_event = service.events().insert(calendarId='primary', body=event).execute()
    
    # Save the event ID to the opportunity document in Firestore for future reference
    opportunity_id = opportunity_data.get('id')
    if opportunity_id:
        db.collection('users').document(user_id).collection('opportunities').document(opportunity_id).set({
            'calendar_event_id': created_event.get('id')
        }, merge=True)

    return created_event.get('id')
