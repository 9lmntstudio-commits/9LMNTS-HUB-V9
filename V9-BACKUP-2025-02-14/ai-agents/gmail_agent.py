"""
9LMNTS STUDIO - Gmail SMTP Automation Agent
Automates email campaigns, client communication, and professional messaging through Gmail
"""

import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import requests
import json

class GmailAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.app_password = os.getenv("GOOGLE_APP_PASSWORD", "odzf ccmx scdu kerx")
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv("GMAIL_SENDER_EMAIL", "projects@9lmntsstudio.com")
        self.sender_name = "9LMNTS Studio"
        
    def create_smtp_connection(self) -> Optional[smtplib.SMTP]:
        """Create authenticated SMTP connection"""
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.app_password)
            return server
        except Exception as e:
            print(f"❌ SMTP connection error: {str(e)}")
            return None
    
    def create_professional_template(self, template_type: str, data: Dict) -> str:
        """Create professional email templates"""
        templates = {
            'client_welcome': """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to 9LMNTS Studio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #FF7A00; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { background: #FF7A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Welcome to 9LMNTS Studio</h1>
        <p>Your AI-Powered Business Transformation Starts Now!</p>
    </div>
    <div class="content">
        <h2>Hi {name},</h2>
        <p>Thank you for choosing <strong>9LMNTS Studio</strong> for your <strong>{service_type}</strong> project!</p>
        
        <h3>📋 Project Details:</h3>
        <ul>
            <li><strong>Service:</strong> {service_type}</li>
            <li><strong>Budget:</strong> ${budget:,}</li>
            <li><strong>Timeline:</strong> {timeline}</li>
            <li><strong>Project:</strong> {project_name}</li>
        </ul>
        
        <h3>🎯 What Happens Next:</h3>
        <ol>
            <li>Our AI team will review your project within 24 hours</li>
            <li>You'll receive a detailed proposal and timeline</li>
            <li>We'll schedule a consultation meeting to discuss details</li>
            <li>Project kickoff and regular progress updates</li>
        </ol>
        
        <h3>💳 Payment & Project Start:</h3>
        <p>To get started immediately, use your secure payment link:</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="{payment_link}" class="button">
                💰 Pay ${budget:,} - Start Project
            </a>
        </p>
        
        <h3>📅 Schedule Your Consultation:</h3>
        <p>Click here to book your strategy session:</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="{calendar_link}" class="button">
                📅 Schedule Meeting Now
            </a>
        </p>
        
        <h3>📞 Need Help?</h3>
        <p>Reply to this email or call us directly:</p>
        <ul>
            <li>📧 Email: projects@9lmntsstudio.com</li>
            <li>📱 Phone: +1-555-9LMNTS</li>
            <li>🌐 Website: https://9lmntsstudio.com</li>
        </ul>
    </div>
    <div class="footer">
        <p>© 2024 9LMNTS Studio | AI-Powered Business Solutions</p>
        <p>This is an automated message. Reply with any questions!</p>
    </div>
</body>
</html>
            """,
            
            'payment_confirmation': """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Confirmation - 9LMNTS Studio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .payment-details { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💰 Payment Confirmed!</h1>
        <p>Your project is now officially in progress!</p>
    </div>
    <div class="content">
        <h2>Hi {name},</h2>
        <p>Thank you for your payment of <strong>${amount:,}</strong> for <strong>{service_type}</strong>!</p>
        
        <div class="payment-details">
            <h3>📋 Payment Details:</h3>
            <ul>
                <li><strong>Transaction ID:</strong> {transaction_id}</li>
                <li><strong>Amount:</strong> ${amount:,}</li>
                <li><strong>Date:</strong> {payment_date}</li>
                <li><strong>Status:</strong> <span style="color: #28a745;">✅ Confirmed</span></li>
            </ul>
        </div>
        
        <h3>🚀 Project Timeline:</h3>
        <p>Your project is now officially in our queue with the following timeline:</p>
        <ul>
            <li><strong>Today:</strong> Project kickoff and initial consultation</li>
            <li><strong>Week 1:</strong> Strategy development and AI setup</li>
            <li><strong>Week 2:</strong> Implementation and testing</li>
            <li><strong>Week 3:</strong> Review and delivery</li>
            <li><strong>Week 4:</strong> Launch and optimization</li>
        </ul>
        
        <h3>📞 Next Steps:</h3>
        <ol>
            <li>You'll receive a detailed project plan within 24 hours</li>
            <li>Schedule your kickoff meeting (if not already scheduled)</li>
            <li>Receive regular progress updates via email</li>
            <li>Get access to your project dashboard</li>
        </ol>
    </div>
    <div class="footer">
        <p>© 2024 9LMNTS Studio | AI-Powered Business Solutions</p>
        <p>Questions? Reply to this email - we're here to help!</p>
    </div>
</body>
</html>
            """,
            
            'meeting_reminder': """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Meeting Reminder - 9LMNTS Studio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #FF7A00; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .meeting-details { background: #fff3cd; padding: 15px; border-left: 4px solid #FF7A00; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📅 Meeting Reminder</h1>
        <p>Your consultation is scheduled!</p>
    </div>
    <div class="content">
        <h2>Hi {name},</h2>
        <p>This is a friendly reminder about your upcoming consultation meeting:</p>
        
        <div class="meeting-details">
            <h3>📋 Meeting Details:</h3>
            <ul>
                <li><strong>Date:</strong> {meeting_date}</li>
                <li><strong>Time:</strong> {meeting_time}</li>
                <li><strong>Duration:</strong> {meeting_duration}</li>
                <li><strong>Location:</strong> <a href="{meeting_link}">Video Conference Link</a></li>
                <li><strong>Topic:</strong> {service_type} Strategy Session</li>
            </ul>
        </div>
        
        <h3>🎯 Meeting Agenda:</h3>
        <ol>
            <li>Project requirements and goals discussion</li>
            <li>AI strategy and automation recommendations</li>
            <li>Timeline and deliverables review</li>
            <li>Budget and payment confirmation</li>
            <li>Next steps and project kickoff</li>
        </ol>
        
        <h3>📱 How to Join:</h3>
        <ol>
            <li>Click the video conference link above 5 minutes before start</li>
            <li>Test your camera and microphone beforehand</li>
            <li>Use Chrome or Firefox for best compatibility</li>
            <li>Have your project details ready for discussion</li>
        </ol>
        
        <h3>📞 Need to Reschedule?</h3>
        <p>Reply to this email or call us:</p>
        <ul>
            <li>📧 Email: projects@9lmntsstudio.com</li>
            <li>📱 Phone: +1-555-9LMNTS</li>
            <li>🔄 Reschedule: Reply with preferred times</li>
        </ul>
    </div>
    <div class="footer">
        <p>© 2024 9LMNTS Studio | Looking forward to meeting you!</p>
        <p>We're excited to transform your business with AI! 🚀</p>
    </div>
</body>
</html>
            """
        }
        
        template = templates.get(template_type, "")
        return template.format(**data)
    
    def send_welcome_email(self, client_data: Dict) -> bool:
        """Send professional welcome email to new client"""
        try:
            # Create email content
            subject = f"🚀 Welcome to 9LMNTS Studio - {client_data['service_type']} Project"
            
            html_content = self.create_professional_template('client_welcome', {
                'name': client_data.get('name', ''),
                'service_type': client_data.get('service_type', ''),
                'budget': client_data.get('budget', 0),
                'timeline': client_data.get('timeline', ''),
                'project_name': client_data.get('project_name', ''),
                'payment_link': f"https://PayPal.Me/9LMNTSSTUDIO/{client_data.get('budget', 1000)}",
                'calendar_link': "https://calendly.com/9lmntsstudio"  # Placeholder
            })
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.sender_name} <{self.sender_email}>"
            msg['To'] = client_data.get('email', '')
            
            # Attach HTML content
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            server = self.create_smtp_connection()
            if server:
                server.send_message(msg)
                server.quit()
                print(f"✅ Welcome email sent to: {client_data.get('email')}")
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error sending welcome email: {str(e)}")
            return False
    
    def send_campaign_email(self, recipients: List[str], campaign_data: Dict) -> bool:
        """Send marketing campaign to multiple recipients"""
        try:
            success_count = 0
            
            for recipient in recipients:
                # Create campaign email
                subject = campaign_data.get('subject', '🚀 Special Offer from 9LMNTS Studio')
                
                html_content = self.create_professional_template('client_welcome', {
                    'name': recipient.split('@')[0],  # Extract name from email
                    'service_type': campaign_data.get('service_type', 'AI Services'),
                    'budget': campaign_data.get('budget', 2000),
                    'timeline': campaign_data.get('timeline', 'ASAP'),
                    'project_name': campaign_data.get('project_name', 'Business Transformation'),
                    'payment_link': campaign_data.get('payment_link', 'https://PayPal.Me/9LMNTSSTUDIO/2000'),
                    'calendar_link': campaign_data.get('calendar_link', 'https://calendly.com/9lmntsstudio')
                })
                
                # Create message
                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = f"{self.sender_name} <{self.sender_email}>"
                msg['To'] = recipient
                
                # Attach HTML content
                msg.attach(MIMEText(html_content, 'html'))
                
                # Send email
                server = self.create_smtp_connection()
                if server:
                    server.send_message(msg)
                    success_count += 1
                    print(f"✅ Campaign email sent to: {recipient}")
            
            if server:
                server.quit()
            
            print(f"📧 Campaign completed: {success_count}/{len(recipients)} emails sent")
            return success_count > 0
            
        except Exception as e:
            print(f"❌ Error sending campaign: {str(e)}")
            return False
    
    def send_payment_confirmation(self, payment_data: Dict) -> bool:
        """Send payment confirmation email"""
        try:
            subject = f"💰 Payment Confirmed - {payment_data['service_type']} Project"
            
            html_content = self.create_professional_template('payment_confirmation', {
                'name': payment_data.get('name', ''),
                'service_type': payment_data.get('service_type', ''),
                'amount': payment_data.get('amount', 0),
                'transaction_id': payment_data.get('transaction_id', ''),
                'payment_date': datetime.now().strftime("%B %d, %Y")
            })
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.sender_name} <{self.sender_email}>"
            msg['To'] = payment_data.get('email', '')
            
            # Attach HTML content
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            server = self.create_smtp_connection()
            if server:
                server.send_message(msg)
                server.quit()
                print(f"✅ Payment confirmation sent to: {payment_data.get('email')}")
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error sending payment confirmation: {str(e)}")
            return False
    
    def send_meeting_reminder(self, meeting_data: Dict) -> bool:
        """Send meeting reminder email"""
        try:
            subject = f"📅 Meeting Reminder - 9LMNTS Studio Consultation"
            
            html_content = self.create_professional_template('meeting_reminder', {
                'name': meeting_data.get('name', ''),
                'service_type': meeting_data.get('service_type', ''),
                'meeting_date': meeting_data.get('meeting_date', ''),
                'meeting_time': meeting_data.get('meeting_time', ''),
                'meeting_duration': meeting_data.get('meeting_duration', '60 minutes'),
                'meeting_link': meeting_data.get('meeting_link', '')
            })
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.sender_name} <{self.sender_email}>"
            msg['To'] = meeting_data.get('email', '')
            
            # Attach HTML content
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            server = self.create_smtp_connection()
            if server:
                server.send_message(msg)
                server.quit()
                print(f"✅ Meeting reminder sent to: {meeting_data.get('email')}")
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error sending meeting reminder: {str(e)}")
            return False
    
    def send_automated_follow_up(self, follow_up_data: Dict) -> bool:
        """Send automated follow-up email"""
        try:
            subject = f"🎯 Following Up - {follow_up_data['service_type']} Project"
            
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Follow Up - 9LMNTS Studio</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .header {{ background: #FF7A00; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background: #f9f9f9; }}
        .footer {{ background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Checking In</h1>
        <p>Following up on your project inquiry</p>
    </div>
    <div class="content">
        <h2>Hi {follow_up_data.get('name', '')},</h2>
        <p>I hope you're doing well! I wanted to follow up on your <strong>{follow_up_data.get('service_type', '')}</strong> project from {follow_up_data.get('days_ago', 'a few days ago')}.</p>
        
        <h3>🚀 Ready to Transform Your Business?</h3>
        <p>Our AI-powered solutions are designed to:</p>
        <ul>
            <li>Automate your workflows</li>
            <li>Increase your revenue</li>
            <li>Save you time and money</li>
            <li>Scale your operations</li>
        </ul>
        
        <h3>💳 Special Offer - Expires Soon:</h3>
        <p>As a follow-up incentive, we're offering <strong>20% OFF</strong> if you start this week!</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="{follow_up_data.get('payment_link', 'https://PayPal.Me/9LMNTSSTUDIO/2000')}" style="background: #FF7A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                💰 Save 20% - Start Project Now
            </a>
        </p>
        
        <h3>📞 Questions?</h3>
        <p>I'm here to help with any questions about your project!</p>
        <ul>
            <li>📧 Reply to this email</li>
            <li>📱 Call: +1-555-9LMNTS</li>
            <li>📅 Schedule a meeting: <a href="https://calendly.com/9lmntsstudio">Book Now</a></li>
        </ul>
    </div>
    <div class="footer">
        <p>© 2024 9LMNTS Studio | AI-Powered Business Solutions</p>
        <p>This offer expires in 48 hours. Don't miss out! 🚀</p>
    </div>
</body>
</html>
            """
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.sender_name} <{self.sender_email}>"
            msg['To'] = follow_up_data.get('email', '')
            
            # Attach HTML content
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            server = self.create_smtp_connection()
            if server:
                server.send_message(msg)
                server.quit()
                print(f"✅ Follow-up sent to: {follow_up_data.get('email')}")
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error sending follow-up: {str(e)}")
            return False
    
    def send_email_activity_to_n8n(self, activity_data: Dict):
        """Send email activity data to n8n workflow"""
        try:
            payload = {
                'event_type': 'email_sent',
                'activity': activity_data,
                'source': 'gmail_automation',
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Email activity sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send to n8n: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending to n8n: {str(e)}")
