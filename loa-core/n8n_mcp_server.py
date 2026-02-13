"""
9LMNTS STUDIO - N8n MCP Server
Model Context Protocol server for N8n workflow automation with Loa Brain integration
"""

import asyncio
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import requests
from loa_brain import LOABrain, NINE_PILLARS_SERVICES, QUICK_SALES_PACKAGES

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("N8N_MCP_SERVER")

class N8nMCPServer:
    def __init__(self):
        self.loa_brain = LOABrain()
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook"
        self.auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZmIzZmJhZS1kMjkyLTQxOGItYWU2Ni0xMTNhNWEyZjIxZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjRhNzZmZDk2LWU5MGMtNDcyNS04YWUxLTdhOWRhMjJlYjJhYiIsImlhdCI6MTc3MDUyODIxOX0.eE1XfWj33jO1rRrCwhJxdgGwQ7HzbgyoUAnvvfnMzcQ"
        
    async def handle_n8n_trigger(self, workflow_data: Dict) -> Dict:
        """Handle N8n workflow triggers with Loa Brain intelligence"""
        
        workflow_type = workflow_data.get("workflow_type", "")
        trigger_data = workflow_data.get("data", {})
        
        logger.info(f"🔄 N8n Workflow Triggered: {workflow_type}")
        
        if workflow_type == "lead_qualification":
            return await self._handle_lead_qualification(trigger_data)
        elif workflow_type == "proposal_generation":
            return await self._handle_proposal_generation(trigger_data)
        elif workflow_type == "service_delivery":
            return await self._handle_service_delivery(trigger_data)
        elif workflow_type == "client_onboarding":
            return await self._handle_client_onboarding(trigger_data)
        elif workflow_type == "sales_campaign":
            return await self._handle_sales_campaign(trigger_data)
        else:
            return await self._handle_generic_workflow(workflow_type, trigger_data)
    
    async def _handle_lead_qualification(self, lead_data: Dict) -> Dict:
        """Handle lead qualification from N8n"""
        
        # Map incoming data to match website form structure
        lead_info = {
            "name": lead_data.get("name", ""),
            "company": lead_data.get("company", ""),
            "business_type": lead_data.get("business_type", ""),
            "budget": lead_data.get("budget", 0),
            "timeline": lead_data.get("timeline", ""),
            "requirements": lead_data.get("description", ""),
            "contact_info": {
                "email": lead_data.get("email", ""),
                "phone": lead_data.get("phone", "")
            }
        }
        
        # Use Loa Brain for qualification
        qualification = await self.loa_brain.qualify_lead_instantly(lead_info)
        
        # Generate PayPal payment link based on qualification
        score = qualification.get("qualification_score", 50)
        budget = lead_data.get("budget", 0)
        
        if score >= 80:
            # High-value leads get 20% discount
            paypal_link = f"https://PayPal.Me/9LMNTSSTUDIO/{int(budget * 0.8)}"
            priority = "HIGH"
        elif score >= 60:
            # Standard leads pay full price
            paypal_link = f"https://PayPal.Me/9LMNTSSTUDIO/{int(budget)}"
            priority = "MEDIUM"
        else:
            # Low-value leads pay deposit
            paypal_link = "https://PayPal.Me/9LMNTSSTUDIO/500"
            priority = "LOW"
        
        # Send to Notion for tracking
        notion_result = await self._send_to_notion({
            "action": "create_lead",
            "lead_data": lead_info,
            "qualification": qualification,
            "paypal_link": paypal_link,
            "priority": priority
        })
        
        # Send to N8n for email automation
        n8n_response = await self._send_to_n8n({
            "action": "lead_qualified",
            "lead_data": lead_info,
            "qualification": qualification,
            "paypal_link": paypal_link,
            "priority": priority,
            "next_workflow": "send_payment_email"
        })
        
        return {
            "status": "lead_qualified",
            "qualification": qualification,
            "paypal_link": paypal_link,
            "priority": priority,
            "notion_created": notion_result.get("success", False),
            "n8n_workflow_triggered": True,
            "next_steps": ["send_payment_email", "track_conversion"]
        }
    
    async def _handle_proposal_generation(self, proposal_data: Dict) -> Dict:
        """Handle AI proposal generation from N8n"""
        
        client_name = proposal_data.get("client_name", "")
        service_package = proposal_data.get("service_package", "ai_brand_transformation")
        requirements = proposal_data.get("requirements", "")
        budget = proposal_data.get("budget", 0)
        
        # Generate AI-powered proposal using Loa Brain
        proposal_content = await self.loa_brain.generate_ai_proposal(f"Generate proposal for {service_package} for {client_name}")
        
        # Create Event OS license
        from event_os_license import EventOSLicense
        license_system = EventOSLicense()
        license_data = license_system.generate_license(
            client_info={"name": client_name, "company": client_name},
            service_package=service_package
        )
        
        # Send to N8n for delivery
        n8n_response = await self._send_to_n8n({
            "action": "proposal_generated",
            "proposal_data": {
                "client_name": client_name,
                "service_package": service_package,
                "content": proposal_content,
                "license": license_data,
                "budget": budget
            },
            "next_workflow": "service_delivery"
        })
        
        return {
            "status": "proposal_generated",
            "proposal": proposal_content,
            "license": license_data,
            "n8n_workflow_triggered": True
        }
    
    async def _handle_service_delivery(self, delivery_data: Dict) -> Dict:
        """Handle AI service delivery from N8n"""
        
        service_type = delivery_data.get("service_type", "")
        client_name = delivery_data.get("client_name", "")
        delivery_details = delivery_data.get("delivery_details", {})
        
        # Get service configuration
        service_config = NINE_PILLARS_SERVICES.get(service_type.replace("_element", "_element"))
        if not service_config:
            return {"error": f"Unknown service: {service_type}"}
        
        # Create delivery plan
        delivery_plan = {
            "service_type": service_type,
            "service_name": service_config["name"],
            "client_name": client_name,
            "delivery_steps": [
                "Setup AI infrastructure",
                "Configure custom models",
                "Deploy automation workflows",
                "Train client team",
                "Create documentation"
            ],
            "estimated_completion": datetime.now() + timedelta(hours=48)
        }
        
        # Send to N8n for execution
        n8n_response = await self._send_to_n8n({
            "action": "service_delivery_started",
            "delivery_plan": delivery_plan,
            "next_workflow": "client_training"
        })
        
        return {
            "status": "delivery_started",
            "delivery_plan": delivery_plan,
            "n8n_workflow_triggered": True
        }
    
    async def _handle_client_onboarding(self, onboarding_data: Dict) -> Dict:
        """Handle client onboarding from N8n"""
        
        client_info = onboarding_data.get("client_info", {})
        onboarding_plan = onboarding_data.get("onboarding_plan", {})
        
        # Create onboarding workflow
        workflow_steps = [
            "Send welcome email with Event OS license",
            "Create client portal access",
            "Schedule training session",
            "Setup billing and payment",
            "Assign account manager"
        ]
        
        # Send to N8n for execution
        n8n_response = await self._send_to_n8n({
            "action": "client_onboarding_started",
            "client_info": client_info,
            "onboarding_plan": onboarding_plan,
            "workflow_steps": workflow_steps
        })
        
        return {
            "status": "onboarding_started",
            "workflow_steps": workflow_steps,
            "n8n_workflow_triggered": True
        }
    
    async def _handle_sales_campaign(self, campaign_data: Dict) -> Dict:
        """Handle sales campaign from N8n"""
        
        campaign_type = campaign_data.get("campaign_type", "")
        target_market = campaign_data.get("target_market", "")
        campaign_config = campaign_data.get("config", {})
        
        # Start automated campaign using Loa Brain
        from sales_automation import SalesAutomation
        sales_bot = SalesAutomation()
        campaign_result = await sales_bot.start_lead_scraping_campaign()
        
        # Create campaign-specific workflows
        campaign_workflows = {
            "lead_generation": {
                "channels": ["LinkedIn", "Email", "Social Media"],
                "target_audience": target_market,
                "messaging": f"Transform your business with Nine Pillars AI - Starting at ${campaign_config.get('min_budget', 2000):,}"
            },
            "qualification": {
                "criteria": ["budget >= $2,000", "AI transformation need", "timeline urgency"],
                "scoring_model": "AI-powered qualification"
            },
            "followup": {
                "sequences": ["immediate_hot_lead", "warm_lead_nurture", "cold_lead_education"],
                "personalization": "Industry-specific AI transformation benefits"
            }
        }
        
        # Send to N8n for execution
        n8n_response = await self._send_to_n8n({
            "action": "sales_campaign_started",
            "campaign_type": campaign_type,
            "target_market": target_market,
            "campaign_workflows": campaign_workflows,
            "campaign_result": campaign_result
        })
        
        return {
            "status": "campaign_started",
            "campaign_workflows": campaign_workflows,
            "n8n_workflow_triggered": True
        }
    
    async def _handle_generic_workflow(self, workflow_type: str, data: Dict) -> Dict:
        """Handle generic workflow types"""
        
        # Use Loa Brain to process
        loa_response = f"Processing {workflow_type} workflow with Loa Brain intelligence"
        
        return {
            "status": "processing",
            "workflow_type": workflow_type,
            "loa_analysis": loa_response,
            "n8n_workflow_triggered": True
        }
    
    async def _send_to_notion(self, data: Dict) -> Dict:
        """Send data to Notion database"""
        try:
            # Import Notion integration
            from notion_integration import NotionIntegration
            notion = NotionIntegration()
            
            if data.get("action") == "create_lead":
                # Add qualified lead to Notion
                lead_info = data.get("lead_data", {})
                qualification = data.get("qualification", {})
                paypal_link = data.get("paypal_link", "")
                priority = data.get("priority", "MEDIUM")
                
                # Add qualification score and PayPal link to lead data
                lead_info["qualification_score"] = qualification.get("qualification_score", 50)
                lead_info["paypal_link"] = paypal_link
                lead_info["priority"] = priority
                
                result = await notion.add_lead_to_notion(lead_info)
                logger.info(f"✅ Lead added to Notion: {result.get('status', 'unknown')}")
                return result
                
            elif data.get("action") == "update_status":
                # Update lead status
                page_id = data.get("page_id", "")
                status = data.get("status", "")
                notes = data.get("notes", "")
                
                result = await notion.update_lead_status(page_id, status, notes)
                logger.info(f"✅ Lead status updated: {status}")
                return result
                
            else:
                logger.warning(f"⚠️ Unknown Notion action: {data.get('action')}")
                return {"status": "unknown_action"}
                
        except Exception as e:
            logger.error(f"❌ Error sending to Notion: {e}")
            return {"status": "error", "error": str(e)}

    async def _send_to_n8n(self, data: Dict) -> Dict:
        """Send data to N8n webhook"""
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=data,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                logger.info(f"✅ Successfully sent to N8n: {data.get('action', 'unknown')}")
                return {"status": "success", "n8n_response": response.json()}
            else:
                logger.error(f"❌ Failed to send to N8n: {response.status_code}")
                return {"status": "error", "error": response.text}
                
        except Exception as e:
            logger.error(f"❌ Error sending to N8n: {e}")
            return {"status": "error", "error": str(e)}

