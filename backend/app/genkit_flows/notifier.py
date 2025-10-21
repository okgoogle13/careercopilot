import os

from app.services.email_service import send_email


# Removed @genkit.flow()
def sendNewOpportunityNotification(user_data: dict, opportunity_data: dict) -> None:
    """
    Sends an email notification to the user about a new job opportunity.
    Uses AWS SES for email delivery.
    """
    # Check if SES is configured
    if not os.getenv("AWS_ACCESS_KEY_ID") or not os.getenv("SES_SENDER_EMAIL"):
        print("AWS SES not configured. Skipping email notification.")
        return

    user_email = user_data.get("email")
    if not user_email:
        raise ValueError("User data must include an email address.")

    job_title = opportunity_data.get("title", "N/A")
    company = opportunity_data.get("company", "N/A")
    opportunity_data.get("id")

    # Construct the link to the opportunity in the app
    # This might need to be adjusted based on your frontend routing
    app_link = "https://careercopilot-468811.web.app/opportunities"

    subject = f"New Job Opportunity Found: {job_title} at {company}!"
    html_content = f"""
    <html>
    <body>
        <h2>Hi {user_data.get('displayName', 'User')},</h2>
        <p>Our AI has found a new job opportunity for you:</p>
        <ul>
            <li><strong>Job Title:</strong> {job_title}</li>
            <li><strong>Company:</strong> {company}</li>
            <li><strong>Deadline:</strong> {opportunity_data.get('deadline', 'N/A')}</li>
        </ul>
        <p>We've already saved it to your dashboard and added a reminder to your calendar.</p>
        <p>
            <a href="{app_link}" style="display: inline-block; padding: 10px 20px; font-size: 16px;
            color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                View in Career Copilot
            </a>
        </p>
        <br/>
        <p>Best of luck!</p>
        <p><strong>The Career Copilot Team</strong></p>
    </body>
    </html>
    """

    try:
        response = send_email(
            to_email=user_email,
            subject=subject,
            html_content=html_content,
        )
        print(
            f"Notification email sent to {user_email}, "
            f"MessageID: {response.get('message_id')}, "
            f"Status: {response.get('status_code')}"
        )
    except Exception as e:
        print(f"Error sending notification email: {e}")
        # Log the error but don't break the main flow
