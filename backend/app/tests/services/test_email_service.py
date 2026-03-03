"""Unit tests for the AWS SES email service."""

import sys
from types import ModuleType
from unittest.mock import MagicMock

import pytest


class _StubClientError(Exception):
    """Lightweight replacement for botocore.exceptions.ClientError."""

    def __init__(self, error_response, operation_name):
        super().__init__(error_response["Error"]["Message"])
        self.response = error_response
        self.operation_name = operation_name


boto3_module = sys.modules.setdefault("boto3", ModuleType("boto3"))
boto3_module.client = getattr(boto3_module, "client", MagicMock())
botocore_module = sys.modules.setdefault("botocore", ModuleType("botocore"))
exceptions_module = sys.modules.setdefault("botocore.exceptions", ModuleType("botocore.exceptions"))
exceptions_module.ClientError = getattr(exceptions_module, "ClientError", _StubClientError)
botocore_module.exceptions = exceptions_module

from botocore.exceptions import ClientError

import app.services.email_service as email_service_module
from app.services.email_service import SESEmailService, get_email_service, send_email


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


@pytest.fixture(autouse=True)
def reset_email_service_singleton(monkeypatch):
    """Reset the module singleton between tests."""
    monkeypatch.setattr(email_service_module, "_email_service", None)


def test_ses_email_service_initializes_boto_client(monkeypatch):
    """Explicit credentials should be forwarded into the boto SES client."""
    mock_client = MagicMock()
    boto_factory = MagicMock(return_value=mock_client)
    monkeypatch.setattr(email_service_module.boto3, "client", boto_factory)

    service = SESEmailService(
        aws_access_key_id="key",
        aws_secret_access_key="secret",
        aws_region="ap-southeast-2",
        sender_email="sender@example.com",
    )

    assert service.client is mock_client
    boto_factory.assert_called_once_with(
        "ses",
        aws_access_key_id="key",
        aws_secret_access_key="secret",
        region_name="ap-southeast-2",
    )


def test_ses_email_service_reads_configuration_from_environment(monkeypatch):
    """Environment variables should be used when constructor args are omitted."""
    mock_client = MagicMock()
    boto_factory = MagicMock(return_value=mock_client)
    monkeypatch.setattr(email_service_module.boto3, "client", boto_factory)
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "env-key")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "env-secret")
    monkeypatch.setenv("AWS_REGION", "us-west-2")
    monkeypatch.setenv("SES_SENDER_EMAIL", "env@example.com")

    service = SESEmailService()

    assert service.aws_access_key_id == "env-key"
    assert service.aws_secret_access_key == "env-secret"
    assert service.aws_region == "us-west-2"
    assert service.sender_email == "env@example.com"


def test_ses_email_service_requires_credentials(monkeypatch):
    """Missing credentials should fail before constructing a client."""
    monkeypatch.delenv("AWS_ACCESS_KEY_ID", raising=False)
    monkeypatch.delenv("AWS_SECRET_ACCESS_KEY", raising=False)
    monkeypatch.setenv("SES_SENDER_EMAIL", "sender@example.com")

    with pytest.raises(ValueError, match="AWS credentials are required"):
        SESEmailService()


def test_ses_email_service_requires_sender_email(monkeypatch):
    """A verified sender email is mandatory."""
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "key")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "secret")
    monkeypatch.delenv("SES_SENDER_EMAIL", raising=False)

    with pytest.raises(ValueError, match="SES_SENDER_EMAIL must be set"):
        SESEmailService()


def test_send_email_returns_success_payload_with_text_body(monkeypatch):
    """The SES response should be normalized into a stable success payload."""
    mock_client = MagicMock()
    mock_client.send_email.return_value = {
        "MessageId": "msg-123",
        "ResponseMetadata": {"HTTPStatusCode": 200},
    }
    monkeypatch.setattr(email_service_module.boto3, "client", MagicMock(return_value=mock_client))
    service = SESEmailService(
        aws_access_key_id="key",
        aws_secret_access_key="secret",
        sender_email="sender@example.com",
    )

    response = service.send_email(
        to_email="recipient@example.com",
        subject="Subject line",
        html_content="<p>Hello</p>",
        text_content="Hello",
    )

    assert response == {
        "success": True,
        "message_id": "msg-123",
        "status_code": 200,
    }
    body = mock_client.send_email.call_args.kwargs["Message"]["Body"]
    assert body["Html"]["Data"] == "<p>Hello</p>"
    assert body["Text"]["Data"] == "Hello"


def test_send_email_omits_text_body_when_not_provided(monkeypatch):
    """Only the HTML body should be sent when no plain-text body is supplied."""
    mock_client = MagicMock()
    mock_client.send_email.return_value = {
        "MessageId": "msg-456",
        "ResponseMetadata": {"HTTPStatusCode": 202},
    }
    monkeypatch.setattr(email_service_module.boto3, "client", MagicMock(return_value=mock_client))
    service = SESEmailService(
        aws_access_key_id="key",
        aws_secret_access_key="secret",
        sender_email="sender@example.com",
    )

    service.send_email(
        to_email="recipient@example.com",
        subject="Subject line",
        html_content="<p>Hello</p>",
    )

    body = mock_client.send_email.call_args.kwargs["Message"]["Body"]
    assert "Text" not in body


def test_send_email_reraises_client_error(monkeypatch):
    """SES client failures should be logged and re-raised."""
    error = ClientError(
        {
            "Error": {
                "Code": "MessageRejected",
                "Message": "Email address is not verified",
            }
        },
        "SendEmail",
    )
    mock_client = MagicMock()
    mock_client.send_email.side_effect = error
    monkeypatch.setattr(email_service_module.boto3, "client", MagicMock(return_value=mock_client))
    service = SESEmailService(
        aws_access_key_id="key",
        aws_secret_access_key="secret",
        sender_email="sender@example.com",
    )

    with pytest.raises(ClientError):
        service.send_email(
            to_email="recipient@example.com",
            subject="Subject line",
            html_content="<p>Hello</p>",
        )


def test_get_email_service_returns_singleton(monkeypatch):
    """The accessor should instantiate the service only once."""
    instance = MagicMock(spec=SESEmailService)
    factory = MagicMock(return_value=instance)
    monkeypatch.setattr(email_service_module, "SESEmailService", factory)

    first = get_email_service()
    second = get_email_service()

    assert first is instance
    assert second is instance
    factory.assert_called_once()


def test_send_email_convenience_function_uses_global_service(monkeypatch):
    """The module helper should delegate to the cached service instance."""
    service = MagicMock(spec=SESEmailService)
    service.send_email.return_value = {"success": True}
    monkeypatch.setattr(email_service_module, "get_email_service", MagicMock(return_value=service))

    response = send_email("user@example.com", "Subject", "<p>Hi</p>")

    assert response == {"success": True}
    service.send_email.assert_called_once_with("user@example.com", "Subject", "<p>Hi</p>")