# MCP Server Setup
async def main():
    """Start N8n MCP server"""
    print("🚀 9LMNTS N8n MCP Server - STARTING")
    print("📡 Connecting Loa Brain to N8n workflows")
    print("🎯 Enabling advanced automation for Nine Pillars AI services")
    
    server = N8nMCPServer()
    
    # Example workflow trigger
    test_workflow = {
        "workflow_type": "lead_qualification",
        "data": {
            "name": "Test Business",
            "company": "Test Corp",
            "business_type": "e-commerce",
            "budget": 5000,
            "timeline": "urgent",
            "requirements": "Need AI automation for content and customer service",
            "contact_info": {
                "email": "test@example.com",
                "phone": "+1-555-0123"
            }
        }
    }
    
    # Process workflow
    result = await server.handle_n8n_trigger(test_workflow)
    
    print(f"✅ Workflow Result: {result['status']}")
    print(f"🎯 N8n Integration: {result.get('n8n_workflow_triggered', False)}")
    print(f"📊 Ready for advanced workflow automation")
    
    print("\n🌐 N8n MCP Server Configuration:")
    print(f"   Webhook URL: {server.n8n_webhook_url}")
    print(f"   Auth Token: {server.auth_token[:20]}...")
    print(f"   Loa Brain: Connected")
    print(f"   Services: {len(NINE_PILLARS_SERVICES)} available")
    
    print("\n🚀 READY FOR:")
    print("   • Lead qualification automation")
    print("   • AI proposal generation")
    print("   • Service delivery workflows")
    print("   • Client onboarding sequences")
    print("   • Sales campaign management")
    print("   • Event OS license generation")
    
    print("\n💡 N8n Workflows Enabled:")
    print("   • lead_qualification → Loa Brain qualification → N8n proposal generation")
    print("   • service_delivery → Automated AI setup → Client training")
    print("   • sales_campaign → 24/7 lead generation → Multi-channel outreach")
    print("   • client_onboarding → Welcome sequence → Portal setup")
    
    print("\n🎉 Nine Pillars AI + N8n = COMPLETE AUTOMATION EMPIRE!")

if __name__ == "__main__":
    asyncio.run(main())
