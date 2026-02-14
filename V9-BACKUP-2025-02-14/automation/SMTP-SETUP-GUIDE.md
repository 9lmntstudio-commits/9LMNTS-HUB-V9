# 🚀 n8n SMTP SETUP GUIDE - Email Configuration

## 📧 SMTP CREDENTIALS NEEDED

### **Option 1: Gmail (Recommended)**
```
Host: smtp.gmail.com
Port: 465
Username: your-email@gmail.com
Password: your-app-password (not regular password!)
Encryption: SSL/TLS
```

### **Option 2: SendGrid (Professional)**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
Encryption: TLS
```

### **Option 3: Outlook/Hotmail**
```
Host: smtp-mail.outlook.com
Port: 587
Username: your-email@outlook.com
Password: your-password
Encryption: STARTTLS
```

## 🎯 STEP-BY-STEP SETUP

### **1. Get SMTP Credentials**

#### **For Gmail:**
1. Go to: https://myaccount.google.com/
2. Enable **2-Step Verification**
3. Go to: https://myaccount.google.com/apppasswords
4. Create **App Password**
5. Use this password (not your regular password!)

#### **For SendGrid:**
1. Sign up: https://sendgrid.com/
2. Verify your email
3. Get API Key from Settings → API Keys
4. Create new API key

### **2. Configure n8n SMTP**

1. In n8n, go to **"Credentials"** (left menu)
2. Click **"Add credential"**
3. Select **"Send Email"** node type
4. Choose **"SMTP"** connection
5. Fill in your SMTP details:
   ```
   Host: smtp.gmail.com
   Port: 465
   Username: your-email@gmail.com
   Password: your-app-password
   Security: SSL/TLS
   ```

### **3. Update Email Node in Workflow**

1. Open your **"9LMNTS Lead Pipeline"** workflow
2. Click on **"Send Email"** nodes
3. Click **"Credentials"** dropdown
4. Select your new SMTP credential
5. Update **"From Email"** to: `info@9lmntsstudio.com`

## 📧 QUICK SETUP OPTIONS

### **Option A: Use Your Gmail**
1. Create Gmail App Password
2. Use these settings:
   - Host: `smtp.gmail.com`
   - Port: `465`
   - Username: `your-email@gmail.com`
   - Password: `your-app-password`

### **Option B: Use SendGrid (More Reliable)**
1. Sign up for free SendGrid account
2. Use these settings:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `YOUR_SENDGRID_API_KEY`

### **Option C: Use n8n Built-in Email**
1. In n8n, go to **"Settings"**
2. Find **"Community Nodes"**
3. Install **"Gmail"** or **"SendGrid"** node
4. Use OAuth instead of SMTP

## 🔄 TEST YOUR EMAIL SETUP

### **Test with Sample Data:**
1. Execute your workflow
2. Use test email: `your-email@test.com`
3. Check if email arrives
4. Verify PayPal links work

## 📊 WORKFLOW EMAIL TEMPLATES

### **High-Value Email Template:**
```
Subject: 🚀 URGENT: Your 9LMNTS Project - Special Offer Inside!

Body:
Hi {{ $json.lead.name }},

🔥 HIGH VALUE LEAD - 20% DISCOUNT!

{{ $json.qualification.message }}

Package: {{ $json.lead.service_type }}
Payment Link: {{ $json.payment_link }}

Limited to first 5 high-value clients!
Questions? Reply to this email.
```

### **Standard Email Template:**
```
Subject: 📋 Your 9LMNTS Project Details

Body:
Hi {{ $json.lead.name }},

Thank you for your interest in {{ $json.lead.service_type }}!

{{ $json.qualification.message }}

Payment Link: {{ $json.payment_link }}

We'll send your detailed proposal within 24 hours.

Best regards,
9LMNTS Studio Team
```

## 🎯 RECOMMENDED SETUP

### **For Immediate Use:**
1. **Use Gmail** if you have Gmail account
2. **Create App Password** (2 minutes)
3. **Configure in n8n** (2 minutes)
4. **Test workflow** (1 minute)

### **For Professional Use:**
1. **Use SendGrid** (more reliable)
2. **Free plan = 100 emails/day**
3. **Better deliverability**
4. **Professional tracking**

## ✅ VERIFICATION CHECKLIST

After setup, verify:
- [ ] SMTP credentials saved in n8n
- [ ] Email nodes use correct credentials
- [ ] "From email" = info@9lmntsstudio.com
- [ ] Test email sends successfully
- [ ] PayPal links work in emails
- [ ] Workflow executes without errors

## 🚀 ONCE EMAIL IS WORKING

Your complete automation will:
1. ✅ Receive leads from website
2. ✅ Qualify with AI scoring
3. ✅ Generate PayPal payment links
4. ✅ Send personalized emails
5. ✅ Track in Notion database
6. ✅ Make money automatically!

**You'll have a complete money-making machine!** 💰

---

## 🆘️ TROUBLESHOOTING

**Gmail Issues:**
- Enable 2-Step Verification
- Use App Password (not regular password)
- Check "Less secure app access" settings

**SendGrid Issues:**
- Verify API key is correct
- Check sender verification
- Ensure domain is verified

**General Issues:**
- Check firewall blocks port 465/587
- Verify username/password exactly
- Test with "Execute workflow" button

**Need more help?** Just tell me which email service you want to use!
