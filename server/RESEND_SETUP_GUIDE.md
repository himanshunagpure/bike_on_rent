# Resend Email Setup Guide - Complete Solution

## ⚠️ Current Problem
Your OTP emails are only received once because:
- **RESEND_FROM = `onboarding@resend.dev`** (Resend's test email)
- This address is **rate-limited** for demo/testing
- Resend restricts repeated emails from test addresses

## ✅ Solution: Verify Your Domain

### Option 1: Add Your Domain (RECOMMENDED)

#### Step 1: Go to Resend Console
```
https://resend.com/dashboard
```

#### Step 2: Add Domain
1. Click **"Domains"** (left sidebar)
2. Click **"+ Add Domain"**
3. Enter your domain: `wheelsonrent.online`
4. Add the DNS records shown in Resend:
   - **TXT Record**: For domain verification
   - **CNAME Record**: For email routing (optional but recommended)

#### Step 3: Wait for Verification
- Usually takes 5-10 minutes
- Resend will show ✅ when verified

#### Step 4: Update `.env`
```env
RESEND_FROM=BikeOnRent <noreply@wheelsonrent.online>
```

---

### Option 2: Use Verified Email (QUICK FIX)

If you can't modify DNS records, verify your email:

1. Go to Resend Dashboard
2. Click **"Senders"** (left sidebar)
3. Click **"+ Add Sender"**
4. Enter your email: `your-email@gmail.com`
5. Click verification link sent to your email
6. Update `.env`:
```env
RESEND_FROM=BikeOnRent <your-email@gmail.com>
```

---

## 📋 Current Configuration

### Your `.env` File
```env
RESEND_API_KEY=re_bqWGm7Mn_BMxwGzmZr15KXEb1ohxKNCn6
RESEND_FROM=BikeOnRent <onboarding@resend.dev>  ❌ TEST EMAIL
APP_DOMAIN_FRONTEND=https://wheelsonrent.online
```

### After Fix:
```env
RESEND_API_KEY=re_bqWGm7Mn_BMxwGzmZr15KXEb1ohxKNCn6
RESEND_FROM=BikeOnRent <noreply@wheelsonrent.online>  ✅ VERIFIED
APP_DOMAIN_FRONTEND=https://wheelsonrent.online
```

---

## 🧪 How to Test

### After updating `.env`:

1. **Restart your server:**
   ```bash
   npm run dev
   ```

2. **Test Registration:**
   ```
   - Go to http://localhost:3000
   - Sign up with a test email
   - Check console for: ✅ Email sent successfully!
   - Check your email inbox
   ```

3. **Test Resend OTP:**
   ```
   - During registration verification step
   - Click "Resend OTP"
   - Should receive new OTP email immediately
   - Try clicking multiple times
   - Should receive all emails (no rate limiting)
   ```

4. **Check Server Logs:**
   ```
   📧 Sending email to: your-email@gmail.com
   📧 From: BikeOnRent <noreply@wheelsonrent.online>
   📧 Subject: BIKEONRENT Email Verification OTP
   ✅ Email sent successfully!
   📧 Email ID: <resend-message-id>
   ```

---

## 🐛 Debugging Email Issues

### If emails still don't arrive:

1. **Check spam folder** - Resend emails sometimes go to spam initially
2. **Verify the sender address** - Go to Resend dashboard and confirm domain/email is verified
3. **Check Resend logs** - Visit https://resend.com/emails to see delivery status
4. **Verify API key** - Make sure `RESEND_API_KEY` is correct (starts with `re_`)
5. **Check email domain** - If using custom domain, ensure DNS records are added correctly

### Server Console Logs to Look For:

```javascript
// GOOD ✅
📧 Sending email to: user@example.com
📧 From: BikeOnRent <noreply@wheelsonrent.online>
✅ Email sent successfully!

// BAD ❌
RESEND_FROM is not set in environment
sendEmail FAILED: Invalid recipient email
```

---

## 📊 Email Delivery Timeline

### Expected Behavior After Fix:

| Action | Expected Time |
|--------|---|
| Click Register | Immediate |
| OTP Email 1 | 1-3 seconds |
| Click Resend | Immediate |
| OTP Email 2 | 1-3 seconds |
| Click Resend Again | Immediate |
| OTP Email 3 | 1-3 seconds |

✅ **No rate limiting** with verified domain

---

## 🔗 Useful Links

- **Resend Dashboard:** https://resend.com/dashboard
- **Resend Documentation:** https://resend.com/docs
- **Email Logs:** https://resend.com/emails
- **Domain Verification Guide:** https://resend.com/docs/concepts/domains

---

## Summary

1. ✅ Your code is correct
2. ❌ Your sender address is using Resend's test email (limited)
3. 📝 Add your domain OR verify an email in Resend
4. 🔄 Update `.env` with the verified sender
5. 🚀 Restart server and test

Once domain is verified, you'll have **unlimited OTP sends** with no rate limiting!
