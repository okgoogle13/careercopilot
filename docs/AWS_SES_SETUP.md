# AWS SES Setup Guide for CareerCopilot

This guide walks you through setting up AWS Simple Email Service (SES) with your Gmail as a free sender.

## Overview

CareerCopilot has been migrated from SendGrid to AWS SES for email notifications. This setup is **100% free** using:
- AWS SES free tier: 62,000 emails/month
- Your Gmail as verified sender (no domain purchase needed)

## Prerequisites

- AWS Account (free to create)
- Gmail address for sending emails
- Google Cloud SDK (`gcloud`) installed
- GitHub CLI (`gh`) installed (optional, for GitHub Secrets)

---

## Step 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow the signup process (requires credit card for verification, but won't be charged for free tier usage)

---

## Step 2: Verify Your Gmail in AWS SES

### 2.1 Navigate to SES Console
1. Login to AWS Console: https://console.aws.amazon.com
2. Search for "SES" in the top search bar
3. Click "Simple Email Service"
4. **Important**: Select region **us-east-1** (N. Virginia) in the top-right dropdown

### 2.2 Verify Email Address
1. In SES Console, click "Verified identities" (left sidebar)
2. Click "Create identity" button
3. Select "Email address"
4. Enter your Gmail address (e.g., `yourname@gmail.com`)
5. Click "Create identity"

### 2.3 Check Gmail for Verification
1. Open Gmail inbox
2. Look for email from "Amazon Web Services" with subject "Amazon SES Email Address Verification Request"
3. Click the verification link in the email
4. You should see "Congratulations! You have successfully verified..."

### 2.4 Verify Status
1. Return to SES Console → Verified identities
2. Your email should show status: **Verified** ✅

---

## Step 3: Create IAM User for SES Access

### 3.1 Navigate to IAM
1. AWS Console → Search for "IAM"
2. Click "IAM" (Identity and Access Management)

### 3.2 Create User
1. Click "Users" in left sidebar
2. Click "Create user" button
3. **User name**: `careercopilot-ses-user`
4. **Do NOT** check "Provide user access to AWS Management Console"
5. Click "Next"

### 3.3 Set Permissions
1. Select "Attach policies directly"
2. In search box, type: `AmazonSESFullAccess`
3. ✅ Check the box next to "AmazonSESFullAccess"
4. Click "Next"

### 3.4 Review and Create
1. Review the settings
2. Click "Create user"

### 3.5 Create Access Key
1. Click on the newly created user (`careercopilot-ses-user`)
2. Go to "Security credentials" tab
3. Scroll to "Access keys" section
4. Click "Create access key"
5. Select use case: "Application running outside AWS"
6. Click "Next"
7. (Optional) Add description: "CareerCopilot Email Service"
8. Click "Create access key"

