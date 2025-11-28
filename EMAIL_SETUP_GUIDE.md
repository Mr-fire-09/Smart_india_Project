# Email Configuration Fix Guide

## Issue
Gmail SMTP authentication is failing with error:
```
535-5.7.8 Username and Password not accepted
```

## Solution

Gmail requires an **App Password** instead of your regular account password when using SMTP with third-party applications.

### Steps to Generate an App Password:

1. **Enable 2-Factor Authentication** (if not already enabled)
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select your device type
   - Click "Generate"
   - Google will show you a 16-character password

3. **Update your .env file**
   - Open `D:\Smart_india_Project\.env`
   - Update the following fields:
     ```
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=xxxx xxxx xxxx xxxx  # Use the 16-character app password (spaces optional)
     ```

4. **Restart your server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

### Alternative: Use a different email service

If you don't want to use Gmail, you can use other SMTP services:

**Outlook/Hotmail:**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Yahoo:**
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password  # Yahoo also requires app passwords
```

### Testing

After updating your credentials, the server will automatically verify the email configuration on startup. You should see:
```
✓ Email server verification successful
```

If you continue to see errors, check:
- Email address is correct
- App password has no spaces (or spaces are preserved correctly)
- 2FA is enabled on your Google account
- You're using the app password, not your regular password
