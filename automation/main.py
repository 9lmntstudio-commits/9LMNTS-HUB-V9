"""
🚀 Main Automation Entry Point - 9LMNTS Studio
Run this file to start the complete automation system
"""

import logging
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Import configuration and handlers
from automation.config import validate_config
from automation.handlers.lead_processor import LeadProcessor, LeadExporter
from automation.handlers.notifications import NotificationManager
import automation.config as config


class AutomationSystem:
    """Main automation system orchestrator"""

    def __init__(self):
        """Initialize automation system"""
        self.config = config

        if not validate_config():
            logger.warning("Configuration validation failed - some features may not work")

        self.lead_processor = LeadProcessor(self.config)
        self.notifications = NotificationManager(self.config)

        logger.info("🚀 9LMNTS Studio Automation System initialized")

    def process_webhook(self, lead_data: dict) -> dict:
        """
        Process webhook from website form

        Args:
            lead_data: Lead information from form

        Returns:
            Processing result
        """
        logger.info(f"📥 Webhook received: {lead_data.get('name')}")

        # Process the lead
        result = self.lead_processor.process_lead(lead_data)

        if result['success']:
            # Send confirmation to lead
            self.notifications.send_lead_confirmation(lead_data)

            # Notify admins
            self.notifications.send_admin_notification(
                lead_data,
                result['qualification']
            )

            logger.info(f"✅ Lead processed successfully: {result['lead_id']}")
        else:
            logger.error(f"❌ Lead processing failed: {result.get('error')}")

        return result

    def start_server(self, port: int = 5000):
        """Start Flask webhook server"""
        from flask import Flask, request, jsonify

        app = Flask(__name__)

        @app.route('/webhook/leads', methods=['POST'])
        def webhook_handler():
            try:
                lead_data = request.json
                result = self.process_webhook(lead_data)
                return jsonify(result), 200 if result['success'] else 400
            except Exception as e:
                logger.error(f"Webhook error: {str(e)}")
                return jsonify({'success': False, 'error': str(e)}), 500

        @app.route('/export/csv', methods=['GET'])
        def export_csv():
            try:
                filename = LeadExporter.export_to_csv()
                with open(filename, 'rb') as f:
                    return f.read(), 200
            except Exception as e:
                return jsonify({'error': str(e)}), 500

        @app.route('/health', methods=['GET'])
        def health():
            return jsonify({'status': 'healthy'}), 200

        logger.info(f"🚀 Starting webhook server on port {port}")
        app.run(host='0.0.0.0', port=port, debug=self.config.DEBUG)

    def run_test(self):
        """Run test with sample lead"""
        test_lead = {
            'name': 'Test Client',
            'email': 'test@9lmntsstudio.com',
            'company': 'Test Company',
            'service_type': 'AI Business Automation',
            'budget': '5000',
            'timeline': '2 weeks',
            'phone': '+1-555-TEST',
            'description': 'Test automation workflow'
        }

        logger.info("🧪 Running test automation workflow...")
        result = self.process_webhook(test_lead)

        if result['success']:
            logger.info("✅ Test successful!")
            logger.info(f"   Lead ID: {result['lead_id']}")
            logger.info(f"   Score: {result['qualification']['score']}/100")
            logger.info(f"   Category: {result['qualification']['category']}")
            logger.info(f"   Payment Link: {result['payment_link']}")
        else:
            logger.error(f"❌ Test failed: {result.get('error')}")


def main():
    """Main entry point"""
    print("\n" + "=" * 70)
    print("🚀 9LMNTS STUDIO - AUTOMATION SYSTEM")
    print("=" * 70 + "\n")

    # Initialize automation
    automation = AutomationSystem()

    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == 'test':
            automation.run_test()

        elif command == 'server':
            port = int(sys.argv[2]) if len(sys.argv) > 2 else 5000
            automation.start_server(port)

        elif command == 'export-csv':
            filename = LeadExporter.export_to_csv()
            print(f"✅ Exported to {filename}")

        elif command == 'export-json':
            filename = LeadExporter.export_to_json()
            print(f"✅ Exported to {filename}")

        else:
            print("Invalid command")
            print("\nUsage:")
            print("  python main.py test              - Run test")
            print("  python main.py server [port]     - Start webhook server")
            print("  python main.py export-csv        - Export leads to CSV")
            print("  python main.py export-json       - Export leads to JSON")
    else:
        # Default: run test
        automation.run_test()

    print("\n" + "=" * 70 + "\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Automation stopped by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        sys.exit(1)
