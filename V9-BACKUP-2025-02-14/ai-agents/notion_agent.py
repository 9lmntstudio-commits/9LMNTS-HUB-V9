"""

9LMNTS STUDIO - Notion Database Automation Agent

Automates lead management, project tracking, and database operations using Notion API

"""



import os

import json

import requests

from datetime import datetime, timedelta

from typing import Dict, List, Any, Optional



class NotionAgent:

    def __init__(self):

        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"

        self.api_key = os.getenv('NOTION_API_KEY')

        self.database_id = "your_notion_database_id"  # Will need to be set up properly

        self.base_url = "https://api.notion.com/v1"

        self.headers = {

            "Authorization": f"Bearer {self.api_key}",

            "Content-Type": "application/json",

            "Notion-Version": "2022-06-28"

        }

        

        # Database schemas

        self.database_schemas = {

            'leads': {

                'properties': {

                    'Name': {'title': {}},

                    'Email': {'email': {}},

                    'Company': {'rich_text': {}},

                    'Phone': {'phone': {}},

                    'Service Type': {'select': {'options': [

                        {'name': 'AI Brand Voice'},

                        {'name': 'Web Design'},

                        {'name': 'AI Business Automation'},

                        {'name': 'EventOS'}

                    ]}},

                    'Budget': {'number': {'format': 'dollar'}},

                    'Status': {'select': {'options': [

                        {'name': 'New'},

                        {'name': 'Contacted'},

                        {'name': 'Qualified'},

                        {'name': 'Converted'},

                        {'name': 'Lost'}

                    ]}},

                    'Source': {'select': {'options': [

                        {'name': 'Website'},

                        {'name': 'Referral'},

                        {'name': 'Social Media'},

                        {'name': 'Direct'}

                    ]}},

                    'Created Date': {'date': {}},

                    'Last Contacted': {'date': {}},

                    'Notes': {'rich_text': {}},

                    'Revenue': {'number': {'format': 'dollar'}},

                    'Meeting Scheduled': {'checkbox': {}},

                    'Payment Link': {'url': {}}

                }

            },

            'projects': {

                'properties': {

                    'Project Name': {'title': {}},

                    'Client Name': {'rich_text': {}},

                    'Service Type': {'select': {'options': [

                        {'name': 'AI Brand Voice'},

                        {'name': 'Web Design'},

                        {'name': 'AI Business Automation'},

                        {'name': 'EventOS'}

                    ]}},

                    'Status': {'select': {'options': [

                        {'name': 'Planning'},

                        {'name': 'In Progress'},

                        {'name': 'Review'},

                        {'name': 'Completed'},

                        {'name': 'On Hold'}

                    ]}},

                    'Start Date': {'date': {}},

                    'End Date': {'date': {}},

                    'Budget': {'number': {'format': 'dollar'}},

                    'Revenue': {'number': {'format': 'dollar'}},

                    'Team Members': {'multi_select': {'options': [

                        {'name': 'Project Manager'},

                        {'name': 'Designer'},

                        {'name': 'Developer'},

                        {'name': 'AI Specialist'}

                    ]}},

                    'Progress': {'number': {'format': 'percent'}},

                    'Priority': {'select': {'options': [

                        {'name': 'High'},

                        {'name': 'Medium'},

                        {'name': 'Low'}

                    ]}},

                    'Notes': {'rich_text': {}}

                }

            },

            'tasks': {

                'properties': {

                    'Task Name': {'title': {}},

                    'Project': {'relation': {'database_id': 'projects_db_id'}},

                    'Assigned To': {'select': {'options': [

                        {'name': 'Project Manager'},

                        {'name': 'Designer'},

                        {'name': 'Developer'},

                        {'name': 'AI Specialist'}

                    ]}},

                    'Status': {'select': {'options': [

                        {'name': 'To Do'},

                        {'name': 'In Progress'},

                        {'name': 'Review'},

                        {'name': 'Done'}

                    ]}},

                    'Due Date': {'date': {}},

                    'Priority': {'select': {'options': [

                        {'name': 'High'},

                        {'name': 'Medium'},

                        {'name': 'Low'}

                    ]}},

                    'Estimated Hours': {'number': {}},

                    'Actual Hours': {'number': {}},

                    'Description': {'rich_text': {}}

                }

            }

        }

    

    def create_lead_page(self, lead_data: Dict) -> Dict:

        """Create lead page in Notion database"""

        try:

            # Prepare page properties

            properties = {

                'Name': {'title': [{'text': {'content': lead_data.get('name', '')}}]},

                'Email': {'email': lead_data.get('email', '')},

                'Company': {'rich_text': [{'text': {'content': lead_data.get('company', '')}}]},

                'Phone': {'phone': lead_data.get('phone', '')},

                'Service Type': {'select': {'name': lead_data.get('service_type', 'AI Brand Voice')}},

                'Budget': {'number': lead_data.get('budget', 0)},

                'Status': {'select': {'name': 'New'}},

                'Source': {'select': {'name': lead_data.get('source', 'Website')}},

                'Created Date': {'date': {'start': datetime.now().isoformat()}},

                'Meeting Scheduled': {'checkbox': False},

                'Payment Link': {'url': f"https://PayPal.Me/9LMNTSSTUDIO/{lead_data.get('budget', 2000)}"}

            }

            

            # Create page data

            page_data = {

                'parent': {'database_id': self.database_id},

                'properties': properties,

                'children': [

                    {

                        'object': 'block',

                        'type': 'heading_2',

                        'heading_2': {

                            'rich_text': [{'text': {'content': 'Lead Details'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'paragraph',

                        'paragraph': {

                            'rich_text': [

                                {'text': {'content': f"Timeline: {lead_data.get('timeline', '')}"}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': f"Project: {lead_data.get('project_name', '')}"}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': f"Description: {lead_data.get('description', '')}"}}

                            ]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'heading_3',

                        'heading_3': {

                            'rich_text': [{'text': {'content': 'Next Steps'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'to_do_list',

                        'to_do_list': {

                            'rich_text': [

                                {'text': {'content': 'Send welcome email'}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': 'Schedule consultation meeting'}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': 'Prepare proposal'}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': 'Follow up within 24 hours'}}

                            ]

                        }

                    }

                ]

            }

            

            # Send to Notion API

            response = requests.post(

                f"{self.base_url}/pages",

                headers=self.headers,

                json=page_data

            )

            

            if response.status_code == 200:

                page_info = response.json()

                lead_page = {

                    'success': True,

                    'page_id': page_info.get('id', ''),

                    'page_url': page_info.get('url', ''),

                    'client_name': lead_data.get('name', ''),

                    'client_email': lead_data.get('email', ''),

                    'service_type': lead_data.get('service_type', ''),

                    'budget': lead_data.get('budget', 0),

                    'status': 'New',

                    'created_at': datetime.now().isoformat()

                }

                

                print(f"✅ Lead page created: {lead_data.get('name')}")

                return lead_page

            else:

                print(f"❌ Error creating lead page: {response.status_code}")

                return self.get_fallback_lead_page(lead_data)

                

        except Exception as e:

            print(f"❌ Error creating lead page: {str(e)}")

            return self.get_fallback_lead_page(lead_data)

    

    def update_lead_status(self, page_id: str, status: str, additional_data: Dict = None) -> bool:

        """Update lead status in Notion"""

        try:

            properties = {

                'Status': {'select': {'name': status}},

                'Last Contacted': {'date': {'start': datetime.now().isoformat()}}

            }

            

            # Add additional properties if provided

            if additional_data:

                if 'revenue' in additional_data:

                    properties['Revenue'] = {'number': additional_data['revenue']}

                if 'meeting_scheduled' in additional_data:

                    properties['Meeting Scheduled'] = {'checkbox': additional_data['meeting_scheduled']}

                if 'notes' in additional_data:

                    properties['Notes'] = {'rich_text': [{'text': {'content': additional_data['notes']}}]}

            

            # Update page

            response_data = {

                'properties': properties

            }

            

            response = requests.patch(

                f"{self.base_url}/pages/{page_id}",

                headers=self.headers,

                json=response_data

            )

            

            if response.status_code == 200:

                print(f"✅ Lead status updated: {status}")

                return True

            else:

                print(f"❌ Error updating lead status: {response.status_code}")

                return False

                

        except Exception as e:

            print(f"❌ Error updating lead status: {str(e)}")

            return False

    

    def create_project_page(self, project_data: Dict) -> Dict:

        """Create project page in Notion"""

        try:

            properties = {

                'Project Name': {'title': [{'text': {'content': project_data.get('project_name', '')}}]},

                'Client Name': {'rich_text': [{'text': {'content': project_data.get('client_name', '')}}]},

                'Service Type': {'select': {'name': project_data.get('service_type', 'AI Brand Voice')}},

                'Status': {'select': {'name': 'Planning'}},

                'Start Date': {'date': {'start': datetime.now().isoformat()}},

                'Budget': {'number': project_data.get('budget', 0)},

                'Priority': {'select': {'name': project_data.get('priority', 'Medium')}},

                'Progress': {'number': 0}

            }

            

            # Create page with project structure

            page_data = {

                'parent': {'database_id': self.database_id},

                'properties': properties,

                'children': [

                    {

                        'object': 'block',

                        'type': 'heading_2',

                        'heading_2': {

                            'rich_text': [{'text': {'content': 'Project Overview'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'paragraph',

                        'paragraph': {

                            'rich_text': [

                                {'text': {'content': f"Client: {project_data.get('client_name', '')}"}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': f"Service: {project_data.get('service_type', '')}"}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': f"Timeline: {project_data.get('timeline', '')}"}},

                                {'text': {'content': '\n'}},

                                {'text': {'content': f"Budget: ${project_data.get('budget', 0):,}"}}

                            ]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'heading_3',

                        'heading_3': {

                            'rich_text': [{'text': {'content': 'Project Phases'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'bulleted_list_item',

                        'bulleted_list_item': {

                            'rich_text': [{'text': {'content': 'Phase 1: Discovery & Planning'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'bulleted_list_item',

                        'bulleted_list_item': {

                            'rich_text': [{'text': {'content': 'Phase 2: Design & Development'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'bulleted_list_item',

                        'bulleted_list_item': {

                            'rich_text': [{'text': {'content': 'Phase 3: Testing & Review'}}]

                        }

                    },

                    {

                        'object': 'block',

                        'type': 'bulleted_list_item',

                        'bulleted_list_item': {

                            'rich_text': [{'text': {'content': 'Phase 4: Launch & Delivery'}}]

                        }

                    }

                ]

            }

            

            response = requests.post(

                f"{self.base_url}/pages",

                headers=self.headers,

                json=page_data

            )

            

            if response.status_code == 200:

                page_info = response.json()

                project_page = {

                    'success': True,

                    'page_id': page_info.get('id', ''),

                    'page_url': page_info.get('url', ''),

                    'project_name': project_data.get('project_name', ''),

                    'client_name': project_data.get('client_name', ''),

                    'service_type': project_data.get('service_type', ''),

                    'budget': project_data.get('budget', 0),

                    'status': 'Planning',

                    'created_at': datetime.now().isoformat()

                }

                

                print(f"✅ Project page created: {project_data.get('project_name')}")

                return project_page

            else:

                print(f"❌ Error creating project page: {response.status_code}")

                return self.get_fallback_project_page(project_data)

                

        except Exception as e:

            print(f"❌ Error creating project page: {str(e)}")

            return self.get_fallback_project_page(project_data)

    

    def create_task_page(self, task_data: Dict) -> Dict:

        """Create task page in Notion"""

        try:

            properties = {

                'Task Name': {'title': [{'text': {'content': task_data.get('task_name', '')}}]},

                'Assigned To': {'select': {'name': task_data.get('assigned_to', 'Project Manager')}},

                'Status': {'select': {'name': 'To Do'}},

                'Priority': {'select': {'name': task_data.get('priority', 'Medium')}},

                'Estimated Hours': {'number': task_data.get('estimated_hours', 0)}

            }

            

            if task_data.get('due_date'):

                properties['Due Date'] = {'date': {'start': task_data['due_date']}}

            

            page_data = {

                'parent': {'database_id': self.database_id},

                'properties': properties,

                'children': [

                    {

                        'object': 'block',

                        'type': 'paragraph',

                        'paragraph': {

                            'rich_text': [{'text': {'content': task_data.get('description', '')}}]

                        }

                    }

                ]

            }

            

            response = requests.post(

                f"{self.base_url}/pages",

                headers=self.headers,

                json=page_data

            )

            

            if response.status_code == 200:

                page_info = response.json()

                task_page = {

                    'success': True,

                    'page_id': page_info.get('id', ''),

                    'page_url': page_info.get('url', ''),

                    'task_name': task_data.get('task_name', ''),

                    'assigned_to': task_data.get('assigned_to', ''),

                    'status': 'To Do',

                    'priority': task_data.get('priority', 'Medium'),

                    'created_at': datetime.now().isoformat()

                }

                

                print(f"✅ Task page created: {task_data.get('task_name')}")

                return task_page

            else:

                print(f"❌ Error creating task page: {response.status_code}")

                return self.get_fallback_task_page(task_data)

                

        except Exception as e:

            print(f"❌ Error creating task page: {str(e)}")

            return self.get_fallback_task_page(task_data)

    

    def get_leads_from_database(self, status_filter: str = None) -> List[Dict]:

        """Get leads from Notion database"""

        try:

            url = f"{self.base_url}/databases/{self.database_id}/query"

            

            # Add filter if provided

            if status_filter:

                data = {

                    'filter': {

                        'property': 'Status',

                        'select': {'equals': status_filter}

                    }

                }

            else:

                data = {}

            

            response = requests.post(url, headers=self.headers, json=data)

            

            if response.status_code == 200:

                results = response.json().get('results', [])

                leads = []

                

                for result in results:

                    properties = result.get('properties', {})

                    lead = {

                        'page_id': result.get('id', ''),

                        'name': self.get_property_value(properties, 'Name'),

                        'email': self.get_property_value(properties, 'Email'),

                        'company': self.get_property_value(properties, 'Company'),

                        'service_type': self.get_property_value(properties, 'Service Type'),

                        'budget': self.get_property_value(properties, 'Budget'),

                        'status': self.get_property_value(properties, 'Status'),

                        'created_date': self.get_property_value(properties, 'Created Date'),

                        'revenue': self.get_property_value(properties, 'Revenue')

                    }

                    leads.append(lead)

                

                print(f"✅ Retrieved {len(leads)} leads from Notion")

                return leads

            else:

                print(f"❌ Error retrieving leads: {response.status_code}")

                return []

                

        except Exception as e:

            print(f"❌ Error retrieving leads: {str(e)}")

            return []

    

    def get_property_value(self, properties: Dict, property_name: str) -> Any:

        """Extract value from Notion property"""

        prop = properties.get(property_name, {})

        

        if prop.get('type') == 'title':

            title = prop.get('title', [])

            return title[0].get('text', {}).get('content', '') if title else ''

        elif prop.get('type') == 'email':

            return prop.get('email', '')

        elif prop.get('type') == 'rich_text':

            text = prop.get('rich_text', [])

            return text[0].get('text', {}).get('content', '') if text else ''

        elif prop.get('type') == 'select':

            return prop.get('select', {}).get('name', '')

        elif prop.get('type') == 'number':

            return prop.get('number', 0)

        elif prop.get('type') == 'date':

            return prop.get('date', {}).get('start', '')

        elif prop.get('type') == 'checkbox':

            return prop.get('checkbox', False)

        

        return None

    

    def generate_analytics_report(self) -> Dict:

        """Generate analytics report from Notion data"""

        try:

            leads = self.get_leads_from_database()

            

            total_leads = len(leads)

            converted_leads = len([lead for lead in leads if lead.get('status') == 'Converted'])

            total_revenue = sum([lead.get('revenue', 0) for lead in leads])

            

            # Service breakdown

            service_counts = {}

            for lead in leads:

                service = lead.get('service_type', 'Unknown')

                service_counts[service] = service_counts.get(service, 0) + 1

            

            # Status breakdown

            status_counts = {}

            for lead in leads:

                status = lead.get('status', 'Unknown')

                status_counts[status] = status_counts.get(status, 0) + 1

            

            analytics = {

                'total_leads': total_leads,

                'converted_leads': converted_leads,

                'conversion_rate': (converted_leads / total_leads * 100) if total_leads > 0 else 0,

                'total_revenue': total_revenue,

                'average_deal_size': total_revenue / converted_leads if converted_leads > 0 else 0,

                'service_breakdown': service_counts,

                'status_breakdown': status_counts,

                'generated_at': datetime.now().isoformat()

            }

            

            print(f"✅ Analytics report generated: {total_leads} leads, ${total_revenue:,} revenue")

            return analytics

            

        except Exception as e:

            print(f"❌ Error generating analytics report: {str(e)}")

            return {}

    

    def get_fallback_lead_page(self, lead_data: Dict) -> Dict:

        """Fallback lead page"""

        return {

            'success': False,

            'page_id': 'fallback-id',

            'page_url': 'https://notion.so/fallback',

            'client_name': lead_data.get('name', ''),

            'client_email': lead_data.get('email', ''),

            'service_type': lead_data.get('service_type', ''),

            'budget': lead_data.get('budget', 0),

            'status': 'New',

            'created_at': datetime.now().isoformat()

        }

    

    def get_fallback_project_page(self, project_data: Dict) -> Dict:

        """Fallback project page"""

        return {

            'success': False,

            'page_id': 'fallback-project-id',

            'page_url': 'https://notion.so/fallback-project',

            'project_name': project_data.get('project_name', ''),

            'client_name': project_data.get('client_name', ''),

            'service_type': project_data.get('service_type', ''),

            'budget': project_data.get('budget', 0),

            'status': 'Planning',

            'created_at': datetime.now().isoformat()

        }

    

    def get_fallback_task_page(self, task_data: Dict) -> Dict:

        """Fallback task page"""

        return {

            'success': False,

            'page_id': 'fallback-task-id',

            'page_url': 'https://notion.so/fallback-task',

            'task_name': task_data.get('task_name', ''),

            'assigned_to': task_data.get('assigned_to', ''),

            'status': 'To Do',

            'priority': task_data.get('priority', 'Medium'),

            'created_at': datetime.now().isoformat()

        }

    

    def send_notion_data_to_n8n(self, notion_data: Dict):

        """Send Notion data to n8n workflow"""

        try:

            payload = {

                'event_type': 'notion_data_updated',

                'notion_data': notion_data,

                'source': 'notion_automation',

                'timestamp': datetime.now().isoformat()

            }

            

            response = requests.post(

                self.n8n_webhook_url,

                json=payload,

                headers={'Content-Type': 'application/json'},

                timeout=30

            )

            

            if response.status_code == 200:

                print("✅ Notion data sent to n8n workflow")

            else:

                print(f"⚠️ Failed to send to n8n: {response.status_code}")

                

        except Exception as e:

            print(f"❌ Error sending to n8n: {str(e)}")

