"""
🛠️ Standardized Error Handling
Centralized error handling and response formatting
"""

import logging
import traceback
from typing import Dict, Any, Optional
from datetime import datetime

class AutomationError(Exception):
    """Base exception for automation system"""
    def __init__(self, message: str, error_code: str = None, details: Dict[str, Any] = None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        self.timestamp = datetime.now().isoformat()

class APIError(AutomationError):
    """API-related errors"""
    def __init__(self, message: str, service: str = None, status_code: int = None, **kwargs):
        super().__init__(message, **kwargs)
        self.service = service
        self.status_code = status_code

class ConfigurationError(AutomationError):
    """Configuration-related errors"""
    pass

class DatabaseError(AutomationError):
    """Database-related errors"""
    pass

class ValidationError(AutomationError):
    """Validation-related errors"""
    pass

class ErrorHandler:
    """Centralized error handling"""
    
    @staticmethod
    def handle_exception(func):
        """Decorator for handling exceptions"""
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except AutomationError as e:
                logging.error(f"Automation Error in {func.__name__}: {e.message}")
                return ErrorHandler.format_error(e, 'automation_error')
            except APIError as e:
                logging.error(f"API Error in {func.__name__}: {e.message}")
                return ErrorHandler.format_error(e, 'api_error')
            except ConfigurationError as e:
                logging.error(f"Configuration Error in {func.__name__}: {e.message}")
                return ErrorHandler.format_error(e, 'configuration_error')
            except ValueError as e:
                logging.error(f"Value Error in {func.__name__}: {str(e)}")
                return ErrorHandler.format_error(e, 'value_error')
            except ConnectionError as e:
                logging.error(f"Connection Error in {func.__name__}: {str(e)}")
                return ErrorHandler.format_error(e, 'connection_error')
            except TimeoutError as e:
                logging.error(f"Timeout Error in {func.__name__}: {str(e)}")
                return ErrorHandler.format_error(e, 'timeout_error')
            except Exception as e:
                logging.error(f"Unexpected Error in {func.__name__}: {str(e)}")
                logging.error(traceback.format_exc())
                return ErrorHandler.format_error(e, 'unexpected_error')
        return wrapper
    
    @staticmethod
    def format_error(error: Exception, error_type: str) -> Dict[str, Any]:
        """Format error response consistently"""
        if isinstance(error, AutomationError):
            return {
                'success': False,
                'error_type': error_type,
                'error_code': getattr(error, 'error_code', None),
                'message': error.message,
                'details': getattr(error, 'details', {}),
                'timestamp': getattr(error, 'timestamp', datetime.now().isoformat()),
                'service': getattr(error, 'service', None),
                'status_code': getattr(error, 'status_code', None)
            }
        else:
            return {
                'success': False,
                'error_type': error_type,
                'message': str(error),
                'timestamp': datetime.now().isoformat()
            }
    
    @staticmethod
    def create_success_response(data: Any = None, message: str = "Operation successful") -> Dict[str, Any]:
        """Create standardized success response"""
        return {
            'success': True,
            'data': data,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
    
    @staticmethod
    def log_api_call(service: str, endpoint: str, method: str = "POST", status: str = "success"):
        """Log API calls for monitoring"""
        logging.info(f"API Call - Service: {service}, Endpoint: {endpoint}, Method: {method}, Status: {status}")

def safe_execute(func, *args, **kwargs):
    """Safely execute function with error handling"""
    try:
        return ErrorHandler.create_success_response(func(*args, **kwargs))
    except Exception as e:
        return ErrorHandler.format_error(e, 'execution_error')
