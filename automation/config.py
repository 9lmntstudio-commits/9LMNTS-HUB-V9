"""
🔧 Configuration Management - 9LMNTS Studio
Centralized configuration for all automation systems
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ========== ENVIRONMENT ==========
ENV = os.getenv('ENV', 'development')
DEBUG = ENV == 'development'

# ========== API KEYS ==========
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
NOTION_API_KEY = os.getenv('NOTION_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# ========== WEBHOOK URLS ==========
N8N_WEBHOOK_URL = os.getenv(
    'N8N_WEBHOOK_URL',
    'https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads'
)
RAILWAY_API_URL = os.getenv(
    'RAILWAY_API_URL',
    'https://darnley-sanons-projects-production.up.railway.app'
)

# ========== PAYMENT LINKS ==========
PAYPAL_LINKS = {
    'AI Brand Voice': 'https://PayPal.Me/9LMNTSSTUDIO/2000',
    'Web Design': 'https://PayPal.Me/9LMNTSSTUDIO/1500',
    'EventOS': 'https://PayPal.Me/9LMNTSSTUDIO/1000',
    'AI Business Automation': 'https://PayPal.Me/9LMNTSSTUDIO/3000',
    'Deposit': 'https://PayPal.Me/9LMNTSSTUDIO/500',
}

# ========== SERVICE PRICES ==========
SERVICE_PRICES = {
    'AI Brand Voice': 2000,
    'Web Design': 1500,
    'EventOS': 1000,
    'AI Business Automation': 3000,
}

# ========== DATABASE ==========
DATABASE_PATH = os.getenv('DATABASE_PATH', 'analytics.db')

# ========== LOGGING ==========
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FILE = 'logs/automation.log'

# ========== QUALIFICATION THRESHOLDS ==========
QUALIFICATION_THRESHOLDS = {
    'hot': 80,      # Score >= 80
    'warm': 60,     # Score 60-79
    'cold': 0,      # Score < 60
}

# ========== EMAIL SETTINGS ==========
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'leads@9lmntsstudio.com')

# ========== GOOGLE SERVICES ==========
GOOGLE_CALENDAR_ID = os.getenv('GOOGLE_CALENDAR_ID')
GOOGLE_DRIVE_FOLDER_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID')

# ========== BUSINESS INFO ==========
COMPANY_NAME = '9LMNTS Studio'
COMPANY_EMAIL = 'hello@9lmntsstudio.com'
COMPANY_PHONE = '+1-555-9LMNTS'
COMPANY_WEBSITE = 'https://9lmntsstudio.com'

# ========== FEATURES FLAGS ==========
FEATURES = {
    'email_notifications': True,
    'calendar_integration': True,
    'google_drive_integration': True,
    'notion_tracking': True,
    'paypal_links': True,
    'ai_qualification': True,
}

def get_config(key: str, default=None):
    """Get configuration value by key"""
    return globals().get(key, default)

def validate_config():
    """Validate that all required configs are set"""
    required = [
        'OPENAI_API_KEY',
        'N8N_WEBHOOK_URL',
    ]

    missing = [key for key in required if not get_config(key)]

    if missing:
        print(f"⚠️  Missing configuration: {', '.join(missing)}")
        return False

    return True
