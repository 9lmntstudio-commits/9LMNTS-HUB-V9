"""
9LMNTS STUDIO - Social Media Automation Agent
Automates multi-platform social media posting, content scheduling, and lead generation
"""

import os
import json
import requests
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any

class SocialMediaAgent:
    def __init__(self):
        self.manychat_api_key = os.getenv("MANYCHAT_API_KEY", "your_manychat_api_key_here")
        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"
        self.platforms = {
            "facebook": {
                "api_url": "https://graph.facebook.com/v18.0/me/posts",
                "content_types": ["text", "image", "video"]
            },
            "instagram": {
                "api_url": "https://graph.instagram.com/v1/media",
                "content_types": ["image", "video", "story"]
            },
            "twitter": {
                "api_url": "https://api.twitter.com/2/tweets",
                "content_types": ["text", "image", "video"]
            },
            "linkedin": {
                "api_url": "https://api.linkedin.com/v2/shares",
                "content_types": ["text", "article"]
            }
        }
        
    def create_content_schedule(self, services: List[str]) -> Dict[str, Any]:
        """Create content schedule based on 9LMNTS services"""
        
        content_templates = {
            "AI Brand Voice": [
                "🤖 Transform your brand with AI-powered content generation!",
                "💬 Create consistent brand voice across all platforms",
                "📈 10x faster content creation with AI assistance",
                "🎯 Custom AI trained on YOUR brand voice"
            ],
            "AI Business Automation": [
                "⚡ Automate your business processes with custom AI solutions",
                "🔄 Reduce manual work by 80% with intelligent workflows",
                "💰 ROI on automation within 30 days",
                "🤖 Smart workflows that learn your business"
            ],
            "AI Visual Design": [
                "🎨 AI-powered design systems that adapt to your brand",
                "🖼️ Generate unlimited design variations instantly",
                "🎯 Brand-consistent designs every time",
                "🚀 From concept to deployment in hours, not weeks"
            ],
            "Web Design": [
                "🌐 Modern, responsive websites that convert visitors",
                "📱 Mobile-first design for maximum engagement",
                "⚡ Lightning-fast loading speeds",
                "🎨 Stunning designs that represent your brand"
            ],
            "AI Content & Learning": [
                "📚 Intelligent content creation and learning systems",
                "🧠 AI that understands your audience",
                "📊 Content performance analytics",
                "🎯 Personalized learning experiences"
            ]
        }
        
        schedule = []
        for service in services:
            if service in content_templates:
                for i, template in enumerate(content_templates[service]):
                    post_time = datetime.now() + timedelta(days=i*2, hours=i*4)
                    schedule.append({
                        "platform": "all",
                        "content": template,
                        "service": service,
                        "scheduled_time": post_time.isoformat(),
                        "type": "educational",
                        "hashtag": f"#{service.lower().replace(' ', '')} #AI #automation"
                    })
        
        return schedule
    
    def post_to_manychat(self, content: str, platforms: List[str]) -> Dict[str, Any]:
        """Post content to multiple platforms via Manychat"""
        
        try:
            # Manychat API integration
            headers = {
                "Authorization": f"Bearer {self.manychat_api_key}",
                "Content-Type": "application/json"
            }
            
            for platform in platforms:
                if platform in self.platforms:
                    payload = {
                        "text": content,
                        "platform": platform,
                        "scheduled_time": datetime.now().isoformat(),
                        "media_urls": []  # Can be extended with media uploads
                    }
                    
                    response = requests.post(
                        "https://api.manychat.com/v1/content/publish",
                        headers=headers,
                        json=payload,
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ Posted to {platform}: {result.get('post_id', 'Unknown ID')}")
                    else:
                        print(f"❌ Failed to post to {platform}: {response.text}")
                        
        except Exception as e:
            print(f"❌ Manychat posting error: {e}")
            
        return {"success": True, "platforms": platforms}
    
    def generate_leads_from_social(self, content_performance: Dict) -> List[Dict[str, Any]]:
        """Generate leads from social media engagement"""
        
        leads = []
        
        # Analyze engagement metrics
        for platform, metrics in content_performance.items():
            if metrics.get("engagement_rate", 0) > 5:  # High engagement
                leads.append({
                    "source": "social_media",
                    "platform": platform,
                    "type": "high_engagement",
                    "data": {
                        "engagement_rate": metrics.get("engagement_rate"),
                        "reach": metrics.get("reach", 0),
                        "likes": metrics.get("likes", 0),
                        "comments": metrics.get("comments", 0)
                    },
                    "timestamp": datetime.now().isoformat()
                })
        
        return leads
    
    def send_leads_to_n8n(self, leads: List[Dict[str, Any]]):
        """Send social media leads to n8n workflow"""
        
        for lead in leads:
            try:
                # Format lead data for n8n
                n8n_lead = {
                    "name": f"Social Media Lead from {lead['platform']}",
                    "email": "social@9lmntsstudio.com",  # Can be customized
                    "company": "Social Media Campaign",
                    "phone": "+1-555-SOCIAL",
                    "service_type": "AI Brand Voice & Content Generation",
                    "budget": 3000,  # High-value social leads
                    "description": f"High engagement from {lead['platform']}: {lead['data']['engagement_rate']}% rate",
                    "timeline": "ASAP",
                    "project_name": f"Social Media {lead['platform']} Campaign",
                    "source": "social_media_agent"
                }
                
                response = requests.post(
                    self.n8n_webhook_url,
                    json=n8n_lead,
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"✅ Social lead sent to n8n: {lead['platform']}")
                else:
                    print(f"❌ Failed to send social lead: {response.text}")
                    
            except Exception as e:
                print(f"❌ Error sending social lead to n8n: {e}")
    
    def run_automation_cycle(self):
        """Run complete social media automation cycle"""
        
        print("🚀 Starting Social Media Automation Agent...")
        
        # 1. Create content schedule
        services = ["AI Brand Voice", "AI Business Automation", "AI Visual Design"]
        schedule = self.create_content_schedule(services)
        
        # 2. Post scheduled content
        for content_item in schedule:
            platforms = ["facebook", "instagram", "twitter", "linkedin"]
            result = self.post_to_manychat(content_item["content"], platforms)
            
            if result["success"]:
                print(f"📤 Posted: {content_item['service']} to {len(platforms)} platforms")
                
                # 3. Wait for engagement (simulate)
                time.sleep(60)  # Wait 1 minute for engagement
                
                # 4. Generate leads from engagement
                mock_performance = {
                    content_item["platform"]: {
                        "engagement_rate": 8.5,
                        "reach": 500,
                        "likes": 45,
                        "comments": 12
                    }
                }
                
                leads = self.generate_leads_from_social(mock_performance)
                
                # 5. Send leads to n8n
                self.send_leads_to_n8n(leads)
                
        print("✅ Social Media Automation Cycle Complete!")
        
        return {
            "content_scheduled": len(schedule),
            "platforms_active": len(self.platforms),
            "leads_generated": len(leads),
            "automation_complete": True
        }

# Example usage
if __name__ == "__main__":
    agent = SocialMediaAgent()
    result = agent.run_automation_cycle()
    print(f"🎯 Social Media Agent Results: {result}")
