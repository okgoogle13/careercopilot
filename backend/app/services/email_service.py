"""
AWS SES Email Service for CareerCopilot.

Provides email sending functionality using Amazon Simple Email Service (SES).
"""

import os

import boto3
from botocore.exceptions import ClientError


class SESEmailService:
    """Service for sending emails via AWS SES."""

    def __init__(
        self,
        aws_access_key_id: str | None = None,
        aws_secret_access_key: str | None = None,
        aws_region: str | None = None,
        sender_email: str | None = None,
    ):
        """
        Initialize SES email service.

        Args:
            aws_access_key_id: AWS access key (defaults to env var)
            aws_secret_access_key: AWS secret key (defaults to env var)
            aws_region: AWS region (defaults to env var or us-east-1)
            sender_email: Verified sender email address
        """
        self.aws_access_key_id = aws_access_key_id or os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key = aws_secret_access_key or os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = aws_region or os.getenv("AWS_REGION", "us-east-1")
        self.sender_email = sender_email or os.getenv("SES_SENDER_EMAIL")

        if not self.aws_access_key_id or not self.aws_secret_access_key:
            raise ValueError("AWS credentials are required for SES email service")

        if not self.sender_email:
            raise ValueError("SES_SENDER_EMAIL must be set and verified in AWS SES")

        # Initialize SES client
        self.client = boto3.client(
            "ses",
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name=self.aws_region,
        )

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str | None = None,
    ) -> dict:
        """
        Send an email via AWS SES.

        Args:
            to_email: Recipient email address
            subject: Email subject line
            html_content: HTML version of email body
            text_content: Plain text version (optional, extracted from HTML if not provided)

        Returns:
            dict: Response from SES with MessageId

        Raises:
            ClientError: If SES API call fails
        """
        # Prepare email body
        body = {"Html": {"Charset": "UTF-8", "Data": html_content}}

        if text_content:
            body["Text"] = {"Charset": "UTF-8", "Data": text_content}

        try:
            response = self.client.send_email(
                Source=self.sender_email,
                Destination={"ToAddresses": [to_email]},
                Message={
                    "Subject": {"Charset": "UTF-8", "Data": subject},
                    "Body": body,
                },
            )
            return {
                "success": True,
                "message_id": response["MessageId"],
                "status_code": response["ResponseMetadata"]["HTTPStatusCode"],
            }
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]
            print(f"SES Error [{error_code}]: {error_message}")
            raise


# Global instance (initialized on first use)
_email_service: SESEmailService | None = None


def get_email_service() -> SESEmailService:
    """
    Get or create the global SES email service instance.

    Returns:
        SESEmailService: Configured email service instance
    """
    global _email_service
    if _email_service is None:
        _email_service = SESEmailService()
    return _email_service


def send_email(to_email: str, subject: str, html_content: str) -> dict:
    """
    Convenience function to send email using the global service instance.

    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML email body

    Returns:
        dict: Response with success status and message_id
    """
    service = get_email_service()
    return service.send_email(to_email, subject, html_content)
