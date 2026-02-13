"""
📝 Centralized Logging
Standardized logging configuration for the automation system
"""

import logging
import os
from datetime import datetime
from pathlib import Path

class AutomationLogger:
    """Centralized logging configuration"""
    
    def __init__(self, name: str = "automation"):
        self.logger = logging.getLogger(name)
        self.setup_logging()
    
    def setup_logging(self):
        """Setup logging configuration"""
        # Create logs directory
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        # Configure logging level
        log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
        self.logger.setLevel(getattr(logging, log_level))
        
        # Clear existing handlers
        self.logger.handlers.clear()
        
        # File handler
        log_file = log_dir / f"automation_{datetime.now().strftime('%Y%m%d')}.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def info(self, message: str, **kwargs):
        """Log info message"""
        self.logger.info(message, **kwargs)
    
    def error(self, message: str, **kwargs):
        """Log error message"""
        self.logger.error(message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning message"""
        self.logger.warning(message, **kwargs)
    
    def debug(self, message: str, **kwargs):
        """Log debug message"""
        self.logger.debug(message, **kwargs)
    
    def api_call(self, service: str, endpoint: str, status: str = "success", **kwargs):
        """Log API call"""
        self.info(f"API Call - Service: {service}, Endpoint: {endpoint}, Status: {status}", **kwargs)
    
    def security_event(self, event: str, details: str = "", **kwargs):
        """Log security events"""
        self.warning(f"SECURITY EVENT - {event}: {details}", **kwargs)

# Global logger instance
logger = AutomationLogger()
