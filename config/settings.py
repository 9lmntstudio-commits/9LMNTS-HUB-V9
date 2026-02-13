"""
🔧 Configuration Management
Centralized configuration with environment variable loading and validation
"""

import os
import logging
from typing import Dict, Any, Optional
from pathlib import Path

class Config:
    """Centralized configuration management"""
    
    def __init__(self):
        self.load_environment()
        self.validate_required_vars()
    
    def load_environment(self):
        """Load environment variables from .env file"""
        try:
            from dotenv import load_dotenv
            load_dotenv()
        except ImportError:
            # Fallback if python-dotenv not available
            env_path = Path(__file__).parent.parent / '.env'
            if env_path.exists():
                with open(env_path, 'r') as f:
                    for line in f:
                        if '=' in line and not line.strip().startswith('#'):
                            key, value = line.strip().split('=', 1)
                            os.environ[key.strip()] = value.strip()
    
    def get_required_env(self, key: str, default: Optional[str] = None) -> str:
        """Get required environment variable"""
        value = os.getenv(key, default)
        if not value:
            raise ValueError(f"Required environment variable {key} is missing")
        return value
    
    def get_optional_env(self, key: str, default: str = "") -> str:
        """Get optional environment variable"""
        return os.getenv(key, default)
    
    def validate_required_vars(self):
        """Validate all required environment variables"""
        required_vars = [
            'OPENAI_API_KEY',
            'GEMINI_API_KEY', 
            'NOTION_API_KEY',
            'MANYCHAT_API_KEY',
            'FIGMA_API_KEY',
            'N8N_WEBHOOK_URL'
        ]
        
        missing_vars = []
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            error_msg = f"Missing required environment variables: {', '.join(missing_vars)}"
            logging.error(error_msg)
            raise ValueError(error_msg)
        
        logging.info("All required environment variables validated")
    
    @property
    def api_keys(self) -> Dict[str, str]:
        """Get all API keys"""
        return {
            'openai': self.get_required_env('OPENAI_API_KEY'),
            'gemini': self.get_required_env('GEMINI_API_KEY'),
            'notion': self.get_required_env('NOTION_API_KEY'),
            'manychat': self.get_required_env('MANYCHAT_API_KEY'),
            'figma': self.get_required_env('FIGMA_API_KEY'),
            'stitch_ai': self.get_optional_env('STITCH_API_KEY'),
            'github': self.get_optional_env('GITHUB_TOKEN'),
            'google_app_password': self.get_optional_env('GOOGLE_APP_PASSWORD')
        }
    
    @property
    def service_urls(self) -> Dict[str, str]:
        """Get all service URLs"""
        return {
            'n8n_webhook': self.get_required_env('N8N_WEBHOOK_URL'),
            'supabase_url': self.get_optional_env('SUPABASE_URL'),
            'vite_api_url': self.get_optional_env('VITE_API_URL', 'http://localhost:8000')
        }
    
    @property
    def database_config(self) -> Dict[str, str]:
        """Get database configuration"""
        return {
            'notion_database_id': self.get_optional_env('NOTION_DATABASE_ID'),
            'supabase_url': self.get_optional_env('SUPABASE_URL'),
            'supabase_anon_key': self.get_optional_env('SUPABASE_ANON_KEY')
        }
    
    def get_api_status(self) -> Dict[str, str]:
        """Get API status based on configuration"""
        return {
            'openai': 'configured' if self.get_optional_env('OPENAI_API_KEY') else 'missing',
            'notion': 'configured' if self.get_optional_env('NOTION_API_KEY') else 'missing',
            'manychat': 'configured' if self.get_optional_env('MANYCHAT_API_KEY') else 'missing',
            'gemini': 'configured' if self.get_optional_env('GEMINI_API_KEY') else 'missing',
            'figma': 'configured' if self.get_optional_env('FIGMA_API_KEY') else 'missing',
            'stitch_ai': 'configured' if self.get_optional_env('STITCH_API_KEY') else 'missing',
            'github': 'configured' if self.get_optional_env('GITHUB_TOKEN') else 'missing',
            'google_app_password': 'configured' if self.get_optional_env('GOOGLE_APP_PASSWORD') else 'missing'
        }

# Global configuration instance
config = Config()
