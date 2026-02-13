"""
CrewAI Lead Qualification Agent
Connects to Railway LOA Brain API for intelligent lead scoring
"""

import os
import json
import requests
from crewai import Agent, Task, Crew
from crewai.tools import tool

# Railway LOA Brain API
LOA_API_URL = "https://darnley-sanons-projects-production.up.railway.app"

@tool
def qualify_lead_with_loa(name: str, email: str, company: str, service_type: str, budget: str, description: str) -> str:
    """Qualify lead using Railway LOA Brain API"""
    try:
        payload = {
            "name": name,
            "email": email, 
            "company": company,
            "service_type": service_type,
            "budget": budget,
            "description": description
        }
        
        response = requests.post(f"{LOA_API_URL}/api/leads/qualify", json=payload)
        
        if response.status_code == 200:
            qualification = response.json()
            score = qualification.get("qualification", {}).get("score", 50)
            estimated_value = qualification.get("qualification", {}).get("estimated_value", 5000)
            
            return f"""
Lead Qualification Results:
- Score: {score}/100
- Estimated Value: ${estimated_value}
- Recommendation: {"HIGH PRIORITY" if score >= 80 else "MEDIUM PRIORITY" if score >= 60 else "LOW PRIORITY"}
- Next Action: {"Immediate call + PayPal link" if score >= 80 else "Email sequence" if score >= 60 else "Nurture campaign"}
"""
        else:
            return f"API Error: {response.status_code}"
            
    except Exception as e:
        return f"Qualification failed: {str(e)}"

@tool  
def generate_paypal_link(service_type: str, budget: str, qualification_score: int) -> str:
    """Generate PayPal payment link based on qualification"""
    if qualification_score >= 80:
        # High-value leads get 20% discount
        discounted_price = int(int(budget) * 0.8) if budget.isdigit() else 2000
        return f"https://PayPal.Me/9LMNTSSTUDIO/{discounted_price}"
    else:
        # Standard leads pay deposit
        return "https://PayPal.Me/9LMNTSSTUDIO/500"

# Create Lead Qualification Agent
lead_qualifier = Agent(
    role='Lead Qualification Specialist',
    goal='Qualify incoming leads and determine optimal sales strategy',
    backstory="""You are an expert sales qualification specialist at 9LMNTS Studio.
    You analyze leads using AI scoring and recommend the best approach for conversion.""",
    tools=[qualify_lead_with_loa, generate_paypal_link],
    verbose=True
)

# Create Follow-up Strategy Agent  
followup_strategist = Agent(
    role='Follow-up Strategy Expert', 
    goal='Create personalized follow-up sequences based on lead qualification',
    backstory="""You design customer journey sequences that maximize conversion rates.
    You tailor communication based on lead score and service type.""",
    verbose=True
)

# Define Tasks
qualification_task = Task(
    description=f"""
    Qualify the lead using the LOA Brain API and determine:
    1. Lead score (0-100)
    2. Estimated project value
    3. Priority level (HIGH/MEDIUM/LOW)
    4. Recommended next action
    5. Generate appropriate PayPal payment link
    """,
    agent=lead_qualifier,
    expected_output="Complete qualification report with payment link"
)

strategy_task = Task(
    description=f"""
    Based on the qualification results, create a follow-up strategy:
    1. If HIGH PRIORITY (score >= 80): Immediate call + PayPal discount
    2. If MEDIUM PRIORITY (score >= 60): Email sequence + standard PayPal
    3. If LOW PRIORITY (score < 60): Nurture campaign + deposit required
    """,
    agent=followup_strategist,
    expected_output="Detailed follow-up strategy with communication plan"
)

# Create Crew
lead_crew = Crew(
    agents=[lead_qualifier, followup_strategist],
    tasks=[qualification_task, strategy_task],
    verbose=True
)

def process_lead(lead_data):
    """Process incoming lead through CrewAI pipeline"""
    result = lead_crew.kickoff(lead_data)
    return result

if __name__ == "__main__":
    # Test with sample lead
    sample_lead = {
        "name": "John Doe",
        "email": "john@company.com", 
        "company": "Tech Corp",
        "service_type": "AI Brand Voice",
        "budget": "3000",
        "description": "Need custom AI content generation"
    }
    
    result = process_lead(sample_lead)
    print("Lead Processing Result:", result)
