import genkit
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

@genkit.flow()
def sendNewOpportunityNotification(user_data: dict, opportunity_data: dict) -> None:
    """
    Sends an email notification to the user about a new job opportunity.
    """
    sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
    if not sendgrid_api_key:
        print("SENDGRID_API_KEY not set. Skipping email notification.")
        return

    user_email = user_data.get("email")
    if not user_email:
        raise ValueError("User data must include an email address.")

    job_title = opportunity_data.get('title', 'N/A')
    company = opportunity_data.get('company', 'N/A')
    opportunity_id = opportunity_data.get('id')

    # Construct the link to the opportunity in the app
    # This might need to be adjusted based on your frontend routing
    app_link = f"https://careercopilot-468811.web.app/opportunities"

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
            <a href="{app_link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                View in Career Copilot
            </a>
        </p>
        <br/>
        <p>Best of luck!</p>
        <p><strong>The Career Copilot Team</strong></p>
    </body>
    </html>
    """

    message = Mail(
        from_email='notifications@careercopilot.com',  # Must be a verified sender in SendGrid
        to_emails=user_email,
        subject=subject,
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(f"Notification email sent to {user_email}, status code: {response.status_code}")
    except Exception as e:
        print(f"Error sending notification email: {e}")
        # Decide if you want to raise an exception or just log the error
        # For this use case, we'll just log it to avoid breaking the main flow
        # raise e
