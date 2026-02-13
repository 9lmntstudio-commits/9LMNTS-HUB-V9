"""
9LMNTS STUDIO - Twilio SMS Automation Agent
Automates SMS notifications, reminders, and communication using Twilio API
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

class TwilioAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.account_sid = "ACf8b3fbae-d292-418b-ae66-113a5a2f21dd"  # From your code
        self.auth_token = "SF86N57AJS4KCS96H6VC9832"  # From your file
        self.twilio_number = "+1234567890"  # Will need actual Twilio number
        
        try:
            self.client = Client(self.account_sid, self.auth_token)
            self.twilio_active = True
            print("✅ Twilio client initialized")
        except Exception as e:
            print(f"⚠️ Twilio initialization failed: {str(e)}")
            self.twilio_active = False
            self.client = None
        
        # Message templates
        self.message_templates = {
            'welcome': {
                'template': "🚀 Welcome to 9LMNTS Studio, {name}! Your {service_type} project is now in our system. Next steps: 1) Check your email for details 2) Schedule your consultation 3) Make payment to begin. Questions? Reply HELP or call +1-555-9LMNTS",
                'purpose': 'Welcome new clients'
            },
            'payment_reminder': {
                'template': "💰 Payment Reminder: Your {service_type} project is ready to start! Complete payment to begin: https://PayPal.Me/9LMNTSSTUDIO/{budget}. Your project timeline starts once payment is confirmed. Reply PAID when done.",
                'purpose': 'Payment reminders'
            },
            'meeting_reminder': {
                'template': "📅 Meeting Reminder: Your {service_type} consultation is scheduled for {meeting_time}. Link: {meeting_link}. Please join 5 minutes early. Reply RESCHEDULE if needed. Can't wait to transform your business!",
                'purpose': 'Meeting reminders'
            },
            'follow_up': {
                'template': "🎯 Following up on your {service_type} inquiry! Our AI solutions can increase your revenue by 40%+. Special offer: 20% OFF if you start this week. Payment link: https://PayPal.Me/9LMNTSSTUDIO/{budget}. Reply YES to get started!",
                'purpose': 'Follow-up messages'
            },
            'project_update': {
                'template': "📈 Project Update: {project_name} is {progress}% complete! {update_details}. Estimated completion: {completion_date}. Questions? Reply to this message or call +1-555-9LMNTS.",
                'purpose': 'Project updates'
            },
            'conversion_celebration': {
                'template': "🎉 Congratulations {name}! Your {service_type} project is officially underway! We've received your payment of ${budget}. Your project manager will contact you within 24 hours. Get ready for transformation!",
                'purpose': 'Conversion celebration'
            }
        }
    
    def send_welcome_message(self, client_data: Dict) -> Dict:
        """Send welcome SMS to new client"""
        try:
            if not self.twilio_active:
                return self.get_fallback_sms('welcome', client_data)
            
            template = self.message_templates['welcome']['template']
            message = template.format(
                name=client_data.get('name', ''),
                service_type=client_data.get('service_type', 'AI Services')
            )
            
            message_data = self.send_sms(
                client_data.get('phone', ''),
                message,
                'welcome'
            )
            
            if message_data.get('success', False):
                print(f"✅ Welcome SMS sent to {client_data.get('name')}")
            else:
                print(f"❌ Failed to send welcome SMS")
            
            return message_data
            
        except Exception as e:
            print(f"❌ Error sending welcome message: {str(e)}")
            return self.get_fallback_sms('welcome', client_data)
    
    def send_payment_reminder(self, client_data: Dict) -> Dict:
        """Send payment reminder SMS"""
        try:
            if not self.twilio_active:
                return self.get_fallback_sms('payment_reminder', client_data)
            
            template = self.message_templates['payment_reminder']['template']
            message = template.format(
                service_type=client_data.get('service_type', 'AI Services'),
                budget=client_data.get('budget', 2000)
            )
            
            message_data = self.send_sms(
                client_data.get('phone', ''),
                message,
                'payment_reminder'
            )
            
            if message_data.get('success', False):
                print(f"✅ Payment reminder sent to {client_data.get('name')}")
            else:
                print(f"❌ Failed to send payment reminder")
            
            return message_data
            
        except Exception as e:
            print(f"❌ Error sending payment reminder: {str(e)}")
            return self.get_fallback_sms('payment_reminder', client_data)
    
    def send_meeting_reminder(self, meeting_data: Dict) -> Dict:
        """Send meeting reminder SMS"""
        try:
            if not self.twilio_active:
                return self.get_fallback_sms('meeting_reminder', meeting_data)
            
            template = self.message_templates['meeting_reminder']['template']
            message = template.format(
                service_type=meeting_data.get('service_type', 'AI Services'),
                meeting_time=meeting_data.get('meeting_time', '2:00 PM'),
                meeting_link=meeting_data.get('meeting_link', 'https://meet.google.com/abc123')
            )
            
            message_data = self.send_sms(
                meeting_data.get('phone', ''),
                message,
                'meeting_reminder'
            )
            
            if message_data.get('success', False):
                print(f"✅ Meeting reminder sent to {meeting_data.get('name')}")
            else:
                print(f"❌ Failed to send meeting reminder")
            
            return message_data
            
        except Exception as e:
            print(f"❌ Error sending meeting reminder: {str(e)}")
            return self.get_fallback_sms('meeting_reminder', meeting_data)
    
    def send_follow_up_message(self, client_data: Dict) -> Dict:
        """Send follow-up SMS"""
        try:
            if not self.twilio_active:
                return self.get_fallback_sms('follow_up', client_data)
            
            template = self.message_templates['follow_up']['template']
            message = template.format(
                service_type=client_data.get('service_type', 'AI Services'),
                budget=client_data.get('budget', 2000)
            )
            
            message_data = self.send_sms(
                client_data.get('phone', ''),
                message,
                'follow_up'
            )
            
            if message_data.get('success', False):
                print(f"✅ Follow-up sent to {client_data.get('name')}")
            else:
                print(f"❌ Failed to send follow-up")
            
            return message_data
            
        except Exception as e:
            print(f"❌ Error sending follow-up: {str(e)}")
            return self.get_fallback_sms('follow_up', client_data)
    
    def send_project_update(self, project_data: Dict) -> Dict:
        """Send project update SMS"""
        try:
            if not self.twilio_active:
                return self.get_fallback_sms('project_update', project_data)
            
            template = self.message_templates['project_update']['template']
            message = template.format(
                project_name=project_data.get('project_name', 'Your Project'),
                progress=project_data.get('progress', 50),
                update_details=project_data.get('update_details', 'Making great progress!'),
                completion_date=project_data.get('completion_date', 'next week')
            )
            
            message_data = self.send_sms(
                project_data.get('phone', ''),
                message,
                'project_update'
            )
            
            if message_data.get('success', False):
                print(f"✅ Project update sent to {project_data.get('client_name')}")
            else:
                print(f"❌ Failed to send project update")
            
            return message_data
            
        except Exception as e:
            print(f"❌ Error sending project update: {str(e)}")
            return self.get_fallback_sms('project_update', project_data)
    
    def send_conversion_celebration(self, client_data: Dict) -> Dict:
        """Send conversion celebration SMS"""
        try:
            if not self.twilio_active:
                return self.get_fallback_sms('conversion_celebration', client_data)
            
            template = self.message_templates['conversion_celebration']['template']
            message = template.format(
                name=client_data.get('name', ''),
                service_type=client_data.get('service_type', 'AI Services'),
                budget=client_data.get('budget', 2000)
            )
            
            message_data = self.send_sms(
                client_data.get('phone', ''),
                message,
                'conversion_celebration'
            )
            
            if message_data.get('success', False):
                print(f"✅ Conversion celebration sent to {client_data.get('name')}")
            else:
                print(f"❌ Failed to send conversion celebration")
            
            return message_data
            
        except Exception as e:
            print(f"❌ Error sending conversion celebration: {str(e)}")
            return self.get_fallback_sms('conversion_celebration', client_data)
    
    def send_sms(self, to_number: str, message: str, message_type: str) -> Dict:
        """Send SMS using Twilio API"""
        try:
            if not self.client or not to_number:
                return {'success': False, 'error': 'Twilio client not initialized or no phone number'}
            
            # Format phone number
            formatted_number = self.format_phone_number(to_number)
            
            # Send message
            twilio_message = self.client.messages.create(
                body=message,
                from_=self.twilio_number,
                to=formatted_number
            )
            
            message_data = {
                'success': True,
                'message_id': twilio_message.sid,
                'to_number': formatted_number,
                'from_number': self.twilio_number,
                'message': message,
                'message_type': message_type,
                'status': twilio_message.status,
                'sent_at': datetime.now().isoformat()
            }
            
            # Send to n8n workflow
            self.send_sms_data_to_n8n(message_data)
            
            return message_data
            
        except TwilioRestException as e:
            print(f"❌ Twilio API error: {str(e)}")
            return {'success': False, 'error': str(e)}
        except Exception as e:
            print(f"❌ Error sending SMS: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def format_phone_number(self, phone_number: str) -> str:
        """Format phone number for Twilio"""
        # Remove all non-digit characters
        digits_only = ''.join(filter(str.isdigit, phone_number))
        
        # Add country code if not present
        if len(digits_only) == 10:  # US number without country code
            return f"+1{digits_only}"
        elif len(digits_only) == 11 and digits_only.startswith('1'):
            return f"+{digits_only}"
        elif len(digits_only) >= 10:
            return f"+{digits_only}"
        else:
            return phone_number  # Return as-is if can't format
    
    def schedule_sms_campaign(self, campaign_data: Dict) -> Dict:
        """Schedule SMS campaign for multiple recipients"""
        try:
            campaign_results = {
                'campaign_name': campaign_data.get('campaign_name', 'SMS Campaign'),
                'message_type': campaign_data.get('message_type', 'follow_up'),
                'recipients': campaign_data.get('recipients', []),
                'scheduled_time': campaign_data.get('scheduled_time', datetime.now().isoformat()),
                'results': [],
                'success_count': 0,
                'failed_count': 0
            }
            
            for recipient in campaign_data.get('recipients', []):
                # Get appropriate template
                template = self.message_templates.get(campaign_data.get('message_type', 'follow_up'), {})
                
                # Format message
                message = template.get('template', 'Default message').format(**recipient)
                
                # Send SMS
                result = self.send_sms(
                    recipient.get('phone', ''),
                    message,
                    campaign_data.get('message_type', 'follow_up')
                )
                
                campaign_results['results'].append({
                    'recipient': recipient.get('name', ''),
                    'phone': recipient.get('phone', ''),
                    'result': result
                })
                
                if result.get('success', False):
                    campaign_results['success_count'] += 1
                else:
                    campaign_results['failed_count'] += 1
            
            print(f"✅ SMS campaign completed: {campaign_results['success_count']}/{len(campaign_data.get('recipients', []))} successful")
            return campaign_results
            
        except Exception as e:
            print(f"❌ Error scheduling SMS campaign: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_sms_analytics(self, date_range: int = 30) -> Dict:
        """Get SMS analytics for date range"""
        try:
            # This would typically query Twilio for message history
            # For now, return mock analytics
            analytics = {
                'date_range_days': date_range,
                'total_messages_sent': 150,
                'successful_deliveries': 142,
                'failed_deliveries': 8,
                'delivery_rate': 94.7,
                'message_types': {
                    'welcome': 45,
                    'payment_reminder': 38,
                    'meeting_reminder': 32,
                    'follow_up': 25,
                    'project_update': 10
                },
                'average_response_time': '2.5 minutes',
                'generated_at': datetime.now().isoformat()
            }
            
            print(f"📊 SMS Analytics: {analytics['total_messages_sent']} messages, {analytics['delivery_rate']:.1f}% delivery rate")
            return analytics
            
        except Exception as e:
            print(f"❌ Error getting SMS analytics: {str(e)}")
            return {}
    
    def get_fallback_sms(self, message_type: str, data: Dict) -> Dict:
        """Fallback SMS when Twilio is not available"""
        template = self.message_templates.get(message_type, {}).get('template', 'Default message')
        
        return {
            'success': False,
            'error': 'Twilio not available - using fallback',
            'message_type': message_type,
            'message': template.format(**data),
            'to_number': data.get('phone', ''),
            'from_number': self.twilio_number,
            'status': 'fallback',
            'sent_at': datetime.now().isoformat()
        }
    
    def send_sms_data_to_n8n(self, sms_data: Dict):
        """Send SMS data to n8n workflow"""
        try:
            payload = {
                'event_type': 'sms_sent',
                'sms_data': sms_data,
                'source': 'twilio_automation',
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ SMS data sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send to n8n: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending to n8n: {str(e)}")
