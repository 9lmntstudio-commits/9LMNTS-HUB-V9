"""
9LMNTS STUDIO - Google Sheets Automation Agent
Automates revenue tracking, lead management, and analytics through Google Sheets
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class GoogleSheetsAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.app_password = os.getenv("GOOGLE_APP_PASSWORD", "odzf ccmx scdu kerx")
        self.service_account_key = os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY")
        self.scopes = ['https://www.googleapis.com/auth/spreadsheets']
        self.spreadsheet_id = os.getenv("GOOGLE_SHEETS_ID", "")
        
    def authenticate(self):
        """Authenticate with Google Sheets using service account"""
        try:
            if self.service_account_key and os.path.exists(self.service_account_key):
                creds = Credentials.from_service_account_file(
                    self.service_account_key, 
                    scopes=self.scopes
                )
                return build('sheets', 'v4', credentials=creds)
            else:
                print("⚠️ Service account key not found. Using app password fallback.")
                return None
        except Exception as e:
            print(f"❌ Google Sheets authentication error: {str(e)}")
            return None
    
    def create_revenue_dashboard(self) -> str:
        """Create a comprehensive revenue tracking dashboard"""
        try:
            service = self.authenticate()
            if not service:
                return ""
                
            # Create spreadsheet for revenue tracking
            spreadsheet_body = {
                'properties': {
                    'title': f'9LMNTS Revenue Dashboard - {datetime.now().strftime("%Y-%m")}',
                    'locale': 'en_US'
                },
                'sheets': [
                    {
                        'properties': {
                            'title': 'Leads & Revenue',
                            'gridProperties': {
                                'frozenRowCount': 1,
                                'columnCount': 12,
                                'hideGridlines': False
                            }
                        },
                        'data': [
                            {
                                'rowData': [
                                    {
                                        'values': [
                                            'Date', 'Client Name', 'Email', 'Service Type', 'Budget', 
                                            'Status', 'Payment Link', 'Payment Status', 
                                            'Calendar Link', 'Meeting Scheduled', 'Conversion Date', 'Revenue'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'properties': {
                            'title': 'Monthly Analytics',
                            'gridProperties': {
                                'frozenRowCount': 1,
                                'columnCount': 8,
                                'hideGridlines': False
                            }
                        },
                        'data': [
                            {
                                'rowData': [
                                    {
                                        'values': [
                                            'Month', 'Total Leads', 'Converted Leads', 'Conversion Rate %',
                                            'Total Revenue', 'Average Deal Size', 'Top Service',
                                            'New Clients', 'Returning Clients', 'Growth Rate %'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'properties': {
                            'title': 'Service Performance',
                            'gridProperties': {
                                'frozenRowCount': 1,
                                'columnCount': 6,
                                'hideGridlines': False
                            }
                        },
                        'data': [
                            {
                                'rowData': [
                                    {
                                        'values': [
                                            'Service', 'Total Leads', 'Converted', 'Revenue',
                                            'Avg Deal Size', 'Conversion Rate', 'Client Satisfaction'
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            
            # Create spreadsheet
            spreadsheet = service.spreadsheets().create(
                body=spreadsheet_body,
                fields='spreadsheetId,sheets(title,properties)'
            ).execute()
            
            spreadsheet_id = spreadsheet.get('spreadsheetId')
            print(f"✅ Revenue dashboard created: {spreadsheet_body['properties']['title']}")
            print(f"🔗 Spreadsheet ID: {spreadsheet_id}")
            
            return spreadsheet_id
            
        except HttpError as e:
            print(f"❌ Error creating spreadsheet: {str(e)}")
            return ""
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return ""
    
    def add_lead_data(self, spreadsheet_id: str, lead_data: Dict) -> bool:
        """Add new lead data to the dashboard"""
        try:
            service = self.authenticate()
            if not service:
                return False
                
            # Prepare lead data
            values = [
                [
                    datetime.now().strftime("%Y-%m-%d"),
                    lead_data.get('name', ''),
                    lead_data.get('email', ''),
                    lead_data.get('service_type', ''),
                    lead_data.get('budget', 0),
                    'New',
                    f"https://PayPal.Me/9LMNTSSTUDIO/{lead_data.get('budget', 1000)}",
                    'Pending',
                    '',  # Calendar link
                    'No',   # Meeting scheduled
                    '',    # Conversion date
                    0       # Revenue
                ]
            ]
            
            # Append data to spreadsheet
            body = {
                'values': values
            }
            
            result = service.spreadsheets().values().append(
                spreadsheetId=spreadsheet_id,
                range='Leads & Revenue!A:L',
                valueInputOption='USER_ENTERED',
                insertDataOption='INSERT_ROWS',
                body=body
            ).execute()
            
            print(f"✅ Lead data added: {lead_data.get('name')}")
            return True
            
        except HttpError as e:
            print(f"❌ Error adding lead data: {str(e)}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return False
    
    def update_conversion_data(self, spreadsheet_id: str, conversion_data: Dict) -> bool:
        """Update lead conversion information"""
        try:
            service = self.authenticate()
            if not service:
                return False
                
            # Find the row to update (search by email)
            result = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range='Leads & Revenue!A:L',
                majorDimension='ROWS'
            ).execute()
            
            rows = result.get('values', [])
            row_index = None
            
            # Find row with matching email
            for i, row in enumerate(rows[1:], 1):  # Skip header row
                if len(row) > 2 and row[2] == conversion_data.get('email'):
                    row_index = i
                    break
            
            if not row_index:
                print(f"⚠️ Lead not found: {conversion_data.get('email')}")
                return False
            
            # Update the row
            values = [
                conversion_data.get('status', 'Converted'),
                conversion_data.get('payment_link', ''),
                conversion_data.get('payment_status', 'Paid'),
                conversion_data.get('calendar_link', ''),
                conversion_data.get('meeting_scheduled', 'Yes'),
                conversion_data.get('conversion_date', datetime.now().strftime("%Y-%m-%d")),
                conversion_data.get('revenue', 0)
            ]
            
            # Update specific columns (J=Status, K=Payment Link, L=Payment Status, M=Calendar Link, N=Meeting Scheduled, O=Conversion Date, P=Revenue)
            range_to_update = f'Leads & Revenue!J{row_index + 1}:P{row_index + 1}'
            
            body = {
                'values': [values]
            }
            
            result = service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range=range_to_update,
                valueInputOption='USER_ENTERED',
                body=body
            ).execute()
            
            print(f"✅ Conversion data updated: {conversion_data.get('email')}")
            return True
            
        except HttpError as e:
            print(f"❌ Error updating conversion: {str(e)}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return False
    
    def generate_monthly_report(self, spreadsheet_id: str) -> Dict:
        """Generate comprehensive monthly analytics report"""
        try:
            service = self.authenticate()
            if not service:
                return {}
                
            # Get all data
            result = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range='Leads & Revenue!A:P',
                majorDimension='ROWS'
            ).execute()
            
            rows = result.get('values', [])
            if len(rows) < 2:
                return {'error': 'No data available'}
            
            # Calculate analytics
            headers = rows[0]
            data_rows = rows[1:]
            
            total_leads = len(data_rows)
            converted_leads = len([row for row in data_rows if len(row) > 5 and row[5] == 'Paid'])
            total_revenue = sum([int(row[11]) if len(row) > 11 and row[11].isdigit() else 0 for row in data_rows])
            
            # Service breakdown
            service_performance = {}
            for row in data_rows:
                if len(row) > 3:
                    service = row[3]
                    budget = int(row[4]) if row[4].isdigit() else 0
                    if service not in service_performance:
                        service_performance[service] = {'count': 0, 'revenue': 0}
                    service_performance[service]['count'] += 1
                    if len(row) > 11 and row[5] == 'Paid':
                        service_performance[service]['revenue'] += budget
            
            # Find top service
            top_service = max(service_performance.items(), key=lambda x: x[1]['revenue']) if service_performance else ('', {'revenue': 0})
            
            analytics = {
                'month': datetime.now().strftime("%B %Y"),
                'total_leads': total_leads,
                'converted_leads': converted_leads,
                'conversion_rate': (converted_leads / total_leads * 100) if total_leads > 0 else 0,
                'total_revenue': total_revenue,
                'average_deal_size': total_revenue / converted_leads if converted_leads > 0 else 0,
                'top_service': top_service[0] if top_service else '',
                'top_service_revenue': top_service[1]['revenue'] if top_service else 0,
                'service_breakdown': service_performance,
                'generated_at': datetime.now().isoformat()
            }
            
            print(f"📊 Monthly Report Generated:")
            print(f"   Total Leads: {analytics['total_leads']}")
            print(f"   Converted: {analytics['converted_leads']}")
            print(f"   Conversion Rate: {analytics['conversion_rate']:.1f}%")
            print(f"   Total Revenue: ${analytics['total_revenue']:,}")
            print(f"   Top Service: {analytics['top_service']}")
            
            return analytics
            
        except Exception as e:
            print(f"❌ Error generating report: {str(e)}")
            return {}
    
    def send_analytics_to_n8n(self, analytics_data: Dict):
        """Send analytics data to n8n workflow"""
        try:
            payload = {
                'event_type': 'monthly_analytics',
                'analytics': analytics_data,
                'source': 'google_sheets_automation',
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Analytics sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send analytics: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending analytics: {str(e)}")
    
    def create_real_time_dashboard(self) -> str:
        """Create a real-time dashboard for monitoring"""
        try:
            service = self.authenticate()
            if not service:
                return ""
                
            # Create real-time dashboard
            dashboard_body = {
                'properties': {
                    'title': f'9LMNTS Real-Time Dashboard - {datetime.now().strftime("%Y-%m-%d")}',
                    'locale': 'en_US',
                    'timeZone': 'America/Toronto'
                },
                'sheets': [
                    {
                        'properties': {
                            'title': 'Live Metrics',
                            'gridProperties': {
                                'frozenRowCount': 1,
                                'columnCount': 6,
                                'hideGridlines': False
                            }
                        },
                        'data': [
                            {
                                'rowData': [
                                    {
                                        'values': [
                                            'Metric', 'Current Value', 'Target', 'Performance %',
                                            'Last Updated', 'Status', 'Trend'
                                        ]
                                    },
                                    {
                                        'values': [
                                            'Active Leads', '0', '50', '0%',
                                            datetime.now().strftime("%H:%M"), 'Tracking', '→'
                                        ]
                                    },
                                    {
                                        'values': [
                                            'Today\'s Revenue', '$0', '$5,000', '0%',
                                            datetime.now().strftime("%H:%M"), 'Monitoring', '→'
                                        ]
                                    },
                                    {
                                        'values': [
                                            'Conversion Rate', '0%', '45%', '0%',
                                            datetime.now().strftime("%H:%M"), 'Optimizing', '→'
                                        ]
                                    },
                                    {
                                        'values': [
                                            'Avg Deal Size', '$0', '$3,500', '0%',
                                            datetime.now().strftime("%H:%M"), 'Calculating', '→'
                                        ]
                                    },
                                    {
                                        'values': [
                                            'Meetings Today', '0', '10', '0%',
                                            datetime.now().strftime("%H:%M"), 'Scheduling', '→'
                                        ]
                                    },
                                    {
                                        'values': [
                                            'Automation Health', '100%', '95%', '105%',
                                            datetime.now().strftime("%H:%M"), 'Optimal', '✓'
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            
            # Create dashboard
            spreadsheet = service.spreadsheets().create(
                body=dashboard_body,
                fields='spreadsheetId,sheets(title,properties)'
            ).execute()
            
            spreadsheet_id = spreadsheet.get('spreadsheetId')
            print(f"✅ Real-time dashboard created")
            print(f"🔗 Dashboard ID: {spreadsheet_id}")
            
            return spreadsheet_id
            
        except Exception as e:
            print(f"❌ Error creating dashboard: {str(e)}")
            return ""
