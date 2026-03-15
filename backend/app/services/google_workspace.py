"""
backend/app/services/google_workspace.py
----------------------------------------
Handles interactions with Google Tasks and Calendar.
"""

import datetime
import os

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/documents",
]
# Expects this file in the project root
SERVICE_ACCOUNT_FILE = "credentials.json"


class GoogleWorkspaceService:
    def __init__(self):
        self.creds = None
        if os.path.exists(SERVICE_ACCOUNT_FILE):
            try:
                self.creds = service_account.Credentials.from_service_account_file(
                    SERVICE_ACCOUNT_FILE, scopes=SCOPES
                )
            except Exception as e:
                print(f"[!] Error loading Google Credentials: {e}")
        else:
            print("[WARN] No 'credentials.json' found. Google integration will be skipped.")

    async def create_task(self, title: str, notes: str, due_date: str = None):
        """Creates a task in the user's default list."""
        if not self.creds:
            return None

        try:
            service = build("tasks", "v1", credentials=self.creds)
            task_body = {
                "title": title,
                "notes": notes,
                "due": due_date,  # Expects RFC 3339 timestamp
            }
            result = service.tasks().insert(tasklist="@default", body=task_body).execute()
            print(f"[+] Google Task created: {result.get('title')}")
            return result
        except Exception as e:
            print(f"[-] Failed to create Google Task: {e}")
            return None

    async def schedule_deep_work(self, summary: str, duration_minutes: int = 60):
        """Blocks time on the calendar for tomorrow morning."""
        if not self.creds:
            return None

        try:
            service = build("calendar", "v3", credentials=self.creds)

            # Schedule for tomorrow at 9:00 AM
            tomorrow = datetime.date.today() + datetime.timedelta(days=1)
            start_time = datetime.datetime.combine(tomorrow, datetime.time(9, 0)).isoformat() + "Z"
            end_time = (
                datetime.datetime.combine(
                    tomorrow, datetime.time(9 + (duration_minutes // 60), 0)
                ).isoformat()
                + "Z"
            )

            event = {
                "summary": f"🎯 Deep Work: {summary}",
                "description": "Automated block by CareerCopilot",
                "start": {"dateTime": start_time},
                "end": {"dateTime": end_time},
            }

            result = service.events().insert(calendarId="primary", body=event).execute()
            print(f"[+] Calendar Block created: {result.get('htmlLink')}")
            return result
        except Exception as e:
            print(f"[-] Failed to schedule Calendar: {e}")
            return None

    async def create_doc(self, title: str, content: str):
        """
        Creates a Google Doc with the specified title and content.

        Args:
            title: Title of the document
            content: Text content to add to the document

        Returns:
            dict: Document metadata including documentId and webViewLink, or None if credentials missing
        """
        if not self.creds:
            print(
                "[WARN] No credentials available. Returning content as text instead of creating Google Doc."
            )
            return {
                "status": "credentials_missing",
                "content": content,
                "message": "Add credentials.json to enable Google Docs integration",
            }

        try:
            # Create the document
            docs_service = build("docs", "v1", credentials=self.creds)

            doc = docs_service.documents().create(body={"title": title}).execute()
            document_id = doc.get("documentId")

            # Add content to the document
            requests = [
                {
                    "insertText": {
                        "location": {
                            "index": 1,
                        },
                        "text": content,
                    }
                }
            ]

            docs_service.documents().batchUpdate(
                documentId=document_id, body={"requests": requests}
            ).execute()

            print(f"[+] Google Doc created: {title}")
            print(f"    Document ID: {document_id}")

            # Return document metadata
            result = {
                "documentId": document_id,
                "title": title,
                "webViewLink": f"https://docs.google.com/document/d/{document_id}/edit",
                "status": "success",
            }

            return result

        except Exception as e:
            print(f"[-] Failed to create Google Doc: {e}")
            return {"status": "error", "error": str(e), "content": content}
