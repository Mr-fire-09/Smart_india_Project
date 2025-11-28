# 📧 OTP Email Troubleshooting Guide for Rating Feature

## ✅ What I Just Fixed:
1. Added support for "feedback" purpose in email templates
2. Enhanced console logging with emojis for easy debugging
3. Added DEV MODE fallback - **OTP will be shown in console if email fails**

## 🔍 How to Check if OTP is Working:

### Step 1: Check Server Console
When you try to submit a rating, look for these logs:

```
📧 Attempting to send OTP email for feedback to: user@example.com
✅ Email OTP sent successfully to user@example.com for feedback
```

**OR in Development Mode (if email fails):**
```
🔑 DEV MODE - OTP for user@example.com: 123456
```

### Step 2: Common Issues & Solutions

#### ❌ Issue 1: "EAUTH - Email authentication failed"
**Solution:**
1. Check your `.env` file has:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password  # NOT your regular password!
   ```

2. **For Gmail users**, you need an **App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Generate a new app password
   - Use that 16-character password in `.env`

#### ❌ Issue 2: "No .env file" or "Email not configured"
**Solution:**
1. Create `.env` file in project root
2. Copy from `.env.example`:
   ```bash
   # Windows CMD
   copy .env.example .env
   
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

3. Edit `.env` with your actual credentials

#### ❌ Issue 3: "Connection timeout"
**Solution:**
- Check internet connection
- Try port 465 instead of 587:
  ```env
  SMTP_PORT=465
  ```

#### ❌ Issue 4: OTP not in inbox
**Solutions:**
1. **Check Spam/Junk folder**
2. **Wait 1-2 minutes** (sometimes delayed)
3. **Check console for DEV MODE OTP** (see below)

## 🛠️ Development Mode Testing

If email is not configured, you can still test! The OTP will appear in the **server console**.

### To see the OTP in console:
1. Start your server: `npm run dev`
2. Try to submit a rating
3. Look for this in the terminal:
   ```
   🔑 DEV MODE - OTP for user@example.com: 123456
   ```
4. Use that 6-digit code in the OTP modal

## ✅ Quick Test Steps:

1. **Make sure server is running:**
   ```bash
   npm run dev
   ```

2. **Keep the terminal visible** to see logs

3. **Try to rate an official:**
   - Go to an approved application
   - Click "Submit Rating"
   - Fill in stars and comment
   - Click submit

4. **Watch the console for:**
   ```
   📧 Attempting to send OTP email for feedback to: your-email@example.com
   ```

5. **Check your email inbox OR console for OTP**

## 📧 Gmail Setup (Recommended)

### Step-by-Step:
1. **Enable 2-Step Verification:**
   - https://myaccount.google.com/signinoptions/two-step-verification

2. **Generate App Password:**
   - https://myaccount.google.com/apppasswords
   - Select "Other (Custom name)"
   - Name it: "Digital Governance"
   - Copy the 16-character password

3. **Update .env:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # The 16-char app password
   ```

4. **Restart server** for changes to take effect

## 🔧 Alternative: Use Console OTP (No Email Setup)

If you don't want to configure email right now:

1. Just run the app
2. When you submit rating, **check the server console**
3. You'll see: `🔑 DEV MODE - OTP for user@example.com: 123456`
4. Copy that 6-digit code
5. Paste it in the OTP modal
6. Done! ✅

## 📝 Current Status:

✅ OTP generation endpoint: `/api/otp/generate` - **Working**
✅ Email template with "feedback" purpose - **Added**
✅ Console fallback for DEV mode - **Added**
✅ Enhanced error logging - **Added**

## 🎯 Expected Flow:

```
User clicks "Submit Rating"
    ↓
System calls /api/otp/generate
    ↓
Console shows: "📧 Attempting to send OTP..."
    ↓
Either:
  ✅ Email sent → "✅ Email OTP sent successfully..."
  OR
  ❌ Email failed → "🔑 DEV MODE - OTP: 123456"
    ↓
User enters OTP from email OR console
    ↓
Rating submitted!
```

## ❓ Still Not Working?

**Check these in order:**

1. ✅ Server is running (`npm run dev`)
2. ✅ You're logged in as a citizen
3. ✅ Application is in "Approved" status
4. ✅ You haven't already rated this application
5. ✅ Console is visible to see logs
6. ✅ Check console for "🔑 DEV MODE - OTP: ..." message

## 🎉 Success Indicators:

You'll know it's working when you see:
- ✅ Toast notification: "OTP Sent to your email"
- ✅ OTP modal appears
- ✅ Console shows: "✅ Email OTP sent successfully..."
- ✅ Email arrives in inbox (or OTP in console)

---

**Need help?** Check the server console logs - they now have helpful emojis (📧, ✅, ❌, 🔑) to quickly identify what's happening!
