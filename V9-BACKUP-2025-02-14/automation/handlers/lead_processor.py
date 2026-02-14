"""
📋 Lead Processor - 9LMNTS Studio
Handles incoming lead processing and qualification
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger(__name__)


class LeadProcessor:
    """Process incoming leads through qualification and routing"""

    def __init__(self, config):
        self.config = config
        self.n8n_webhook = config.N8N_WEBHOOK_URL
        self.railway_api = config.RAILWAY_API_URL

    def process_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process incoming lead

        Args:
            lead_data: Lead information from form submission

        Returns:
            Dict with processing results
        """
        try:
            print(f"\n📋 Processing lead: {lead_data.get('name')}")

            # Step 1: Validate lead data
            if not self._validate_lead(lead_data):
                return {'success': False, 'error': 'Invalid lead data'}

            # Step 2: Qualify lead
            qualification = self._qualify_lead(lead_data)

            # Step 3: Route to n8n webhook
            webhook_result = self._send_to_webhook(lead_data, qualification)

            # Step 4: Generate payment link
            payment_link = self._get_payment_link(lead_data)

            # Step 5: Send to database
            db_result = self._store_lead(lead_data, qualification)

            return {
                'success': True,
                'lead_id': db_result.get('id'),
                'qualification': qualification,
                'payment_link': payment_link,
                'webhook_sent': webhook_result.get('success', False),
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error processing lead: {str(e)}")
            return {'success': False, 'error': str(e)}

    def _validate_lead(self, lead_data: Dict) -> bool:
        """Validate required lead fields"""
        required_fields = ['name', 'email', 'service_type', 'budget']

        missing = [f for f in required_fields if not lead_data.get(f)]
        if missing:
            logger.warning(f"Missing fields: {missing}")
            return False

        return True

    def _qualify_lead(self, lead_data: Dict) -> Dict[str, Any]:
        """Qualify lead using AI and rules"""
        budget = int(lead_data.get('budget', 0))
        service = lead_data.get('service_type', '')

        # Qualification scoring (0-100)
        score = 0

        # Budget scoring (0-40 points)
        if budget >= 5000:
            score += 40
        elif budget >= 3000:
            score += 30
        elif budget >= 1000:
            score += 20
        else:
            score += 10

        # Service-specific scoring (0-30 points)
        service_scores = {
            'AI Business Automation': 30,
            'AI Brand Voice': 25,
            'Web Design': 20,
            'EventOS': 25,
        }
        score += service_scores.get(service, 15)

        # Timeline scoring (0-30 points)
        timeline = lead_data.get('timeline', '').lower()
        if 'week' in timeline:
            score += 30  # Urgent = likely to close
        elif 'month' in timeline:
            score += 20
        else:
            score += 10

        # Categorize lead
        if score >= 80:
            category = 'HOT'
        elif score >= 60:
            category = 'WARM'
        else:
            category = 'COLD'

        return {
            'score': min(100, score),
            'category': category,
            'qualified': category in ['HOT', 'WARM']
        }

    def _send_to_webhook(self, lead_data: Dict, qualification: Dict) -> Dict[str, Any]:
        """Send lead to n8n webhook for automation"""
        try:
            payload = {
                **lead_data,
                'qualification_score': qualification['score'],
                'qualification_category': qualification['category'],
                'received_at': datetime.now().isoformat()
            }

            response = requests.post(
                self.n8n_webhook,
                json=payload,
                timeout=10,
                headers={'Content-Type': 'application/json'}
            )

            success = response.status_code in [200, 201]
            logger.info(f"Webhook sent: {response.status_code}")

            return {'success': success, 'status_code': response.status_code}

        except Exception as e:
            logger.error(f"Webhook error: {str(e)}")
            return {'success': False, 'error': str(e)}

    def _get_payment_link(self, lead_data: Dict) -> str:
        """Get payment link based on service type"""
        service = lead_data.get('service_type', 'AI Brand Voice')

        paypal_links = {
            'AI Brand Voice': 'https://PayPal.Me/9LMNTSSTUDIO/2000',
            'Web Design': 'https://PayPal.Me/9LMNTSSTUDIO/1500',
            'EventOS': 'https://PayPal.Me/9LMNTSSTUDIO/1000',
            'AI Business Automation': 'https://PayPal.Me/9LMNTSSTUDIO/3000',
        }

        return paypal_links.get(service, 'https://PayPal.Me/9LMNTSSTUDIO')

    def _store_lead(self, lead_data: Dict, qualification: Dict) -> Dict[str, Any]:
        """Store lead in database"""
        try:
            # Store in analytics database (SQLite)
            import sqlite3
            from datetime import datetime

            conn = sqlite3.connect(self.config.DATABASE_PATH)
            cursor = conn.cursor()

            cursor.execute('''
                INSERT INTO leads (
                    name, email, company, service_type, budget,
                    timeline, qualification_score, qualification_category,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                lead_data.get('name'),
                lead_data.get('email'),
                lead_data.get('company'),
                lead_data.get('service_type'),
                lead_data.get('budget'),
                lead_data.get('timeline'),
                qualification['score'],
                qualification['category'],
                datetime.now().isoformat()
            ))

            conn.commit()
            lead_id = cursor.lastrowid
            conn.close()

            logger.info(f"Lead stored: {lead_id}")
            return {'success': True, 'id': lead_id}

        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            return {'success': False, 'error': str(e)}


class LeadExporter:
    """Export leads to various formats"""

    @staticmethod
    def export_to_csv(filename: str = 'leads_export.csv') -> str:
        """Export all leads to CSV"""
        import sqlite3
        import csv

        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM leads')
        leads = cursor.fetchall()

        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['ID', 'Name', 'Email', 'Company', 'Service', 'Budget', 'Score', 'Category', 'Date'])
            writer.writerows(leads)

        conn.close()
        return filename

    @staticmethod
    def export_to_json(filename: str = 'leads_export.json') -> str:
        """Export all leads to JSON"""
        import sqlite3

        conn = sqlite3.connect('analytics.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM leads')
        leads = [dict(row) for row in cursor.fetchall()]

        with open(filename, 'w') as f:
            json.dump(leads, f, indent=2)

        conn.close()
        return filename
