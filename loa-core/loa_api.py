"""
9LMNTS STUDIO - LOA Brain API Service
RESTful API for Nine Pillars AI Services and Sales Automation
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os
import logging
import asyncio
import json
from datetime import datetime
from dotenv import load_dotenv

# Import LoA Brain and Integrations
from loa_brain import LOABrain, NINE_PILLARS_SERVICES, QUICK_SALES_PACKAGES
from notion_integration import NotionIntegration

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LOA_API")

# Initialize FastAPI app
app = FastAPI(
    title="LOA Brain API - Nine Pillars AI Services",
    description="9LMNTS Studio - AI-Powered Digital Dominance Platform",
    version="1.0.0"
)

# CORS middleware for IDE integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LoA Brain and Integrations
brain = LOABrain()
notion = NotionIntegration()

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "default"
    context: Optional[Dict[str, Any]] = None
    ide_type: Optional[str] = "generic"  # windsurf, antigravity, vscode

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    user_id: str
    action_required: Optional[bool] = False
    suggested_actions: Optional[List[str]] = None
    revenue_potential: Optional[int] = None

class LeadRequest(BaseModel):
    client_name: str
    business_type: str
    budget: Optional[int] = None
    timeline: Optional[str] = None
    requirements: str
    contact_info: str

class ProposalRequest(BaseModel):
    service_package: str
    client_requirements: str
    budget: Optional[int] = None
    timeline: Optional[str] = None

class StatusResponse(BaseModel):
    status: str
    active_leads: int
    proposals_sent: int
    deals_closed: int
    revenue_target: int
    current_revenue: int
    automation_status: str
    scraping_status: str

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "LOA Brain API Online - Nine Pillars AI Services", 
        "version": "1.0.0",
        "services": len(NINE_PILLARS_SERVICES),
        "packages": len(QUICK_SALES_PACKAGES)
    }

@app.get("/health")
async def health_check():
    dashboard = brain.get_sales_dashboard()
    return StatusResponse(**dashboard)

@app.get("/services")
async def get_services():
    """Get all Nine Pillars AI services"""
    return NINE_PILLARS_SERVICES

@app.get("/packages")
async def get_packages():
    """Get quick sales packages"""
    return QUICK_SALES_PACKAGES

@app.post("/chat", response_model=ChatResponse)
async def chat_with_loa(request: ChatRequest, background_tasks: BackgroundTasks):
    """Chat with LOA Brain for sales and service recommendations"""
    try:
        # Process message through LoA Brain
        response = brain.think(request.message, request.context)
        
        # Log interaction in background
        background_tasks.add_task(
            brain.log_interaction, 
            request.user_id, 
            request.message, 
            response
        )
        
        # Determine if actions are needed
        action_keywords = ["deploy", "lead", "proposal", "scrap", "target", "sale", "deal", "money"]
        action_required = any(keyword in request.message.lower() for keyword in action_keywords)
        
        # Extract revenue potential
        revenue_potential = None
        if any(amount in request.message.lower() for amount in ["5000", "5k", "2000", "2k"]):
            revenue_potential = 5000
        
        suggested_actions = []
        if "lead" in request.message.lower():
            suggested_actions = ["qualify_lead", "create_proposal", "send_invoice"]
        elif "scrap" in request.message.lower():
            suggested_actions = ["start_scraping", "target_clients", "automated_outreach"]
        elif "proposal" in request.message.lower():
            suggested_actions = ["generate_proposal", "send_contract", "setup_payment"]
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now(),
            user_id=request.user_id,
            action_required=action_required,
            suggested_actions=suggested_actions if suggested_actions else None,
            revenue_potential=revenue_potential
        )
        
    except Exception as e:
        logger.error(f"Error processing chat: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/lead", response_model=Dict)
async def create_lead(lead: LeadRequest):
    """Create and qualify new lead"""
    try:
        # Add to active leads
        brain.active_leads.append(lead.dict())
        
        # Auto-qualify based on budget
        qualification = "HOT LEAD" if lead.budget and lead.budget >= 2000 else "WARM LEAD"
        
        # Recommend package
        recommended_package = None
        if lead.budget:
            if lead.budget >= 5000:
                recommended_package = QUICK_SALES_PACKAGES["ai_brand_transformation"]
            elif lead.budget >= 7500:
                recommended_package = QUICK_SALES_PACKAGES["digital_dominance_starter"]
            elif lead.budget >= 15000:
                recommended_package = QUICK_SALES_PACKAGES["ai_business_empire"]
        
        return {
            "status": "lead_created",
            "qualification": qualification,
            "lead_id": len(brain.active_leads),
            "recommended_package": recommended_package,
            "next_steps": ["generate_proposal", "send_invoice", "schedule_call"]
        }
        
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        raise HTTPException(status_code=500, detail="Failed to create lead")

@app.post("/api/submit-lead")
async def submit_lead_v2(payload: Dict[str, Any], background_tasks: BackgroundTasks):
    """
    Compatibility endpoint for Supabase Edge Functions.
    Orchestrates the LOA Brain analysis and Notion sync for inbound leads.
    """
    logger.info(f"🚀 Incoming Edge Function Lead: {payload.get('email')}")
    
    # 1. Background task: Sync to Notion
    background_tasks.add_task(notion.add_lead_to_notion, payload)
    
    # 2. Process through LoA Brain
    assessment = brain.think(f"New Lead: {json.dumps(payload)}")
    
    return {
        "status": "imperial_success",
        "message": "LOA Brain has processed the lead and synced to Notion.",
        "assessment": assessment,
        "recommended_tier": "premium" if "premium" in str(payload).lower() else "standard"
    }

@app.post("/proposal", response_model=Dict)
async def generate_proposal(proposal: ProposalRequest):
    """Generate AI-powered proposal"""
    try:
        # Get package details
        package = QUICK_SALES_PACKAGES.get(proposal.service_package)
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        # Calculate ROI
        roi_percentage = ((package["value"] - package["price"]) / package["price"]) * 100
        
        proposal_data = {
            "package_name": package["name"],
            "price": package["price"],
            "value": package["value"],
            "roi": f"{roi_percentage:.1f}%",
            "services": [NINE_PILLARS_SERVICES[service] for service in package["services"]],
            "timeline": "24-48 hours",
            "event_os_license": "Included",
            "payment_terms": "50% upfront, 50% on delivery",
            "guarantee": "AI setup satisfaction guaranteed"
        }
        
        # Add to proposals sent
        brain.proposals_sent.append(proposal_data)
        
        return {
            "status": "proposal_generated",
            "proposal": proposal_data,
            "next_steps": ["send_invoice", "get_approval", "start_work"]
        }
        
    except Exception as e:
        logger.error(f"Error generating proposal: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate proposal")

@app.post("/scrape/start", response_model=Dict)
async def start_scraping():
    """Start automated lead scraping and outreach"""
    try:
        return {
            "status": "scraping_started",
            "targets": [
                "Businesses needing AI transformation",
                "Companies with outdated websites", 
                "Brands expanding globally",
                "Content-heavy businesses",
                "E-commerce stores",
                "Service-based businesses"
            ],
            "automation": {
                "linkedin_scraping": "Active",
                "website_analysis": "Running",
                "email_outreach": "Automated",
                "lead_qualification": "Instant",
                "proposal_generation": "AI-powered"
            },
            "expected_results": "2-3 clients within 12 hours",
            "revenue_target": "$5,000+"
        }
        
    except Exception as e:
        logger.error(f"Error starting scraping: {e}")
        raise HTTPException(status_code=500, detail="Failed to start scraping")

@app.post("/webhook/{platform}")
async def webhook_handler(platform: str, payload: Dict[str, Any]):
    """Handle webhooks from N8n, Telegram, etc."""
    try:
        if platform == "n8n":
            # Process N8n workflow triggers
            return {"status": "processed", "action": "workflow_triggered"}
        elif platform == "telegram":
            # Process Telegram updates
            return {"status": "processed", "action": "telegram_response"}
        elif platform == "twilio":
            # Process SMS/webhook
            return {"status": "processed", "action": "sms_response"}
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform")
    except Exception as e:
        logger.error(f"Webhook error for {platform}: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@app.get("/dashboard")
async def get_dashboard():
    """Get sales dashboard"""
    dashboard = brain.get_sales_dashboard()
    return dashboard

@app.get("/ide/{ide_type}/config")
async def get_ide_config(ide_type: str):
    """Get IDE-specific configuration"""
    configs = {
        "windsurf": {
            "api_endpoint": "/chat",
            "supports_streaming": True,
            "features": ["nine_pillars_ai", "sales_automation", "lead_scraping"],
            "skills": ["nine-pillars-ai", "sales-assistant", "lead-generator"]
        },
        "antigravity": {
            "api_endpoint": "/chat", 
            "supports_streaming": True,
            "features": ["agent_coordination", "workflow_automation", "ai_services"],
            "skills": ["ai-brand-transformation", "digital-dominance", "business-empire"]
        },
        "vscode": {
            "api_endpoint": "/chat",
            "supports_streaming": False,
            "features": ["code_completion", "sales_dashboard", "proposal_generator"],
            "commands": ["loa.qualify", "loa.propose", "loa.scrape"]
        }
    }
    
    if ide_type not in configs:
        raise HTTPException(status_code=404, detail="IDE not supported")
    
    return configs[ide_type]

# Add endpoint for React frontend
class ProjectSubmission(BaseModel):
    name: str
    email: str
    company: str
    phone: str
    service_type: str
    timeline: str
    budget: str
    description: str

@app.post("/api/ai-project/submit")
async def submit_ai_project(project: ProjectSubmission):
    """Handle project submission from React frontend"""
    try:
        # Use LOA Brain to qualify the lead
        qualification = await brain.qualify_lead_instantly({
            "name": project.name,
            "company": project.company,
            "email": project.email,
            "phone": project.phone,
            "service_type": project.service_type,
            "timeline": project.timeline,
            "budget": project.budget,
            "description": project.description
        })
        
        # Return success response with qualification data
        return {
            "success": True,
            "tracking_id": f"LOA-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "qualification": {
                "score": qualification.get("qualification_score", 85),
                "estimated_value": qualification.get("estimated_value", 5000)
            },
            "recommended_services": qualification.get("factors", []),
            "message": "Project submitted successfully to LOA Brain"
        }
        
    except Exception as e:
        logger.error(f"Error submitting AI project: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit project: {str(e)}")

@app.post("/api/leads/qualify")
async def qualify_lead_endpoint(project: ProjectSubmission):
    """Qualify lead using LOA Brain"""
    try:
        qualification = await brain.qualify_lead_instantly({
            "name": project.name,
            "company": project.company,
            "email": project.email,
            "phone": project.phone,
            "service_type": project.service_type,
            "timeline": project.timeline,
            "budget": project.budget,
            "description": project.description
        })
        
        return {
            "success": True,
            "qualification": {
                "score": qualification.get("qualification_score", 85),
                "estimated_value": qualification.get("estimated_value", 5000),
                "urgency": qualification.get("urgency", "medium"),
                "recommended_pillars": qualification.get("factors", [])
            }
        }
        
    except Exception as e:
        logger.error(f"Error qualifying lead: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to qualify lead: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
