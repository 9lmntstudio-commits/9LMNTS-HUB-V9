"""
9LMNTS STUDIO - AI Agents Package
Master package for all AI automation agents
"""

__version__ = "1.0.0"
__author__ = "9LMNTS Studio"
__description__ = "AI-powered automation agents for revenue generation"

# Import all agents for easy access
from .social_media_agent import SocialMediaAgent
from .design_automation_agent import DesignAutomationAgent
from .calendar_integration import CalendarIntegrationAgent
from .agent_integration import AgentIntegrationHub
from .google_drive_agent import GoogleDriveAgent
from .google_sheets_agent import GoogleSheetsAgent
from .gmail_agent import GmailAgent
from .openai_agent import OpenAIAgent
from .gemini_agent import GeminiAgent
from .figma_agent import FigmaAgent
from .notion_agent import NotionAgent
from .twilio_agent import TwilioAgent
from .manychat_agent import ManyChatAgent
from .alternative_agents import AlternativeAgentController

# Export all agents
__all__ = [
    'SocialMediaAgent',
    'DesignAutomationAgent', 
    'CalendarIntegrationAgent',
    'AgentIntegrationHub',
    'GoogleDriveAgent',
    'GoogleSheetsAgent',
    'GmailAgent',
    'OpenAIAgent',
    'GeminiAgent',
    'FigmaAgent',
    'NotionAgent',
    'TwilioAgent',
    'ManyChatAgent',
    'AlternativeAgentController'
]

# Agent registry for easy management
AGENT_REGISTRY = {
    'social_media': SocialMediaAgent,
    'design_automation': DesignAutomationAgent,
    'calendar_integration': CalendarIntegrationAgent,
    'integration_hub': AgentIntegrationHub,
    'google_drive': GoogleDriveAgent,
    'google_sheets': GoogleSheetsAgent,
    'gmail': GmailAgent,
    'openai': OpenAIAgent,
    'gemini': GeminiAgent,
    'figma': FigmaAgent,
    'notion': NotionAgent,
    'twilio': TwilioAgent,
    'manychat': ManyChatAgent,
    'alternative_controller': AlternativeAgentController
}

def get_agent(agent_name: str):
    """Get agent instance by name"""
    agent_class = AGENT_REGISTRY.get(agent_name)
    if agent_class:
        return agent_class()
    else:
        raise ValueError(f"Agent '{agent_name}' not found. Available agents: {list(AGENT_REGISTRY.keys())}")

def list_agents():
    """List all available agents"""
    return list(AGENT_REGISTRY.keys())

def initialize_all_agents():
    """Initialize all agents for system startup"""
    agents = {}
    for name, agent_class in AGENT_REGISTRY.items():
        try:
            agents[name] = agent_class()
            print(f"✅ {name.replace('_', ' ').title()} agent initialized")
        except Exception as e:
            print(f"❌ Failed to initialize {name} agent: {e}")
    
    return agents
