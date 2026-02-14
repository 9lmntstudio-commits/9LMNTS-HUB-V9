"""

9LMNTS STUDIO - Figma Design Automation Agent

Automates design creation, template generation, and asset management using Figma API

"""



import os

import json

import requests

from datetime import datetime

from typing import Dict, List, Any, Optional



class FigmaAgent:

    def __init__(self):

        self.n8n_webhook_url = "https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads"

        self.api_key = os.getenv('FIGMA_API_KEY')

        self.base_url = "https://api.figma.com/v1"

        

        # Design templates

        self.design_templates = {

            'brand_identity': {

                'name': 'Brand Identity Package',

                'components': ['Logo', 'Color Palette', 'Typography', 'Brand Guidelines'],

                'files': ['logo.fig', 'brand-guidelines.fig', 'color-palette.fig']

            },

            'web_design': {

                'name': 'Web Design Package',

                'components': ['Homepage', 'About Page', 'Services Page', 'Contact Page'],

                'files': ['homepage.fig', 'about.fig', 'services.fig', 'contact.fig']

            },

            'social_media': {

                'name': 'Social Media Templates',

                'components': ['Instagram Post', 'Facebook Post', 'LinkedIn Post', 'Twitter Post'],

                'files': ['instagram.fig', 'facebook.fig', 'linkedin.fig', 'twitter.fig']

            },

            'presentation': {

                'name': 'Presentation Templates',

                'components': ['Title Slide', 'Content Slide', 'Chart Slide', 'Conclusion Slide'],

                'files': ['presentation.fig']

            }

        }

        

    def create_design_project(self, project_type: str, client_data: Dict) -> Dict:

        """Create automated design project"""

        try:

            project_name = f"{client_data.get('company', client_data.get('name', ''))} - {project_type}"

            

            # Create project structure

            project_data = {

                'project_name': project_name,

                'client_name': client_data.get('name', ''),

                'client_email': client_data.get('email', ''),

                'project_type': project_type,

                'budget': client_data.get('budget', 0),

                'timeline': client_data.get('timeline', ''),

                'components': [],

                'files': [],

                'status': 'created',

                'created_at': datetime.now().isoformat()

            }

            

            # Get template for project type

            template = self.design_templates.get(project_type, self.design_templates['brand_identity'])

            

            # Create design components

            for component in template['components']:

                component_data = {

                    'name': component,

                    'type': 'design_component',

                    'status': 'pending',

                    'created_at': datetime.now().isoformat()

                }

                project_data['components'].append(component_data)

            

            # Create design files

            for file_name in template['files']:

                file_data = {

                    'name': file_name,

                    'type': 'figma_file',

                    'status': 'pending',

                    'url': f"https://www.figma.com/file/mock-{file_name}",

                    'created_at': datetime.now().isoformat()

                }

                project_data['files'].append(file_data)

            

            print(f"✅ Design project created: {project_name}")

            return project_data

            

        except Exception as e:

            print(f"❌ Error creating design project: {str(e)}")

            return self.get_fallback_project(project_type, client_data)

    

    def generate_brand_identity(self, client_data: Dict) -> Dict:

        """Generate brand identity package"""

        try:

            brand_data = {

                'client_name': client_data.get('name', ''),

                'company': client_data.get('company', ''),

                'industry': client_data.get('industry', 'Technology'),

                'target_audience': client_data.get('target_audience', 'Business Owners'),

                'brand_values': client_data.get('brand_values', ['Innovation', 'Professional', 'Reliable']),

                'color_preferences': client_data.get('color_preferences', ['Blue', 'White', 'Gray']),

                'logo_style': client_data.get('logo_style', 'Modern'),

                'created_at': datetime.now().isoformat()

            }

            

            # Generate logo concepts

            logo_concepts = self.generate_logo_concepts(brand_data)

            

            # Generate color palette

            color_palette = self.generate_color_palette(brand_data)

            

            # Generate typography

            typography = self.generate_typography(brand_data)

            

            # Generate brand guidelines

            brand_guidelines = self.generate_brand_guidelines(brand_data)

            

            brand_package = {

                'brand_data': brand_data,

                'logo_concepts': logo_concepts,

                'color_palette': color_palette,

                'typography': typography,

                'brand_guidelines': brand_guidelines,

                'deliverables': [

                    'Logo files (PNG, SVG, AI)',

                    'Color palette file',

                    'Typography guide',

                    'Brand guidelines document',

                    'Brand assets package'

                ],

                'created_at': datetime.now().isoformat()

            }

            

            print(f"✅ Brand identity package created for {client_data.get('name')}")

            return brand_package

            

        except Exception as e:

            print(f"❌ Error generating brand identity: {str(e)}")

            return self.get_fallback_brand_identity(client_data)

    

    def generate_logo_concepts(self, brand_data: Dict) -> List[Dict]:

        """Generate logo concepts"""

        concepts = [

            {

                'name': 'Modern Minimalist',

                'description': f'Clean, minimalist logo for {brand_data["company"]} with focus on simplicity',

                'style': 'Minimalist',

                'colors': brand_data.get('color_preferences', ['Blue', 'White']),

                'concept_url': 'https://www.figma.com/file/mock-logo-concept-1'

            },

            {

                'name': 'Professional Corporate',

                'description': f'Corporate-style logo for {brand_data["company"]} with professional appeal',

                'style': 'Corporate',

                'colors': brand_data.get('color_preferences', ['Blue', 'Gray']),

                'concept_url': 'https://www.figma.com/file/mock-logo-concept-2'

            },

            {

                'name': 'Tech Innovation',

                'description': f'Innovative tech logo for {brand_data["company"]} with modern elements',

                'style': 'Tech',

                'colors': brand_data.get('color_preferences', ['Blue', 'Green']),

                'concept_url': 'https://www.figma.com/file/mock-logo-concept-3'

            }

        ]

        

        return concepts

    

    def generate_color_palette(self, brand_data: Dict) -> Dict:

        """Generate color palette"""

        base_colors = brand_data.get('color_preferences', ['Blue', 'White', 'Gray'])

        

        palette = {

            'primary_colors': [

                {'name': 'Primary Blue', 'hex': '#2563eb', 'usage': 'Main brand color'},

                {'name': 'Primary White', 'hex': '#ffffff', 'usage': 'Background and text'}

            ],

            'secondary_colors': [

                {'name': 'Secondary Gray', 'hex': '#6b7280', 'usage': 'Supporting elements'},

                {'name': 'Accent Color', 'hex': '#10b981', 'usage': 'Highlights and CTAs'}

            ],

            'neutral_colors': [

                {'name': 'Light Gray', 'hex': '#f3f4f6', 'usage': 'Backgrounds'},

                {'name': 'Dark Gray', 'hex': '#1f2937', 'usage': 'Text and borders'}

            ],

            'usage_guidelines': 'Use primary colors for main brand elements, secondary for highlights, and neutral for backgrounds.'

        }

        

        return palette

    

    def generate_typography(self, brand_data: Dict) -> Dict:

        """Generate typography guide"""

        typography = {

            'primary_font': {

                'name': 'Inter',

                'usage': 'Headings and body text',

                'weights': ['400', '500', '600', '700'],

                'styles': ['Normal', 'Italic']

            },

            'secondary_font': {

                'name': 'Space Mono',

                'usage': 'Code and technical content',

                'weights': ['400', '700'],

                'styles': ['Normal']

            },

            'heading_sizes': {

                'h1': '48px',

                'h2': '36px',

                'h3': '24px',

                'h4': '18px'

            },

            'body_sizes': {

                'body': '16px',

                'small': '14px',

                'caption': '12px'

            },

            'line_height': {

                'headings': '1.2',

                'body': '1.6'

            }

        }

        

        return typography

    

    def generate_brand_guidelines(self, brand_data: Dict) -> Dict:

        """Generate brand guidelines"""

        guidelines = {

            'brand_voice': 'Professional, innovative, and reliable',

            'tone_of_voice': 'Confident yet approachable',

            'messaging_pillars': [

                'Innovation and technology',

                'Professional excellence',

                'Customer success',

                'Reliability and trust'

            ],

            'do_and_dont': {

                'do': [

                    'Use professional language',

                    'Focus on benefits and solutions',

                    'Maintain consistent brand voice',

                    'Use high-quality visuals'

                ],

                'dont': [

                    'Use overly technical jargon',

                    'Make unrealistic promises',

                    'Inconsistent messaging',

                    'Low-quality imagery'

                ]

            },

            'usage_examples': [

                'Website copy and content',

                'Social media posts',

                'Email marketing',

                'Sales presentations',

                'Client communications'

            ]

        }

        

        return guidelines

    

    def create_web_design_package(self, client_data: Dict) -> Dict:

        """Create web design package"""

        try:

            web_package = {

                'client_name': client_data.get('name', ''),

                'company': client_data.get('company', ''),

                'website_type': client_data.get('website_type', 'Business Website'),

                'pages': [

                    {

                        'name': 'Homepage',

                        'purpose': 'Main landing page and brand introduction',

                        'components': ['Hero section', 'Services overview', 'Testimonials', 'Contact form'],

                        'design_url': 'https://www.figma.com/file/mock-homepage'

                    },

                    {

                        'name': 'About Page',

                        'purpose': 'Company information and team details',

                        'components': ['Company story', 'Team section', 'Mission statement'],

                        'design_url': 'https://www.figma.com/file/mock-about'

                    },

                    {

                        'name': 'Services Page',

                        'purpose': 'Service offerings and pricing',

                        'components': ['Service cards', 'Pricing table', 'CTA sections'],

                        'design_url': 'https://www.figma.com/file/mock-services'

                    },

                    {

                        'name': 'Contact Page',

                        'purpose': 'Contact information and inquiry form',

                        'components': ['Contact form', 'Map integration', 'Contact details'],

                        'design_url': 'https://www.figma.com/file/mock-contact'

                    }

                ],

                'design_system': {

                    'grid_system': '12-column grid',

                    'breakpoints': ['Mobile (320px)', 'Tablet (768px)', 'Desktop (1024px)'],

                    'components': ['Buttons', 'Forms', 'Cards', 'Navigation'],

                    'assets': ['Icons', 'Images', 'Illustrations']

                },

                'deliverables': [

                    'All page designs in Figma',

                    'Design system documentation',

                    'Responsive mockups',

                    'Asset files (icons, images)',

                    'Style guide'

                ],

                'created_at': datetime.now().isoformat()

            }

            

            print(f"✅ Web design package created for {client_data.get('name')}")

            return web_package

            

        except Exception as e:

            print(f"❌ Error creating web design package: {str(e)}")

            return self.get_fallback_web_design(client_data)

    

    def create_social_media_templates(self, client_data: Dict) -> Dict:

        """Create social media templates"""

        try:

            social_templates = {

                'client_name': client_data.get('name', ''),

                'company': client_data.get('company', ''),

                'brand_colors': client_data.get('color_preferences', ['Blue', 'White']),

                'templates': [

                    {

                        'platform': 'Instagram',

                        'type': 'Post',

                        'dimensions': '1080x1080px',

                        'components': ['Brand logo', 'Headline', 'Visual content', 'CTA'],

                        'template_url': 'https://www.figma.com/file/mock-instagram-post'

                    },

                    {

                        'platform': 'Facebook',

                        'type': 'Post',

                        'dimensions': '1200x630px',

                        'components': ['Brand logo', 'Headline', 'Body text', 'CTA button'],

                        'template_url': 'https://www.figma.com/file/mock-facebook-post'

                    },

                    {

                        'platform': 'LinkedIn',

                        'type': 'Post',

                        'dimensions': '1200x627px',

                        'components': ['Professional headline', 'Key points', 'Statistics', 'CTA'],

                        'template_url': 'https://www.figma.com/file/mock-linkedin-post'

                    },

                    {

                        'platform': 'Twitter',

                        'type': 'Post',

                        'dimensions': '1200x675px',

                        'components': ['Bold headline', 'Key message', 'Visual element', 'Handle'],

                        'template_url': 'https://www.figma.com/file/mock-twitter-post'

                    }

                ],

                'content_guidelines': {

                    'tone': 'Professional yet engaging',

                    'hashtag_strategy': ['#AI', '#Automation', '#Business', '#Innovation'],

                    'posting_frequency': 'Daily for Instagram, 3x/week for LinkedIn',

                    'content_mix': ['80% value, 20% promotional']

                },

                'deliverables': [

                    'All platform templates',

                    'Content calendar template',

                    'Brand guidelines for social media',

                    'Asset library',

                    'Posting schedule'

                ],

                'created_at': datetime.now().isoformat()

            }

            

            print(f"✅ Social media templates created for {client_data.get('name')}")

            return social_templates

            

        except Exception as e:

            print(f"❌ Error creating social media templates: {str(e)}")

            return self.get_fallback_social_templates(client_data)

    

    def get_fallback_project(self, project_type: str, client_data: Dict) -> Dict:

        """Fallback design project"""

        return {

            'project_name': f"{client_data.get('name', '')} - {project_type}",

            'client_name': client_data.get('name', ''),

            'client_email': client_data.get('email', ''),

            'project_type': project_type,

            'budget': client_data.get('budget', 0),

            'timeline': client_data.get('timeline', ''),

            'components': ['Design component 1', 'Design component 2'],

            'files': ['design.fig'],

            'status': 'created',

            'created_at': datetime.now().isoformat()

        }

    

    def get_fallback_brand_identity(self, client_data: Dict) -> Dict:

        """Fallback brand identity"""

        return {

            'brand_data': {

                'client_name': client_data.get('name', ''),

                'company': client_data.get('company', ''),

                'industry': 'Technology'

            },

            'logo_concepts': [{'name': 'Basic Logo', 'description': 'Simple logo design'}],

            'color_palette': {'primary_colors': [{'name': 'Blue', 'hex': '#2563eb'}]},

            'typography': {'primary_font': {'name': 'Inter', 'usage': 'Headings'}},

            'brand_guidelines': {'brand_voice': 'Professional and innovative'},

            'deliverables': ['Logo files', 'Color palette', 'Typography guide'],

            'created_at': datetime.now().isoformat()

        }

    

    def get_fallback_web_design(self, client_data: Dict) -> Dict:

        """Fallback web design"""

        return {

            'client_name': client_data.get('name', ''),

            'pages': [

                {'name': 'Homepage', 'purpose': 'Main landing page'},

                {'name': 'About', 'purpose': 'Company information'}

            ],

            'design_system': {'grid_system': '12-column grid'},

            'deliverables': ['Homepage design', 'About page design'],

            'created_at': datetime.now().isoformat()

        }

    

    def get_fallback_social_templates(self, client_data: Dict) -> Dict:

        """Fallback social media templates"""

        return {

            'client_name': client_data.get('name', ''),

            'templates': [

                {'platform': 'Instagram', 'type': 'Post', 'dimensions': '1080x1080px'},

                {'platform': 'Facebook', 'type': 'Post', 'dimensions': '1200x630px'}

            ],

            'content_guidelines': {'tone': 'Professional'},

            'deliverables': ['Instagram template', 'Facebook template'],

            'created_at': datetime.now().isoformat()

        }

    

    def send_design_data_to_n8n(self, design_data: Dict):

        """Send design data to n8n workflow"""

        try:

            payload = {

                'event_type': 'design_created',

                'design_data': design_data,

                'source': 'figma_automation',

                'timestamp': datetime.now().isoformat()

            }

            

            response = requests.post(

                self.n8n_webhook_url,

                json=payload,

                headers={'Content-Type': 'application/json'},

                timeout=30

            )

            

            if response.status_code == 200:

                print("✅ Design data sent to n8n workflow")

            else:

                print(f"⚠️ Failed to send to n8n: {response.status_code}")

                

        except Exception as e:

            print(f"❌ Error sending to n8n: {str(e)}")

