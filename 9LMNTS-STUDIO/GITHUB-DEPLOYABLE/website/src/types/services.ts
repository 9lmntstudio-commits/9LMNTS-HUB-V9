// Service type definitions
export type ServiceType = 'ai' | 'creative' | 'eventos';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  category: string;
  price: number | string;
  description: string;
  icon: any; // We'll use React.ComponentType for better typing
  color: string;
  features: string[];
  deliveryTime: string;
  includes: string[];
  budgetRange?: { min: number; max: number };
}

export interface ProjectFormData {
  projectName: string;
  timeline: string;
  contactName: string;
  contactEmail: string;
  company: string;
  phone: string;
  website: string;
  description: string;
  budget: string;
}

export interface UnifiedStartProjectPageProps {
  selectedPlan?: string;
  selectedServiceType?: ServiceType;
  onNavigate: (page: string) => void;
}

export interface LoaSubmissionData {
  service_type: string;
  service_category: string;
  project_name: string;
  contact_email: string;
  contact_name: string;
  company: string;
  phone: string;
  website: string;
  timeline: string;
  budget: number;
  description: string;
  service_type_category: ServiceType;
}
