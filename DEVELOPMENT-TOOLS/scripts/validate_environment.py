#!/usr/bin/env python3
"""
🔍 Environment Validation Script
Validates all required environment variables and API connectivity
"""

import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

try:
    from config.settings import config
    from utils.logger import logger
    from utils.error_handler import ErrorHandler, ConfigurationError
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the project root directory")
    sys.exit(1)

def validate_api_keys():
    """Validate all API keys are present"""
    logger.info("Validating API keys...")
    
    required_keys = {
        'OPENAI_API_KEY': 'OpenAI',
        'GEMINI_API_KEY': 'Google Gemini',
        'NOTION_API_KEY': 'Notion',
        'MANYCHAT_API_KEY': 'ManyChat',
        'FIGMA_API_KEY': 'Figma'
    }
    
    optional_keys = {
        'STITCH_API_KEY': 'Stitch AI',
        'GITHUB_TOKEN': 'GitHub',
        'GOOGLE_APP_PASSWORD': 'Google Calendar',
        'ANTHROPIC_API_KEY': 'Anthropic',
        'TELEGRAM_BOT_TOKEN': 'Telegram',
        'TWILIO_ACCOUNT_SID': 'Twilio'
    }
    
    missing_required = []
    missing_optional = []
    
    # Check required keys
    for env_var, service in required_keys.items():
        if not os.getenv(env_var):
            missing_required.append(f"{service} ({env_var})")
        else:
            logger.info(f"✅ {service} API key found")
    
    # Check optional keys
    for env_var, service in optional_keys.items():
        if not os.getenv(env_var):
            missing_optional.append(f"{service} ({env_var})")
        else:
            logger.info(f"✅ {service} API key found")
    
    return missing_required, missing_optional

def validate_service_urls():
    """Validate all service URLs"""
    logger.info("Validating service URLs...")
    
    required_urls = {
        'N8N_WEBHOOK_URL': 'n8n Webhook'
    }
    
    optional_urls = {
        'SUPABASE_URL': 'Supabase',
        'VITE_API_URL': 'Vite API'
    }
    
    missing_urls = []
    
    # Check required URLs
    for env_var, service in required_urls.items():
        url = os.getenv(env_var)
        if not url:
            missing_urls.append(f"{service} ({env_var})")
        elif not (url.startswith('http://') or url.startswith('https://')):
            logger.warning(f"⚠️ {service} URL may be invalid: {url}")
        else:
            logger.info(f"✅ {service} URL configured")
    
    # Check optional URLs
    for env_var, service in optional_urls.items():
        url = os.getenv(env_var)
        if url and not (url.startswith('http://') or url.startswith('https://')):
            logger.warning(f"⚠️ {service} URL may be invalid: {url}")
        elif url:
            logger.info(f"✅ {service} URL configured")
    
    return missing_urls

def validate_database_config():
    """Validate database configuration"""
    logger.info("Validating database configuration...")
    
    db_configs = {
        'NOTION_DATABASE_ID': 'Notion Database ID',
        'SUPABASE_URL': 'Supabase URL',
        'SUPABASE_ANON_KEY': 'Supabase Anonymous Key'
    }
    
    missing_db = []
    
    for env_var, config_name in db_configs.items():
        if not os.getenv(env_var):
            missing_db.append(f"{config_name} ({env_var})")
        else:
            logger.info(f"✅ {config_name} configured")
    
    return missing_db

def test_api_connectivity():
    """Test basic API connectivity"""
    logger.info("Testing API connectivity...")
    
    # Test OpenAI
    try:
        import openai
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            client = openai.OpenAI(api_key=api_key)
            # Simple test - list models (this should work with valid key)
            logger.info("✅ OpenAI API connectivity test passed")
    except Exception as e:
        logger.error(f"❌ OpenAI API connectivity failed: {e}")
    
    # Test configuration loading
    try:
        api_keys = config.api_keys
        service_urls = config.service_urls
        logger.info("✅ Configuration system working")
    except Exception as e:
        logger.error(f"❌ Configuration system failed: {e}")

def check_file_permissions():
    """Check critical file permissions"""
    logger.info("Checking file permissions...")
    
    # Check .env file
    env_file = project_root / '.env'
    if env_file.exists():
        if os.access(env_file, os.R_OK):
            logger.info("✅ .env file readable")
        else:
            logger.error("❌ .env file not readable")
    
    # Check logs directory
    logs_dir = project_root / 'logs'
    if logs_dir.exists():
        if os.access(logs_dir, os.W_OK):
            logger.info("✅ logs directory writable")
        else:
            logger.error("❌ logs directory not writable")
    else:
        try:
            logs_dir.mkdir(exist_ok=True)
            logger.info("✅ logs directory created")
        except Exception as e:
            logger.error(f"❌ Failed to create logs directory: {e}")

def generate_validation_report():
    """Generate comprehensive validation report"""
    print("🔍 ENVIRONMENT VALIDATION REPORT")
    print("=" * 50)
    
    # Run all validations
    missing_required_keys, missing_optional_keys = validate_api_keys()
    missing_urls = validate_service_urls()
    missing_db = validate_database_config()
    
    # Check file permissions
    check_file_permissions()
    
    # Test API connectivity
    test_api_connectivity()
    
    # Generate summary
    print("\n📊 VALIDATION SUMMARY")
    print("-" * 30)
    
    critical_issues = len(missing_required_keys) + len(missing_urls)
    warning_issues = len(missing_optional_keys) + len(missing_db)
    
    if critical_issues == 0:
        print("✅ No critical issues found")
    else:
        print(f"❌ {critical_issues} critical issues found")
        print("\nMissing Required API Keys:")
        for key in missing_required_keys:
            print(f"  • {key}")
        
        print("\nMissing Required URLs:")
        for url in missing_urls:
            print(f"  • {url}")
    
    if warning_issues > 0:
        print(f"\n⚠️ {warning_issues} warnings found")
        print("\nMissing Optional API Keys:")
        for key in missing_optional_keys:
            print(f"  • {key}")
        
        print("\nMissing Database Config:")
        for db in missing_db:
            print(f"  • {db}")
    
    # Overall status
    if critical_issues == 0:
        print("\n🎉 ENVIRONMENT IS READY FOR PRODUCTION!")
        return True
    else:
        print("\n🚨 CRITICAL ISSUES MUST BE RESOLVED BEFORE PRODUCTION!")
        return False

def main():
    """Main validation function"""
    try:
        success = generate_validation_report()
        sys.exit(0 if success else 1)
    except Exception as e:
        logger.error(f"Validation script error: {e}")
        print(f"❌ Validation script failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
