"""
9LMNTS STUDIO - Google Drive Automation Agent
Automates file storage, sharing, and client collaboration through Google Drive
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class GoogleDriveAgent:
    def __init__(self):
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.app_password = os.getenv("GOOGLE_APP_PASSWORD", "odzf ccmx scdu kerx")
        self.service_account_key = os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY")
        self.scopes = ['https://www.googleapis.com/auth/drive']
        self.folder_id = None
        
    def authenticate(self):
        """Authenticate with Google Drive using service account"""
        try:
            if self.service_account_key and os.path.exists(self.service_account_key):
                creds = Credentials.from_service_account_file(
                    self.service_account_key, 
                    scopes=self.scopes
                )
                return build('drive', 'v3', credentials=creds)
            else:
                print("⚠️ Service account key not found. Using app password fallback.")
                # Fallback to app password method
                return None
        except Exception as e:
            print(f"❌ Google Drive authentication error: {str(e)}")
            return None
    
    def create_client_folder(self, client_name: str, client_email: str) -> Optional[str]:
        """Create a dedicated folder for each client"""
        try:
            service = self.authenticate()
            if not service:
                return None
                
            # Create folder metadata
            folder_metadata = {
                'name': f'{client_name} - {client_email}',
                'mimeType': 'application/vnd.google-apps.folder',
                'description': f'Project files and deliverables for {client_name}'
            }
            
            # Create folder
            folder = service.files().create(
                body=folder_metadata,
                fields='id,name,webViewLink'
            ).execute()
            
            folder_id = folder.get('id')
            folder_link = folder.get('webViewLink')
            
            print(f"✅ Created client folder: {folder_metadata['name']}")
            print(f"🔗 Folder link: {folder_link}")
            
            return {
                'folder_id': folder_id,
                'folder_name': folder_metadata['name'],
                'folder_link': folder_link,
                'client_name': client_name,
                'client_email': client_email
            }
            
        except HttpError as e:
            print(f"❌ Error creating folder: {str(e)}")
            return None
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return None
    
    def upload_project_files(self, folder_id: str, files_data: List[Dict]) -> List[Dict]:
        """Upload multiple project files to client folder"""
        try:
            service = self.authenticate()
            if not service:
                return []
                
            uploaded_files = []
            
            for file_data in files_data:
                # Create file metadata
                file_metadata = {
                    'name': file_data['name'],
                    'parents': [folder_id]
                }
                
                # Upload file
                if 'content' in file_data:
                    media = MediaIoBaseUpload(
                        file_data['content'], 
                        mimetype=file_data.get('mimetype', 'application/octet-stream')
                    )
                    
                    file = service.files().create(
                        body=file_metadata,
                        media_body=media,
                        fields='id,name,size,webViewLink,createdTime'
                    ).execute()
                    
                    uploaded_files.append({
                        'file_id': file.get('id'),
                        'file_name': file.get('name'),
                        'file_size': file.get('size'),
                        'file_link': file.get('webViewLink'),
                        'created_time': file.get('createdTime')
                    })
                    
                    print(f"✅ Uploaded: {file_data['name']}")
            
            return uploaded_files
            
        except HttpError as e:
            print(f"❌ Error uploading files: {str(e)}")
            return []
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return []
    
    def share_folder_with_client(self, folder_id: str, client_email: str) -> bool:
        """Share client folder with the client"""
        try:
            service = self.authenticate()
            if not service:
                return False
                
            # Create permission for client
            permission = {
                'type': 'user',
                'role': 'reader',
                'emailAddress': client_email
            }
            
            # Share folder
            service.permissions().create(
                fileId=folder_id,
                body=permission
            ).execute()
            
            print(f"✅ Folder shared with: {client_email}")
            return True
            
        except HttpError as e:
            print(f"❌ Error sharing folder: {str(e)}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return False
    
    def create_deliverable_package(self, client_data: Dict, project_files: List[Dict]) -> Dict:
        """Create complete deliverable package for client"""
        try:
            # Create client folder
            client_folder = self.create_client_folder(
                client_data['name'], 
                client_data['email']
            )
            
            if not client_folder:
                return {'success': False, 'error': 'Failed to create client folder'}
            
            # Upload project files
            uploaded_files = self.upload_project_files(
                client_folder['folder_id'], 
                project_files
            )
            
            # Share folder with client
            shared = self.share_folder_with_client(
                client_folder['folder_id'], 
                client_data['email']
            )
            
            # Prepare deliverable information
            deliverable_info = {
                'success': True,
                'client_name': client_data['name'],
                'client_email': client_data['email'],
                'folder_id': client_folder['folder_id'],
                'folder_link': client_folder['folder_link'],
                'uploaded_files': uploaded_files,
                'files_count': len(uploaded_files),
                'shared_with_client': shared,
                'created_at': datetime.now().isoformat(),
                'total_size': sum(f.get('file_size', 0) for f in uploaded_files)
            }
            
            # Send to n8n workflow
            self.send_deliverable_to_n8n(deliverable_info)
            
            return deliverable_info
            
        except Exception as e:
            print(f"❌ Error creating deliverable package: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def send_deliverable_to_n8n(self, deliverable_info: Dict):
        """Send deliverable information to n8n workflow"""
        try:
            payload = {
                'event_type': 'deliverable_created',
                'client_name': deliverable_info['client_name'],
                'client_email': deliverable_info['client_email'],
                'folder_link': deliverable_info['folder_link'],
                'files_count': deliverable_info['files_count'],
                'total_size': deliverable_info['total_size'],
                'shared_with_client': deliverable_info['shared_with_client'],
                'created_at': deliverable_info['created_at'],
                'source': 'google_drive_automation'
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Deliverable info sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send to n8n: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending to n8n: {str(e)}")
    
    def get_drive_analytics(self) -> Dict:
        """Get Drive usage and analytics"""
        try:
            service = self.authenticate()
            if not service:
                return {}
                
            # Get storage usage
            about = service.about().get(fields='storageQuota').execute()
            storage_quota = about.get('storageQuota', {})
            
            analytics = {
                'total_storage': storage_quota.get('limit', 0),
                'used_storage': storage_quota.get('usage', 0),
                'available_storage': storage_quota.get('limit', 0) - storage_quota.get('usage', 0),
                'usage_percentage': (storage_quota.get('usage', 0) / storage_quota.get('limit', 1)) * 100,
                'checked_at': datetime.now().isoformat()
            }
            
            print(f"📊 Drive Usage: {analytics['usage_percentage']:.1f}%")
            return analytics
            
        except Exception as e:
            print(f"❌ Error getting Drive analytics: {str(e)}")
            return {}
    
    def create_project_template(self, service_type: str) -> List[Dict]:
        """Create template files for different service types"""
        templates = {
            'ai_brand_voice': [
                {'name': 'AI Brand Guidelines.pdf', 'mimetype': 'application/pdf'},
                {'name': 'Content Strategy.docx', 'mimetype': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
                {'name': 'Voice Examples.txt', 'mimetype': 'text/plain'}
            ],
            'web_design': [
                {'name': 'Design Mockups.fig', 'mimetype': 'application/figma'},
                {'name': 'Website Assets.zip', 'mimetype': 'application/zip'},
                {'name': 'Style Guide.pdf', 'mimetype': 'application/pdf'}
            ],
            'ai_business_automation': [
                {'name': 'Automation Workflow.pdf', 'mimetype': 'application/pdf'},
                {'name': 'Process Documentation.docx', 'mimetype': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
                {'name': 'Technical Specifications.xlsx', 'mimetype': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            ]
        }
        
        return templates.get(service_type, [])

# Add missing import
from googleapiclient.http import MediaIoBaseUpload