### 3.6 Save Credentials ⚠️ IMPORTANT
You'll see:
- **Access key ID**: 20 characters (e.g., `AKIAIOSFODNN7EXAMPLE`)
- **Secret access key**: 40 characters (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

**⚠️ WARNING**: You can only see the secret key ONCE. Save it now!

Options:
- Click "Download .csv file" (recommended)
- Copy both values to a secure note

---

## Step 4: Request Production Access (Optional but Recommended)

By default, SES is in "sandbox mode" with limitations:
- Can only send to verified email addresses
- Limited to 200 emails/day

To remove these limits:

### 4.1 Request Production Access
1. SES Console → Click "Account dashboard" (left sidebar)
2. Scroll to "Sending statistics" section
3. Click "Request production access" button
4. Fill out the form:
   - **Mail Type**: Transactional
   - **Website URL**: `https://careercopilot-468811.web.app`
   - **Use case description**:
     ```
     CareerCopilot sends job opportunity notification emails to users
     who have signed up for our career management platform. Emails are
     sent only to users who have created accounts and opted in to receive
     notifications about relevant job opportunities.
     ```
   - **Compliance**: Check the box
5. Click "Submit request"

### 4.2 Wait for Approval
- Usually approved within **24 hours**
- You'll receive an email notification
- You can use SES in sandbox mode while waiting

---

## Step 5: Add Credentials to Google Cloud Secret Manager

### 5.1 Run Setup Script
```bash
# From project root
chmod +x scripts/setup-aws-ses-secrets.sh
./scripts/setup-aws-ses-secrets.sh
```

When prompted, enter:
1. **AWS Access Key ID**: From Step 3.6
2. **AWS Secret Access Key**: From Step 3.6
3. **SES Sender Email**: Your verified Gmail address

### 5.2 Grant Cloud Run Access
Find your Cloud Run service account:
```bash
gcloud run services describe backend --region=us-central1 --format="value(spec.template.spec.serviceAccountName)"
```

Then grant access to each secret:
```bash
SERVICE_ACCOUNT="YOUR-SERVICE-ACCOUNT@careercopilot-468811.iam.gserviceaccount.com"

gcloud secrets add-iam-policy-binding aws-access-key-id \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding aws-secret-access-key \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding ses-sender-email \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Step 6: Add to GitHub Secrets (Optional - For CI/CD)

If you want to test email functionality in CI/CD:

```bash
gh secret set AWS_ACCESS_KEY_ID
# Paste your access key when prompted

gh secret set AWS_SECRET_ACCESS_KEY
# Paste your secret key when prompted

gh secret set SES_SENDER_EMAIL
# Paste your Gmail when prompted

gh secret set AWS_REGION --body "us-east-1"
```

---

## Step 7: Verify Configuration

### 7.1 Run Validator
```bash
python3 scripts/production-secrets-validator.py
```

You should see:
```
✅ aws-access-key-id: Valid
✅ aws-secret-access-key: Valid
✅ ses-sender-email: Valid
```

### 7.2 Test Email Locally (Optional)
Create a test script:
```python
# test_ses_email.py
import os
os.environ['AWS_ACCESS_KEY_ID'] = 'YOUR_ACCESS_KEY'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'YOUR_SECRET_KEY'
os.environ['SES_SENDER_EMAIL'] = 'your-email@gmail.com'

from backend.app.services.email_service import send_email

result = send_email(
    to_email="your-email@gmail.com",  # Send to yourself for testing
    subject="Test Email from CareerCopilot",
    html_content="<h1>Hello!</h1><p>This is a test email from AWS SES.</p>"
)

print(f"Email sent! Message ID: {result['message_id']}")
```

Run:
```bash
python test_ses_email.py
```

---

## Troubleshooting

### Issue: Email not received
**Check:**
1. ✅ Email address is verified in SES Console
2. ✅ AWS credentials are correct
3. ✅ Check spam/junk folder
4. ✅ If in sandbox mode, recipient must also be verified

### Issue: "Email address not verified" error
**Solution:**
1. Go to SES Console → Verified identities
2. Verify your email address is listed with status "Verified"
3. Make sure you're using the exact email address (case-sensitive)

### Issue: "Access Denied" or "Credentials Invalid"
**Solution:**
1. Verify IAM user has `AmazonSESFullAccess` policy
2. Regenerate access key if needed (IAM → Users → Security credentials)
3. Make sure you copied the full secret key (40 characters)

### Issue: Daily sending limit exceeded
**Solution:**
- You're in sandbox mode with 200/day limit
- Request production access (Step 4)
- Or wait 24 hours for limit to reset

---

## Cost Summary

| Service | Cost |
|---------|------|
| AWS Account | Free |
| SES Email Sending | **62,000 emails/month FREE** |
| Domain Verification | Not needed (using Gmail) - **$0** |
| IAM User | Free |
| **Total** | **$0/month** |

---

## Security Notes

1. **Never commit credentials to git**
   - ✅ Stored in Google Cloud Secret Manager
   - ✅ Stored in GitHub Secrets
   - ❌ Never in `.env` files committed to repo

2. **Rotate credentials periodically**
   - Create new access key every 6-12 months
   - Delete old access key after updating secrets

3. **Monitor usage**
   - AWS SES Console → Account dashboard → Sending statistics
   - Stay within free tier limits

---

## Next Steps

After setup is complete:
1. ✅ Deploy your application
2. ✅ Monitor email delivery in AWS SES Console
3. ✅ Request production access to remove sandbox limits
4. ✅ Set up SES sending statistics and bounce handling (optional)

---

## Support

- **AWS SES Documentation**: https://docs.aws.amazon.com/ses/
- **SES Pricing**: https://aws.amazon.com/ses/pricing/
- **IAM Best Practices**: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
