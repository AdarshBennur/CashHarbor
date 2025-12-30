# 🔒 Gmail Connection - What Users Should Know

## Is It Safe to Connect My Gmail?

**YES!** Here's exactly what happens when you click "Connect Gmail":

---

## What We Ask For

**Permission**: Read-only access to your Gmail  
**Scope**: `gmail.readonly`

This means we can:

- ✅ Read your emails

This means we **CANNOT**:

- ❌ Send emails for you
- ❌ Delete your emails
- ❌ Modify your emails
- ❌ Access your contacts
- ❌ Access your Google Drive
- ❌ Access any other Google services

---

## What Emails We Look At

We **ONLY** fetch emails that match:

1. **From**: Banks, payment apps, financial institutions
   - ICICI, HDFC, Axis, SBI banks
   - Paytm, PhonePe, Google Pay
   - Amazon Pay, Razorpay, etc.

2. **Subject Contains**: Transaction keywords
   - "Payment", "Credited", "Debited", "Transaction"

3. **Time Period**: Last 30 days only

**We skip everything else!**

---

## What Happens to Your Emails

### Step 1: We Fetch Transaction Emails

```
Example email fetched:
"Rs. 1,234 debited from account XX1234 
 at Amazon on 30-Dec-2025"
```

### Step 2: We Extract the Important Parts

```
Extracted data:
- Amount: Rs. 1,234
- Merchant: Amazon
- Date: 30-Dec-2025
- Category: Shopping
```

### Step 3: We Discard the Email

```
❌ Email content deleted from memory
✅ Only transaction data kept
```

---

## What We Store

| Data | Stored? | Why? |
|------|---------|------|
| Transaction amount | ✅ Yes | Track your spending |
| Merchant name | ✅ Yes | Know where money went |
| Transaction date | ✅ Yes | Track over time |
| Category | ✅ Yes | Budget by category |
| Gmail Message ID | ✅ Yes | Prevent duplicates |
| **Email content** | ❌ **NO** | Not needed |
| **Personal emails** | ❌ **NO** | Never accessed |
| **Full account numbers** | ❌ **NO** | Only last 4 digits |

---

## How We Protect Your Data

### 1. Military-Grade Encryption 🔐

Your Gmail access tokens are encrypted using **AES-256-GCM**

- Same algorithm used by US Government for classified data
- Impossible to decrypt without the encryption key
- Key stored separately, never in code

### 2. Minimal Permissions 🛡️

We ask for the **least access possible**

- Read-only (can't change anything in your Gmail)
- Only transaction emails (not personal messages)
- Recent transactions only (last 30 days)

### 3. No Data Sharing 🚫

- We never share your Gmail data with anyone
- We never sell your data
- We never use it for advertising

---

## How to Disconnect

**Two ways** to revoke access anytime:

### Option 1: In Our App

1. Go to Profile page
2. Click "Disconnect Gmail"
3. Done! Access revoked instantly

### Option 2: In Google

1. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
2. Find "CashHarbor" or your app name
3. Click "Remove Access"

**After revoking**:

- We can no longer access your Gmail
- All stored tokens are deleted
- Transaction data remains (for your records)

---

## Common Questions

### Q: Can you read my personal emails?

**A**: No. We only fetch emails from banks with transaction keywords.

### Q: Can you send emails from my account?

**A**: No. We have read-only permission.

### Q: Do you store my emails?

**A**: No. We extract transaction data and immediately discard the email.

### Q: What if I change my Gmail password?

**A**: Your connection stays active. OAuth tokens are separate from your password.

### Q: Can I see what data you collected?

**A**: Yes! All parsed transactions appear in your Expenses page.

### Q: What if I disconnect?

**A**: We stop accessing your Gmail. Your transaction history remains in the app.

---

## Why You Should Trust Us

✅ **Open Source**: Our code is public on GitHub  
✅ **Industry Standard**: Uses Google's official OAuth 2.0  
✅ **Minimal Access**: Least permissions principle  
✅ **Encrypted Storage**: Military-grade encryption  
✅ **User Control**: Revoke anytime  
✅ **Transparent**: You see exactly what we fetch  

---

## Technical Details (For Security Professionals)

**OAuth Scope**: `https://www.googleapis.com/auth/gmail.readonly`  
**Encryption**: AES-256-GCM with random IV per encryption  
**Token Storage**: MongoDB with `select: false` on token fields  
**HTTPS**: All production traffic encrypted in transit  
**Compliance**: GDPR-compliant, OWASP-secure  

Full security audit: [SECURITY_VERIFICATION.md](./SECURITY_VERIFICATION.md)

---

## Bottom Line

Connecting your Gmail is:

- ✅ **Safe**: Military-grade encryption
- ✅ **Private**: Only transaction emails
- ✅ **Transparent**: You control everything
- ✅ **Revocable**: Disconnect anytime

**Your Gmail stays yours. We just help track your spending.**
