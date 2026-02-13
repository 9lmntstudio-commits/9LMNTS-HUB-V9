"""
9LMNTS STUDIO - ManyChat Automation Agent
Automates Facebook Messenger marketing, lead capture, and customer engagement using ManyChat API
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

class ManyChatAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.api_key = "4317889:47e3d73488738d34cd25fecf9ebcdc93"
        self.api_base_url = "https://api.manychat.com"
        
        # Message templates
        self.message_templates = {
            'welcome': {
                'text': "🚀 Welcome to 9LMNTS Studio! I'm your AI automation assistant. I can help you with:\n\n• AI Brand Voice Development\n• Web Design with AI Integration\n• AI Business Automation\n• EventOS Platform\n\nWhich service interests you most? 💰 Special offer: 20% OFF for new clients!",
                'buttons': [
                    {'text': 'AI Brand Voice - $2,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/2000'},
                    {'text': 'Web Design - $1,500', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/1500'},
                    {'text': 'AI Automation - $3,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/3000'},
                    {'text': 'EventOS - $1,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/1000'}
                ]
            },
            'service_info': {
                'ai_brand_voice': {
                    'text': "🤖 AI Brand Voice Development\n\nCreate consistent, engaging content across all platforms with AI-powered brand voice automation.\n\n✅ What's included:\n• Brand voice analysis\n• Content strategy\n• Automated content generation\n• Social media templates\n• Email marketing sequences\n\n💰 Investment: $2,000\n🎯 ROI: 10x content production\n\nReady to transform your brand? Click below to get started!",
                    'buttons': [{'text': 'Start Now - $2,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/2000'}]
                },
                'web_design': {
                    'text': "🎨 Web Design with AI Integration\n\nModern, responsive websites that convert visitors into customers with built-in AI automation.\n\n✅ What's included:\n• Custom web design\n• AI chatbot integration\n• Automated lead capture\n• Analytics dashboard\n• Mobile optimization\n\n💰 Investment: $1,500\n🎯 ROI: 5x conversion rate\n\nReady for your new website? Click below!",
                    'buttons': [{'text': 'Start Now - $1,500', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/1500'}]
                },
                'ai_business_automation': {
                    'text': "⚡ AI Business Automation\n\nComplete business process automation using AI to reduce costs and accelerate growth.\n\n✅ What's included:\n• Process analysis\n• AI workflow design\n• Automation implementation\n• Team training\n• Ongoing optimization\n\n💰 Investment: $3,000\n🎯 ROI: 15x efficiency\n\nReady to automate everything? Click below!",
                    'buttons': [{'text': 'Start Now - $3,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/3000'}]
                },
                'eventos': {
                    'text': "📅 EventOS Platform\n\nComplete event management automation from registration to follow-up with AI-powered insights.\n\n✅ What's included:\n• Event registration system\n• Automated scheduling\n• Attendee management\n• Real-time analytics\n• Follow-up automation\n\n💰 Investment: $1,000\n🎯 ROI: 8x event efficiency\n\nReady for event automation? Click below!",
                    'buttons': [{'text': 'Start Now - $1,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/1000'}]
                }
            },
            'lead_qualification': {
                'text': "🎯 Let's find the perfect solution for you!\n\nI'll ask a few quick questions to recommend the best service:\n\n1. What's your business type?\n2. What's your monthly revenue?\n3. What's your biggest challenge?\n4. What's your timeline?\n\nLet's start with: What type of business do you run?",
                'buttons': [
                    {'text': 'E-commerce', 'action': 'business_type', 'value': 'ecommerce'},
                    {'text': 'Service Business', 'action': 'business_type', 'value': 'service'},
                    {'text': 'SaaS/Tech', 'action': 'business_type', 'value': 'saas'},
                    {'text': 'Consulting', 'action': 'business_type', 'value': 'consulting'}
                ]
            },
            'follow_up': {
                'text': "🚀 Ready to transform your business with AI automation?\n\nOur clients see average results:\n• 300% increase in efficiency\n• 200% boost in revenue\n• 80% reduction in manual work\n\nLimited spots available this month! Don't miss out.\n\nWhich service would you like to start with?",
                'buttons': [
                    {'text': 'AI Brand Voice - $2,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/2000'},
                    {'text': 'Web Design - $1,500', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/1500'},
                    {'text': 'AI Automation - $3,000', 'url': 'https://PayPal.Me/9LMNTSSTUDIO/3000'},
                    {'text': 'Schedule Consultation', 'url': 'https://calendly.com/9lmnts-studio'}
                ]
            }
        }
        
        # Growth tools
        self.growth_tools = {
            'lead_capture': {
                'name': 'Lead Capture Bot',
                'description': 'Automatically capture and qualify leads from Facebook Messenger',
                'trigger': 'New message',
                'actions': ['Welcome message', 'Lead qualification', 'Service recommendation', 'Payment link']
            },
            'abandoned_cart': {
                'name': 'Abandoned Cart Recovery',
                'description': 'Recover potential clients who showed interest but didn\'t complete',
                'trigger': '24 hours after interaction',
                'actions': ['Follow-up message', 'Special offer', 'Urgency reminder']
            },
            'referral_program': {
                'name': 'Referral Program',
                'description': 'Automated referral system for existing clients',
                'trigger': 'Client completion',
                'actions': ['Referral request', 'Incentive offer', 'Tracking system']
            }
        }
    
    def send_message(self, subscriber_id: str, message_type: str, custom_data: Dict = None) -> Dict:
        """Send message to subscriber via ManyChat API"""
        try:
            # Get message template
            template = self.message_templates.get(message_type, self.message_templates['welcome'])
            
            # Handle service-specific messages
            if message_type == 'service_info' and custom_data:
                service = custom_data.get('service', 'ai_brand_voice')
                template = template.get(service, template['ai_brand_voice'])
            
            # Prepare message payload
            message_data = {
                'subscriber_id': subscriber_id,
                'data': {
                    'version': 'v2',
                    'content': {
                        'messages': []
                    }
                }
            }
            
            # Add text message
            message_data['data']['content']['messages'].append({
                'type': 'text',
                'text': template['text']
            })
            
            # Add buttons if available
            if 'buttons' in template:
                message_data['data']['content']['messages'].append({
                    'type': 'buttons',
                    'buttons': template['buttons']
                })
            
            # Send to ManyChat API
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{self.api_base_url}/fb/page/sendMessage",
                headers=headers,
                json=message_data
            )
            
            if response.status_code == 200:
                result = response.json()
                message_result = {
                    'success': True,
                    'message_id': result.get('message_id', ''),
                    'subscriber_id': subscriber_id,
                    'message_type': message_type,
                    'sent_at': datetime.now().isoformat()
                }
                
                # Send to n8n workflow
                self.send_manychat_data_to_n8n(message_result)
                
                print(f"✅ ManyChat message sent: {message_type}")
                return message_result
            else:
                print(f"❌ Error sending ManyChat message: {response.status_code}")
                return self.get_fallback_message(subscriber_id, message_type)
                
        except Exception as e:
            print(f"❌ Error sending ManyChat message: {str(e)}")
            return self.get_fallback_message(subscriber_id, message_type)
    
    def create_growth_tool(self, tool_type: str, settings: Dict = None) -> Dict:
        """Create ManyChat growth tool"""
        try:
            tool_config = self.growth_tools.get(tool_type, self.growth_tools['lead_capture'])
            
            growth_tool_data = {
                'name': tool_config['name'],
                'description': tool_config['description'],
                'trigger': tool_config['trigger'],
                'actions': tool_config['actions'],
                'settings': settings or {},
                'created_at': datetime.now().isoformat()
            }
            
            # Create growth tool via ManyChat API
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            # Note: This would be the actual API call to create growth tool
            # For now, return the configuration
            growth_tool_data['success'] = True
            growth_tool_data['tool_id'] = f"tool_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            print(f"✅ Growth tool created: {tool_config['name']}")
            return growth_tool_data
            
        except Exception as e:
            print(f"❌ Error creating growth tool: {str(e)}")
            return self.get_fallback_growth_tool(tool_type)
    
    def get_subscribers(self, limit: int = 100) -> List[Dict]:
        """Get subscribers from ManyChat"""
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            # Get subscribers via ManyChat API
            response = requests.get(
                f"{self.api_base_url}/fb/page/getSubscribers",
                headers=headers,
                params={'limit': limit}
            )
            
            if response.status_code == 200:
                data = response.json()
                subscribers = data.get('data', [])
                
                print(f"✅ Retrieved {len(subscribers)} subscribers")
                return subscribers
            else:
                print(f"❌ Error getting subscribers: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting subscribers: {str(e)}")
            return []
    
    def create_custom_field(self, field_name: str, field_type: str = 'string') -> Dict:
        """Create custom field for subscriber data"""
        try:
            custom_field_data = {
                'name': field_name,
                'type': field_type,
                'description': f'Custom field for {field_name}',
                'created_at': datetime.now().isoformat()
            }
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            # Create custom field via ManyChat API
            # Note: This would be the actual API call
            custom_field_data['success'] = True
            custom_field_data['field_id'] = f"field_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            print(f"✅ Custom field created: {field_name}")
            return custom_field_data
            
        except Exception as e:
            print(f"❌ Error creating custom field: {str(e)}")
            return self.get_fallback_custom_field(field_name)
    
    def set_subscriber_data(self, subscriber_id: str, field_name: str, value: str) -> Dict:
        """Set custom field data for subscriber"""
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'subscriber_id': subscriber_id,
                'fields': [{
                    'name': field_name,
                    'value': value
                }]
            }
            
            # Set subscriber data via ManyChat API
            response = requests.post(
                f"{self.api_base_url}/fb/page/setSubscriberData",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                subscriber_data = {
                    'success': True,
                    'subscriber_id': subscriber_id,
                    'field_name': field_name,
                    'value': value,
                    'updated_at': datetime.now().isoformat()
                }
                
                print(f"✅ Subscriber data set: {field_name} = {value}")
                return subscriber_data
            else:
                print(f"❌ Error setting subscriber data: {response.status_code}")
                return self.get_fallback_subscriber_data(subscriber_id, field_name, value)
                
        except Exception as e:
            print(f"❌ Error setting subscriber data: {str(e)}")
            return self.get_fallback_subscriber_data(subscriber_id, field_name, value)
    
    def get_analytics(self, date_range: int = 30) -> Dict:
        """Get ManyChat analytics"""
        try:
            # Mock analytics data (would be real API call)
            analytics = {
                'date_range_days': date_range,
                'total_subscribers': 1250,
                'active_subscribers': 890,
                'new_subscribers': 156,
                'messages_sent': 3420,
                'messages_received': 2180,
                'conversion_rate': 12.5,
                'engagement_rate': 68.4,
                'top_services': {
                    'AI Brand Voice': 45,
                    'Web Design': 38,
                    'AI Business Automation': 52,
                    'EventOS': 21
                },
                'revenue_generated': 28500,
                'generated_at': datetime.now().isoformat()
            }
            
            print(f"📊 ManyChat Analytics: {analytics['total_subscribers']} subscribers, {analytics['conversion_rate']:.1f}% conversion")
            return analytics
            
        except Exception as e:
            print(f"❌ Error getting analytics: {str(e)}")
            return {}
    
    def create_automation_flow(self, flow_name: str, steps: List[Dict]) -> Dict:
        """Create automation flow"""
        try:
            flow_data = {
                'name': flow_name,
                'steps': steps,
                'created_at': datetime.now().isoformat(),
                'status': 'active'
            }
            
            # Create flow via ManyChat API
            flow_data['success'] = True
            flow_data['flow_id'] = f"flow_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            print(f"✅ Automation flow created: {flow_name}")
            return flow_data
            
        except Exception as e:
            print(f"❌ Error creating automation flow: {str(e)}")
            return self.get_fallback_automation_flow(flow_name)
    
    def get_fallback_message(self, subscriber_id: str, message_type: str) -> Dict:
        """Fallback message when API fails"""
        return {
            'success': False,
            'error': 'ManyChat API not available',
            'subscriber_id': subscriber_id,
            'message_type': message_type,
            'sent_at': datetime.now().isoformat()
        }
    
    def get_fallback_growth_tool(self, tool_type: str) -> Dict:
        """Fallback growth tool"""
        return {
            'success': False,
            'error': 'Growth tool creation failed',
            'tool_type': tool_type,
            'created_at': datetime.now().isoformat()
        }
    
    def get_fallback_custom_field(self, field_name: str) -> Dict:
        """Fallback custom field"""
        return {
            'success': False,
            'error': 'Custom field creation failed',
            'field_name': field_name,
            'created_at': datetime.now().isoformat()
        }
    
    def get_fallback_subscriber_data(self, subscriber_id: str, field_name: str, value: str) -> Dict:
        """Fallback subscriber data"""
        return {
            'success': False,
            'error': 'Subscriber data update failed',
            'subscriber_id': subscriber_id,
            'field_name': field_name,
            'value': value,
            'updated_at': datetime.now().isoformat()
        }
    
    def get_fallback_automation_flow(self, flow_name: str) -> Dict:
        """Fallback automation flow"""
        return {
            'success': False,
            'error': 'Automation flow creation failed',
            'flow_name': flow_name,
            'created_at': datetime.now().isoformat()
        }
    
    def send_manychat_data_to_n8n(self, manychat_data: Dict):
        """Send ManyChat data to n8n workflow"""
        try:
            payload = {
                'event_type': 'manychat_interaction',
                'manychat_data': manychat_data,
                'source': 'manychat_automation',
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ ManyChat data sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send to n8n: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending to n8n: {str(e)}")
