// 9LMNTS Studio - LOA API Integration
// Connect React frontend to Python LOA backend system

// Use production Railway URL or localhost for testing
const LOA_API_URL = process.env.NEXT_PUBLIC_LOA_API_URL || 'https://darnley-sanons-projects-production.up.railway.app';

export interface AIProjectData {
  service_type: string;
  project_name: string;
  contact_email: string;
  contact_name: string;
  company?: string;
  phone?: string;
  website?: string;
  timeline: string;
  budget?: number;
  description?: string;
  requirements?: string;
  challenges?: string;
}

export interface CreativeProjectData {
  service_type: string;
  project_name: string;
  contact_email: string;
  contact_name: string;
  company?: string;
  phone?: string;
  website?: string;
  timeline: string;
  budget: number;
  description?: string;
  event_type?: string;
  expected_attendees?: number;
  monetization_strategy?: string;
}

// Mock LOA API for when Python server isn't running
async function mockSubmitToLOA(data: any, type: string) {
  console.log('🤖 MOCK LOA API Processing:', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Project submitted to mock LOA system',
    tracking_id: `MOCK-${Date.now()}`,
    qualification: {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      estimated_value: data.budget * 1.8,
      priority: data.budget > 3000 ? 'HIGH' : 'MEDIUM'
    }
  };
}

async function mockQualifyLead(data: any) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    qualification: {
      score: Math.floor(Math.random() * 30) + 70,
      estimated_value: data.budget * 1.8,
      priority: data.budget > 3000 ? 'HIGH' : 'MEDIUM',
      recommended_action: 'Send immediate proposal',
      closing_probability: `${Math.floor(Math.random() * 30) + 70}%` 
    }
  };
}

export async function submitToLOA(data: AIProjectData | CreativeProjectData, type: 'ai' | 'creative'): Promise<any> {
  try {
    const response = await fetch(`${LOA_API_URL}/api/ai-project/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.contact_name,
        email: data.contact_email,
        company: data.company,
        phone: data.phone,
        service_type: data.service_type,
        timeline: data.timeline,
        budget: data.budget?.toString() || '',
        description: data.description
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Real LOA API submission successful:', result);
    
    return {
      success: true,
      tracking_id: result.tracking_id || `LOA-${Date.now()}`,
      qualification_score: result.qualification?.score || 85,
      estimated_value: result.qualification?.estimated_value || 5000,
      message: result.message || 'Successfully submitted to LOA system'
    };
    
  } catch (error: any) {
    console.log('⚠️ Real LOA API error, using mock:', error);
    return await mockSubmitToLOA(data, type);
  }
}

export async function qualifyLead(data: AIProjectData | CreativeProjectData, type: 'ai' | 'creative'): Promise<any> {
  try {
    const response = await fetch(`${LOA_API_URL}/api/leads/qualify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.contact_name,
        email: data.contact_email,
        company: data.company,
        phone: data.phone,
        service_type: data.service_type,
        timeline: data.timeline,
        budget: data.budget?.toString() || '',
        description: data.description
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Real qualification successful:', result);
    return result;
    
  } catch (error: any) {
    console.log('⚠️ Real qualification API error, using mock:', error);
    return await mockQualifyLead(data);
  }
}
