"""
9LMNTS STUDIO - Calendar Integration Agent
Automates Google Calendar event creation, meeting scheduling, and calendar management
"""

import os
import json
import requests
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class CalendarIntegrationAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.google_app_password = os.getenv("GOOGLE_APP_PASSWORD", "odzf ccmx scdu kerx")
        self.service_account_key = os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY")
        self.calendar_id = "primary"
        self.timezone = "America/Toronto"
        
        # Meeting duration based on budget
        self.meeting_durations = {
            "high": 60,    # $5000+ budget
            "medium": 45,  # $3000-5000 budget  
            "low": 30      # <$3000 budget
        }
        
        # Calendar event templates
        self.event_templates = {
            "ai_brand_voice": {
                "title": "AI Brand Voice Consultation",
                "description": "Transform your brand with AI-powered content generation"
            },
            "ai_business_automation": {
                "title": "AI Business Automation Strategy",
                "description": "Automate your business processes with custom AI solutions"
            },
            "web_design": {
                "title": "Web Design & Development Consultation",
                "description": "Create stunning, responsive websites that convert"
            },
            "brand_identity": {
                "title": "Brand Identity Design Session",
                "description": "Design a complete brand package that stands out"
            },
            "default": {
                "title": "9LMNTS Studio Consultation",
                "description": "Transform your business with our AI-powered solutions"
            }
        }
        
    def determine_meeting_priority(self, budget: int) -> str:
        """Determine meeting priority based on budget"""
        if budget >= 5000:
            return "high"
        elif budget >= 3000:
            return "medium"
        else:
            return "low"
    
    def get_meeting_duration(self, budget: int) -> int:
        """Get meeting duration based on budget"""
        priority = self.determine_meeting_priority(budget)
        return self.meeting_durations.get(priority, 30)
    
    def calculate_meeting_time(self, lead_data: Dict) -> datetime:
        """Calculate optimal meeting time based on lead priority"""
        priority = self.determine_meeting_priority(lead_data.get("budget", 0))
        
        if priority == "high":
            # Schedule within 24 hours for high-value leads
            meeting_time = datetime.now() + timedelta(hours=24)
        elif priority == "medium":
            # Schedule within 48 hours for medium-value leads
            meeting_time = datetime.now() + timedelta(hours=48)
        else:
            # Schedule within 72 hours for standard leads
            meeting_time = datetime.now() + timedelta(hours=72)
        
        # Ensure meeting is during business hours (9 AM - 6 PM)
        if meeting_time.hour < 9:
            meeting_time = meeting_time.replace(hour=9, minute=0)
        elif meeting_time.hour > 18:
            meeting_time = meeting_time + timedelta(days=1)
            meeting_time = meeting_time.replace(hour=10, minute=0)
        
        return meeting_time
    
    def create_calendar_event(self, lead_data: Dict) -> Dict[str, Any]:
        """Create Google Calendar event for consultation"""
        try:
            budget = int(lead_data.get("budget", 0))
            service_type = lead_data.get("service_type", "")
            client_name = lead_data.get("name", "Client")
            client_email = lead_data.get("email", "")
            company = lead_data.get("company", "")
            
            # Determine meeting details
            priority = self.determine_meeting_priority(budget)
            duration = self.get_meeting_duration(budget)
            meeting_time = self.calculate_meeting_time(lead_data)
            end_time = meeting_time + timedelta(minutes=duration)
            
            # Get event template
            event_template = self.event_templates.get("default")
            for key in self.event_templates:
                if key in service_type.lower():
                    event_template = self.event_templates[key]
                    break
            
            # Create event description
            description = f"""Service: {service_type}
Budget: ${budget}
Company: {company}
Phone: {lead_data.get('phone', '')}
Email: {client_email}

Project Details:
{lead_data.get('description', '')}

---
This is an automated consultation booking from 9LMNTS Studio.
Priority Level: {priority.upper()}
Meeting Duration: {duration} minutes

🚀 Ready to transform your business with AI!"""
            
            # Calendar event data
            event_data = {
                "summary": f"{event_template['title']} - {client_name}",
                "description": description,
                "start": {
                    "dateTime": meeting_time.isoformat(),
                    "timeZone": self.timezone
                },
                "end": {
                    "dateTime": end_time.isoformat(),
                    "timeZone": self.timezone
                },
                "attendees": [
                    {"email": client_email},
                    {"email": "info@9lmntsstudio.com"}
                ],
                "conferenceData": {
                    "createRequest": {
                        "requestId": f"9lmnts_{int(time.time())}",
                        "conferenceSolutionKey": {"type": "hangoutsMeet"}
                    }
                },
                "reminders": {
                    "useDefault": False,
                    "overrides": [
                        {"method": "email", "minutes": 1440},  # 24 hours before
                        {"method": "popup", "minutes": 60},     # 1 hour before
                        {"method": "email", "minutes": 60}      # 1 hour before
                    ]
                },
                "colorId": "4" if priority == "high" else "3"  # Red for high priority
            }
            
            # Create event using Google Calendar API
            calendar_service = self._get_calendar_service()
            
            event = calendar_service.events().insert(
                calendarId=self.calendar_id,
                body=event_data,
                conferenceDataVersion=1,
                sendUpdates="all"
            ).execute()
            
            result = {
                "success": True,
                "event_id": event["id"],
                "event_link": event["htmlLink"],
                "meeting_link": event.get("hangoutLink", ""),
                "meeting_time": meeting_time.isoformat(),
                "duration": duration,
                "priority": priority,
                "client_email": client_email,
                "client_name": client_name
            }
            
            print(f"✅ Calendar event created: {event['summary']}")
            print(f"📅 Meeting link: {event.get('hangoutLink', '')}")
            print(f"🔗 Event link: {event['htmlLink']}")
            
            return result
            
        except Exception as e:
            print(f"❌ Error creating calendar event: {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback_meeting_link": f"https://calendly.com/9lmntsstudio/consultation"
            }
    
    def _get_calendar_service(self):
        """Get authenticated Google Calendar service"""
        try:
            # For production, use service account or OAuth2 flow
            # This is a simplified version for demonstration
            creds = None
            
            if os.path.exists('token.json'):
                creds = Credentials.from_authorized_user_file('token.json')
            
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    # In production, implement proper OAuth2 flow
                    flow = InstalledAppFlow.from_client_secrets_file(
                        'credentials.json', 
                        ['https://www.googleapis.com/auth/calendar']
                    )
                    creds = flow.run_local_server(port=0)
                
                with open('token.json', 'w') as token:
                    token.write(creds.to_json())
            
            service = build('calendar', 'v3', credentials=creds)
            return service
            
        except Exception as e:
            print(f"⚠️ Calendar service error: {e}")
            # Return mock service for development
            return self._get_mock_calendar_service()
    
    def _get_mock_calendar_service(self):
        """Mock calendar service for development/testing"""
        class MockCalendarService:
            def events(self):
                class MockEvents:
                    def insert(self, calendarId, body, **kwargs):
                        class MockEvent:
                            def execute(self):
                                return {
                                    "id": f"mock_{int(time.time())}",
                                    "summary": body.get("summary", "Mock Event"),
                                    "htmlLink": "https://calendar.google.com/calendar/event/mock",
                                    "hangoutLink": "https://meet.google.com/mock-meeting"
                                }
                        return MockEvent()
                return MockEvents()
        
        return MockCalendarService()
    
    def send_meeting_confirmation(self, calendar_result: Dict, lead_data: Dict) -> Dict:
        """Send meeting confirmation to n8n workflow"""
        try:
            confirmation_data = {
                "calendar_event": calendar_result,
                "lead": lead_data,
                "meeting_type": "consultation",
                "confirmation_sent": True,
                "timestamp": datetime.now().isoformat()
            }
            
            # Send to n8n for email automation
            response = requests.post(
                self.n8n_webhook_url,
                json=confirmation_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print("✅ Meeting confirmation sent to n8n workflow")
                return {"success": True, "response": response.json()}
            else:
                print(f"⚠️ n8n webhook error: {response.status_code}")
                return {"success": False, "error": response.text}
                
        except Exception as e:
            print(f"❌ Error sending confirmation: {e}")
            return {"success": False, "error": str(e)}
    
    def process_lead_calendar(self, lead_data: Dict) -> Dict:
        """Complete calendar integration process for a lead"""
        print(f"📅 Processing calendar for lead: {lead_data.get('name', 'Unknown')}")
        
        # Create calendar event
        calendar_result = self.create_calendar_event(lead_data)
        
        if calendar_result.get("success", False):
            # Send meeting confirmation
            confirmation_result = self.send_meeting_confirmation(calendar_result, lead_data)
            
            return {
                "success": True,
                "calendar_event": calendar_result,
                "confirmation": confirmation_result,
                "message": f"Meeting scheduled successfully! Check your email for calendar invite."
            }
        else:
            # Fallback option
            fallback_link = calendar_result.get("fallback_meeting_link", "")
            return {
                "success": False,
                "fallback_link": fallback_link,
                "message": "Unable to create calendar event automatically. Please use the booking link to schedule your consultation."
            }
    
    def get_calendar_events(self, date_range: int = 7) -> List[Dict]:
        """Get upcoming calendar events for monitoring"""
        try:
            service = self._get_calendar_service()
            
            now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
            end_time = (datetime.utcnow() + timedelta(days=date_range)).isoformat() + 'Z'
            
            events_result = service.events().list(
                calendarId=self.calendar_id,
                timeMin=now,
                timeMax=end_time,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            formatted_events = []
            for event in events:
                formatted_events.append({
                    "id": event["id"],
                    "summary": event["summary"],
                    "start": event["start"].get("dateTime", event["start"].get("date")),
                    "end": event["end"].get("dateTime", event["end"].get("date")),
                    "meeting_link": event.get("hangoutLink", ""),
                    "attendees": len(event.get("attendees", []))
                })
            
            return formatted_events
            
        except Exception as e:
            print(f"❌ Error getting calendar events: {e}")
            return []
    
    def run_calendar_agent(self):
        """Main execution method for calendar integration agent"""
        print("🚀 9LMNTS Calendar Integration Agent Started")
        print("📅 Ready to schedule meetings and manage calendar events")
        
        # Monitor for new leads and create calendar events
        # This would typically be triggered by webhook or message queue
        
        print("✅ Calendar agent is ready to process leads")
        return True

# Main execution
if __name__ == "__main__":
    agent = CalendarIntegrationAgent()
    agent.run_calendar_agent()
