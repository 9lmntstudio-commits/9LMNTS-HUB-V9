"""
9LMNTS STUDIO - OpenAI Automation Agent
AI-powered content generation, chatbots, and automation using OpenAI API
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
import openai
from config.settings import config
from utils.error_handler import ErrorHandler, APIError
from utils.logger import logger

class OpenAIAgent:
    def __init__(self):
        self.n8n_webhook_url = config.service_urls['n8n_webhook']
        self.api_key = config.api_keys['openai']
        
        # Initialize OpenAI client with proper syntax
        self.client = openai.OpenAI(api_key=self.api_key)
        
        # Content templates
        self.content_templates = {
            'marketing_email': {
                'role': 'system',
                'content': 'You are a professional marketing copywriter for 9LMNTS Studio, an AI automation company. Write compelling, conversion-focused emails that drive immediate action.'
            },
            'social_media': {
                'role': 'system',
                'content': 'You are a social media expert for 9LMNTS Studio. Create engaging, viral-worthy content that drives engagement and leads.'
            },
            'sales_copy': {
                'role': 'system',
                'content': 'You are a sales copywriter for 9LMNTS Studio. Write persuasive sales copy that converts prospects into high-value clients.'
            },
            'blog_content': {
                'role': 'system',
                'content': 'You are a content marketing expert for 9LMNTS Studio. Write informative, SEO-optimized blog posts that establish authority and generate leads.'
            }
        }
        
    @ErrorHandler.handle_exception
    def generate_marketing_email(self, client_data: Dict, service_type: str) -> str:
        """Generate personalized marketing email"""
        try:
            template = self.content_templates['marketing_email']
            
            user_prompt = f"""
            Write a personalized marketing email for this client:
            
            Client Details:
            - Name: {client_data.get('name', '')}
            - Company: {client_data.get('company', '')}
            - Email: {client_data.get('email', '')}
            - Service Interest: {service_type}
            - Budget: ${client_data.get('budget', 0):,}
            - Timeline: {client_data.get('timeline', '')}
            
            Service Details: {self.get_service_description(service_type)}
            
            Requirements:
            - Personalized greeting
            - Address their specific needs
            - Highlight ROI and benefits
            - Include clear call-to-action
            - Professional yet conversational tone
            - 200-300 words
            - Include payment link: https://PayPal.Me/9LMNTSSTUDIO/{client_data.get('budget', 2000)}
            
            Format as HTML email with proper styling.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    template,
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            email_content = response.choices[0].message.content
            logger.info(f"Marketing email generated for {client_data.get('name')}")
            return email_content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise APIError(f"Failed to generate marketing email: {str(e)}", service="openai")
    
    def generate_social_media_content(self, service_type: str, platform: str = "linkedin") -> List[str]:
        """Generate social media content for different platforms"""
        try:
            template = self.content_templates['social_media']
            
            user_prompt = f"""
            Generate 3 viral social media posts for {service_type} service on {platform}.
            
            Service Details: {self.get_service_description(service_type)}
            
            Requirements:
            - Hook that grabs attention immediately
            - Value proposition clearly stated
            - Call-to-action to learn more
            - Platform-specific formatting and hashtags
            - 100-150 characters each
            - Include emoji for engagement
            - Target business owners and entrepreneurs
            
            Return as numbered list.
            """
            
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    template,
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=500,
                temperature=0.8
            )
            
            content = response.choices[0].message.content
            posts = [post.strip() for post in content.split('\n') if post.strip() and post[0].isdigit()]
            
            print(f"✅ Generated {len(posts)} social media posts for {service_type}")
            return posts
            
        except Exception as e:
            print(f"❌ Error generating social media content: {str(e)}")
            return self.get_fallback_social_posts(service_type, platform)
    
    def generate_sales_copy(self, service_type: str, target_audience: str = "business owners") -> Dict:
        """Generate persuasive sales copy"""
        try:
            template = self.content_templates['sales_copy']
            
            user_prompt = f"""
            Create high-converting sales copy for {service_type} service targeting {target_audience}.
            
            Service Details: {self.get_service_description(service_type)}
            
            Generate:
            1. Headline (under 10 words)
            2. Sub-headline (under 15 words)
            3. Body copy (100-150 words)
            4. Call-to-action (under 20 words)
            5. Value proposition bullet points (3 points)
            6. Urgency element (1 sentence)
            
            Focus on ROI, automation benefits, and competitive advantage.
            """
            
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    template,
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=800,
                temperature=0.6
            )
            
            content = response.choices[0].message.content
            
            # Parse the response into structured format
            sales_copy = {
                'headline': '',
                'sub_headline': '',
                'body_copy': '',
                'call_to_action': '',
                'value_propositions': [],
                'urgency': ''
            }
            
            lines = content.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if '1.' in line or 'Headline:' in line:
                    sales_copy['headline'] = line.split('.', 1)[-1].replace('Headline:', '').strip()
                elif '2.' in line or 'Sub-headline:' in line:
                    sales_copy['sub_headline'] = line.split('.', 1)[-1].replace('Sub-headline:', '').strip()
                elif '3.' in line or 'Body copy:' in line:
                    sales_copy['body_copy'] = line.split('.', 1)[-1].replace('Body copy:', '').strip()
                elif '4.' in line or 'Call-to-action:' in line:
                    sales_copy['call_to_action'] = line.split('.', 1)[-1].replace('Call-to-action:', '').strip()
                elif '5.' in line or 'Value proposition:' in line:
                    sales_copy['value_propositions'].append(line.split('.', 1)[-1].replace('Value proposition:', '').strip())
                elif '6.' in line or 'Urgency:' in line:
                    sales_copy['urgency'] = line.split('.', 1)[-1].replace('Urgency:', '').strip()
            
            print(f"✅ Sales copy generated for {service_type}")
            return sales_copy
            
        except Exception as e:
            print(f"❌ Error generating sales copy: {str(e)}")
            return self.get_fallback_sales_copy(service_type)
    
    def generate_blog_content(self, topic: str, service_type: str, word_count: int = 1000) -> Dict:
        """Generate SEO-optimized blog content"""
        try:
            template = self.content_templates['blog_content']
            
            user_prompt = f"""
            Write a comprehensive blog post about "{topic}" related to {service_type}.
            
            Service Details: {self.get_service_description(service_type)}
            
            Requirements:
            - {word_count} words
            - SEO optimized with keywords
            - Engaging introduction
            - Informative body with subheadings
            - Practical tips and insights
            - Clear conclusion with CTA
            - Include meta title and description
            - Target business owners and entrepreneurs
            
            Format with proper HTML structure.
            """
            try:
                logger.api_call("openai", "chat.completions.create", "POST")
                
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": template['content']},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=2000,
                    temperature=0.7
                )
                
                content = response.choices[0].message.content
                
                blog_post = {
                    'title': '',
                    'meta_description': '',
                    'content': content,
                    'word_count': len(content.split()),
                    'generated_at': datetime.now().isoformat()
                }
                
                print(f"✅ Blog post generated: {topic}")
                return blog_post
                
            except Exception as e:
                logger.error(f"OpenAI API error: {str(e)}")
                raise APIError(f"Failed to generate blog content: {str(e)}", service="openai")
                
            return blog_post
            
        except Exception as e:
            print(f"❌ Error generating blog content: {str(e)}")
            return self.get_fallback_blog_post(topic, service_type)
    
    def create_lead_qualification_chatbot(self, lead_data: Dict) -> Dict:
        """Create AI-powered lead qualification chatbot"""
        try:
            user_prompt = f"""
            Create a lead qualification chatbot script for 9LMNTS Studio.
            
            Lead Information:
            - Name: {lead_data.get('name', '')}
            - Email: {lead_data.get('email', '')}
            - Service Interest: {lead_data.get('service_type', '')}
            - Budget: ${lead_data.get('budget', 0):,}
            
            Chatbot Requirements:
            - Welcome message with personalization
            - Qualification questions (3-5 questions)
            - Service recommendations based on answers
            - Pricing information
            - Call-to-action for consultation
            - Professional and conversational tone
            
            Format as JSON with conversation flow.
            """
            
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert chatbot designer for B2B automation companies."},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=1500,
                temperature=0.6
            )
            
            chatbot_script = response.choices[0].message.content
            
            chatbot_data = {
                'lead_name': lead_data.get('name', ''),
                'lead_email': lead_data.get('email', ''),
                'script': chatbot_script,
                'created_at': datetime.now().isoformat()
            }
            
            print(f"✅ Chatbot script created for {lead_data.get('name')}")
            return chatbot_data
            
        except Exception as e:
            print(f"❌ Error creating chatbot: {str(e)}")
            return self.get_fallback_chatbot(lead_data)
    
    def get_service_description(self, service_type: str) -> str:
        """Get detailed service description"""
        descriptions = {
            'AI Brand Voice': 'AI-powered content strategy and brand voice automation that creates consistent, engaging content across all platforms.',
            'Web Design': 'Modern, responsive web design with AI integration that converts visitors into customers and scales with your business.',
            'AI Business Automation': 'Complete business process automation using AI to reduce costs, increase efficiency, and accelerate growth.',
            'EventOS': 'Event management automation platform that handles everything from registration to follow-up with AI-powered insights.'
        }
        return descriptions.get(service_type, 'Professional AI automation services for business growth.')
    
    def get_fallback_email(self, client_data: Dict, service_type: str) -> str:
        """Fallback email template"""
        return f"""
        <html>
        <body>
            <h2>Hi {client_data.get('name', '')},</h2>
            <p>Thank you for your interest in our {service_type} service!</p>
            <p>Our AI-powered solutions can transform your business operations.</p>
            <p>Investment: ${client_data.get('budget', 0):,}</p>
            <p><a href="https://PayPal.Me/9LMNTSSTUDIO/{client_data.get('budget', 2000)}">Get Started Now</a></p>
        </body>
        </html>
        """
    
    def get_fallback_social_posts(self, service_type: str, platform: str) -> List[str]:
        """Fallback social media posts"""
        return [
            f"🚀 Transform your business with {service_type}! AI-powered automation that drives results. #AI #Automation #Business",
            f"💰 Ready to scale? Our {service_type} service delivers 10x ROI. Learn more! #BusinessGrowth #Innovation",
            f"🤖 Stop manual work. Start automating with {service_type}. DM us to get started! #DigitalTransformation #AI"
        ]
    
    def get_fallback_sales_copy(self, service_type: str) -> Dict:
        """Fallback sales copy"""
        return {
            'headline': f'Automate Your {service_type}',
            'sub_headline': 'AI-Powered Solutions for Maximum Growth',
            'body_copy': f'Our {service_type} service uses cutting-edge AI to automate your processes and accelerate growth.',
            'call_to_action': 'Get Started Today',
            'value_propositions': [
                '10x ROI guaranteed',
                'Complete automation',
                'Professional support'
            ],
            'urgency': 'Limited spots available this month.'
        }
    
    def get_fallback_blog_post(self, topic: str, service_type: str) -> Dict:
        """Fallback blog post"""
        return {
            'title': f'How {topic} Can Transform Your Business',
            'meta_description': f'Learn how {service_type} can revolutionize your business operations.',
            'content': f'<h1>{topic}</h1><p>Discover the power of {service_type} for your business...</p>',
            'word_count': 500,
            'generated_at': datetime.now().isoformat()
        }
    
    def get_fallback_chatbot(self, lead_data: Dict) -> Dict:
        """Fallback chatbot script"""
        return {
            'lead_name': lead_data.get('name', ''),
            'lead_email': lead_data.get('email', ''),
            'script': '{"welcome": "Hello! How can I help you today?", "questions": ["What service are you interested in?"]}',
            'created_at': datetime.now().isoformat()
        }
    
    def send_content_to_n8n(self, content_data: Dict):
        """Send generated content to n8n workflow"""
        try:
            payload = {
                'event_type': 'ai_content_generated',
                'content': content_data,
                'source': 'openai_automation',
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                self.n8n_webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Content sent to n8n workflow")
            else:
                print(f"⚠️ Failed to send to n8n: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error sending to n8n: {str(e)}")
