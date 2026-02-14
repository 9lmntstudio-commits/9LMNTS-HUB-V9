"""
9LMNTS STUDIO - Gemini AI Automation Agent
Google AI-powered content generation, analysis, and automation using Gemini API
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
import google.generativeai as genai

class GeminiAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.api_key = "AIzaSyCW1v3MHnAz_ZMOFSRIepMeGh_9mzrGGAY"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Content templates
        self.content_templates = {
            'google_docs': 'Create professional Google Docs content for business automation',
            'google_sheets': 'Generate Google Sheets formulas and automation scripts',
            'calendar_integration': 'Create calendar automation and scheduling content',
            'google_analytics': 'Generate Google Analytics reports and insights'
        }
        
    def generate_google_docs_content(self, document_type: str, client_data: Dict) -> Dict:
        """Generate Google Docs content"""
        try:
            prompt = f"""
            Create a professional {document_type} document for 9LMNTS Studio client:
            
            Client Details:
            - Name: {client_data.get('name', '')}
            - Company: {client_data.get('company', '')}
            - Service: {client_data.get('service_type', '')}
            - Budget: ${client_data.get('budget', 0):,}
            - Timeline: {client_data.get('timeline', '')}
            
            Document Type: {document_type}
            
            Requirements:
            - Professional formatting
            - Clear sections and headings
            - Action-oriented content
            - Include pricing and next steps
            - 500-800 words
            - Business-appropriate tone
            
            Format as structured content ready for Google Docs.
            """
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            doc_data = {
                'document_type': document_type,
                'client_name': client_data.get('name', ''),
                'content': content,
                'word_count': len(content.split()),
                'created_at': datetime.now().isoformat()
            }
            
            print(f"✅ Google Docs content generated: {document_type}")
            return doc_data
            
        except Exception as e:
            print(f"❌ Error generating Google Docs content: {str(e)}")
            return self.get_fallback_docs_content(document_type, client_data)
    
    def generate_google_sheets_automation(self, automation_type: str, requirements: Dict) -> Dict:
        """Generate Google Sheets automation"""
        try:
            prompt = f"""
            Create Google Sheets automation for {automation_type}:
            
            Requirements: {requirements}
            
            Generate:
            1. Formula for data processing
            2. Automation script description
            3. Data validation rules
            4. Dashboard setup instructions
            5. Reporting template
            
            Focus on business automation and revenue tracking.
            Format as actionable steps with examples.
            """
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            automation_data = {
                'automation_type': automation_type,
                'formulas': [],
                'scripts': [],
                'validation_rules': [],
                'dashboard_setup': '',
                'reporting_template': '',
                'content': content,
                'created_at': datetime.now().isoformat()
            }
            
            # Parse content into structured format
            lines = content.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if 'Formula:' in line or '1.' in line:
                    automation_data['formulas'].append(line)
                elif 'Script:' in line or '2.' in line:
                    automation_data['scripts'].append(line)
                elif 'Validation:' in line or '3.' in line:
                    automation_data['validation_rules'].append(line)
                elif 'Dashboard:' in line or '4.' in line:
                    automation_data['dashboard_setup'] = line
                elif 'Reporting:' in line or '5.' in line:
                    automation_data['reporting_template'] = line
            
            print(f"✅ Google Sheets automation generated: {automation_type}")
            return automation_data
            
        except Exception as e:
            print(f"❌ Error generating Sheets automation: {str(e)}")
            return self.get_fallback_sheets_automation(automation_type, requirements)
    
    def create_calendar_automation(self, meeting_data: Dict) -> Dict:
        """Create calendar automation content"""
        try:
            prompt = f"""
            Create calendar automation for business meetings:
            
            Meeting Details:
            - Client: {meeting_data.get('client_name', '')}
            - Service: {meeting_data.get('service_type', '')}
            - Duration: {meeting_data.get('duration', 60)} minutes
            - Budget: ${meeting_data.get('budget', 0):,}
            
            Generate:
            1. Meeting agenda template
            2. Automated reminder schedule
            3. Follow-up sequence
            4. Calendar integration steps
            5. Time zone management
            
            Focus on professional meeting automation.
            """
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            calendar_data = {
                'client_name': meeting_data.get('client_name', ''),
                'service_type': meeting_data.get('service_type', ''),
                'meeting_agenda': '',
                'reminder_schedule': [],
                'follow_up_sequence': [],
                'integration_steps': [],
                'time_zone_management': '',
                'content': content,
                'created_at': datetime.now().isoformat()
            }
            
            # Parse content into structured format
            lines = content.split('\n')
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if 'Agenda:' in line:
                    calendar_data['meeting_agenda'] = line
                elif 'Reminder:' in line:
                    calendar_data['reminder_schedule'].append(line)
                elif 'Follow-up:' in line:
                    calendar_data['follow_up_sequence'].append(line)
                elif 'Integration:' in line:
                    calendar_data['integration_steps'].append(line)
                elif 'Time zone:' in line:
                    calendar_data['time_zone_management'] = line
            
            print(f"✅ Calendar automation created for {meeting_data.get('client_name', '')}")
            return calendar_data
            
        except Exception as e:
            print(f"❌ Error creating calendar automation: {str(e)}")
            return self.get_fallback_calendar_automation(meeting_data)
    
    def generate_google_analytics_report(self, analytics_data: Dict) -> Dict:
        """Generate Google Analytics insights"""
        try:
            prompt = f"""
            Analyze business analytics and generate insights:
            
            Analytics Data:
            - Total Leads: {analytics_data.get('total_leads', 0)}
            - Conversion Rate: {analytics_data.get('conversion_rate', 0)}%
            - Revenue: ${analytics_data.get('revenue', 0):,}
            - Top Service: {analytics_data.get('top_service', '')}
            - Time Period: {analytics_data.get('period', 'Last 30 days')}
            
            Generate:
            1. Executive summary
            2. Key performance indicators
            3. Growth opportunities
            4. Optimization recommendations
            5. Revenue projections
            
            Focus on actionable business insights.
            """
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            report_data = {
                'executive_summary': '',
                'key_indicators': [],
                'growth_opportunities': [],
                'optimization_recommendations': [],
                'revenue_projections': '',
                'content': content,
                'generated_at': datetime.now().isoformat()
            }
            
            # Parse content into structured format
            lines = content.split('\n')
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if 'Summary:' in line:
                    report_data['executive_summary'] = line
                elif 'Indicator:' in line:
                    report_data['key_indicators'].append(line)
                elif 'Opportunity:' in line:
                    report_data['growth_opportunities'].append(line)
                elif 'Recommendation:' in line:
                    report_data['optimization_recommendations'].append(line)
                elif 'Projection:' in line:
                    report_data['revenue_projections'] = line
            
            print(f"✅ Google Analytics report generated")
            return report_data
            
        except Exception as e:
            print(f"❌ Error generating analytics report: {str(e)}")
            return self.get_fallback_analytics_report(analytics_data)
    
    def create_ai_content_strategy(self, business_data: Dict) -> Dict:
        """Create comprehensive AI content strategy"""
        try:
            prompt = f"""
            Create AI-powered content strategy for business:
            
            Business Details:
            - Industry: {business_data.get('industry', '')}
            - Target Audience: {business_data.get('target_audience', '')}
            - Goals: {business_data.get('goals', '')}
            - Budget: ${business_data.get('budget', 0):,}
            - Timeline: {business_data.get('timeline', '')}
            
            Generate:
            1. Content pillars
            2. AI automation opportunities
            3. Content calendar template
            4. Distribution strategy
            5. Performance metrics
            
            Focus on scalable AI-driven content production.
            """
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            strategy_data = {
                'industry': business_data.get('industry', ''),
                'content_pillars': [],
                'ai_automation_opportunities': [],
                'content_calendar': '',
                'distribution_strategy': [],
                'performance_metrics': [],
                'content': content,
                'created_at': datetime.now().isoformat()
            }
            
            # Parse content into structured format
            lines = content.split('\n')
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if 'Pillar:' in line:
                    strategy_data['content_pillars'].append(line)
                elif 'Automation:' in line:
                    strategy_data['ai_automation_opportunities'].append(line)
                elif 'Calendar:' in line:
                    strategy_data['content_calendar'] = line
                elif 'Distribution:' in line:
                    strategy_data['distribution_strategy'].append(line)
                elif 'Metric:' in line:
                    strategy_data['performance_metrics'].append(line)
            
            print(f"✅ AI content strategy created")
            return strategy_data
            
        except Exception as e:
            print(f"❌ Error creating content strategy: {str(e)}")
            return self.get_fallback_content_strategy(business_data)
    
    def get_fallback_docs_content(self, document_type: str, client_data: Dict) -> Dict:
        """Fallback Google Docs content"""
        return {
            'document_type': document_type,
            'client_name': client_data.get('name', ''),
            'content': f'<h1>{document_type}</h1><p>Professional document for {client_data.get("name", "")}</p>',
            'word_count': 100,
            'created_at': datetime.now().isoformat()
        }
    
    def get_fallback_sheets_automation(self, automation_type: str, requirements: Dict) -> Dict:
        """Fallback Google Sheets automation"""
        return {
            'automation_type': automation_type,
            'formulas': ['=SUM(A1:A10)', '=AVERAGE(B1:B10)'],
            'scripts': ['Basic automation script'],
            'validation_rules': ['Data validation rules'],
            'dashboard_setup': 'Dashboard setup instructions',
            'reporting_template': 'Reporting template',
            'content': 'Basic Google Sheets automation',
            'created_at': datetime.now().isoformat()
        }
    
    def get_fallback_calendar_automation(self, meeting_data: Dict) -> Dict:
        """Fallback calendar automation"""
        return {
            'client_name': meeting_data.get('client_name', ''),
            'service_type': meeting_data.get('service_type', ''),
            'meeting_agenda': 'Professional meeting agenda',
            'reminder_schedule': ['24 hours before', '1 hour before'],
            'follow_up_sequence': ['Immediate follow-up', '24-hour follow-up'],
            'integration_steps': ['Calendar integration steps'],
            'time_zone_management': 'Time zone management',
            'content': 'Basic calendar automation',
            'created_at': datetime.now().isoformat()
        }
    
    def get_fallback_analytics_report(self, analytics_data: Dict) -> Dict:
        """Fallback analytics report"""
        return {
            'executive_summary': 'Analytics executive summary',
            'key_indicators': ['Lead conversion rate', 'Revenue growth'],
            'growth_opportunities': ['Increase marketing', 'Improve conversion'],
            'optimization_recommendations': ['Optimize funnel', 'Improve targeting'],
            'revenue_projections': 'Revenue projections based on current trends',
            'content': 'Basic analytics report',
            'generated_at': datetime.now().isoformat()
        }
    
    def get_fallback_content_strategy(self, business_data: Dict) -> Dict:
        """Fallback content strategy"""
        return {
            'industry': business_data.get('industry', ''),
            'content_pillars': ['Industry insights', 'Product benefits', 'Case studies'],
            'ai_automation_opportunities': ['Content generation', 'Social media posting'],
            'content_calendar': 'Monthly content calendar template',
            'distribution_strategy': ['Social media', 'Email marketing', 'Blog'],
            'performance_metrics': ['Engagement rate', 'Conversion rate', 'ROI'],
            'content': 'Basic content strategy',
            'created_at': datetime.now().isoformat()
        }
    
    def send_gemini_content_to_n8n(self, content_data: Dict):
        """Send Gemini-generated content to n8n workflow"""
        try:
            payload = {
                'event_type': 'gemini_content_generated',
                'content': content_data,
                'source': 'gemini_automation',
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Gemini content sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send to n8n: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending to n8n: {str(e)}")
