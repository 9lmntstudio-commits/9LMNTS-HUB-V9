import { ServiceType } from '../types/services';

// Map service IDs from different pages to actual service IDs
export const SERVICE_MAPPING: Record<string, string> = {
  // AI Services from ServicesPage
  'ai-brand': 'ai_brand_voice',
  'ai-ux': 'ai_ux_flow',
  'ai-visual': 'ai_visual_design',
  'ai-innovation': 'ai_innovation',
  'ai-animation': 'ai_animation',
  'ai-learning': 'ai_content_learning',
  'ai-trend': 'ai_trend_forecasting',
  'ai-automation': 'ai_business_automation',
  'ai-multilingual': 'ai_multilingual',
  
  // EventOS from PricingPage
  'basic': 'eventos_basic',
  'standard': 'eventos_standard',
  'premium': 'eventos_premium',
  'custom': 'eventos_custom',
  
  // Creative Services
  'web-design': 'web_design',
  'brand-identity': 'brand_identity',
  'seo': 'seo_optimization',
  'graphic-design': 'graphic_design',
  'video-editing': 'video_editing'
};

export function mapServiceId(planValue: string | undefined): string | undefined {
  if (!planValue) return undefined;
  return SERVICE_MAPPING[planValue] || planValue;
}

export function getServiceTypeById(serviceId: string): ServiceType {
  if (serviceId.startsWith('ai_')) return 'ai';
  if (serviceId.startsWith('eventos_')) return 'eventos';
  return 'creative';
}
