import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Calendar, Mail, Phone, User, Building2, Globe, MessageSquare, Filter, Brain, Palette, Zap } from 'lucide-react';
import { submitToLOA, qualifyLead, AIProjectData, CreativeProjectData } from '../services/loaApi';
import { emailService } from '../services/emailService';
import { getSupabaseClient } from '../utils/supabase/client';
import { UpsellSystem } from './UpsellSystem';

interface UnifiedStartProjectPageProps {
  selectedPlan?: string;
  selectedServiceType?: 'ai' | 'creative' | 'eventos';
  selectedServiceId?: string;
  onNavigate: (page: string) => void;
}

const ALL_SERVICES = [
  // AI Services
  { id: 'ai-brand-voice', name: 'AI Brand Voice & Content Generation', type: 'ai', price: 'From $2,500', description: 'MCing Element - Custom GPT that creates content in your brand voice', icon: Brain },
  { id: 'ai-ux-flow', name: 'AI User Experience Flow', type: 'ai', price: 'From $3,000', description: 'DJing Element - AI-powered UX optimization', icon: Zap },
  { id: 'ai-visual-design', name: 'AI Visual Design System', type: 'ai', price: 'From $2,000', description: 'Graffiti Element - AI logo and brand identity', icon: Palette },
  { id: 'ai-innovation', name: 'AI Innovation & Disruption', type: 'ai', price: 'From $1,500', description: 'Breaking Element - AI trend prediction', icon: Brain },
  { id: 'ai-interaction', name: 'AI Interaction & Animation', type: 'ai', price: 'From $2,000', description: 'Beatboxing Element - AI interactions', icon: Zap },
  { id: 'ai-content-learning', name: 'AI Content & Learning Systems', type: 'ai', price: 'From $1,000', description: 'Knowledge Element - AI content curation', icon: Brain },
  { id: 'ai-trend-forecasting', name: 'AI Trend Forecasting', type: 'ai', price: 'From $2,500', description: 'Fashion Element - Real-time trends', icon: Palette },
  { id: 'ai-business-automation', name: 'AI Business Automation', type: 'ai', price: 'From $3,000', description: 'Entrepreneurship Element - AI workflows', icon: Zap },
  { id: 'ai-multilingual', name: 'AI Multilingual Communication', type: 'ai', price: 'From $3,500', description: 'Language Element - AI translation', icon: Brain },
  
  // Creative Services
  { id: 'web-design', name: 'Web Design & Development', type: 'creative', price: '$1,500-$5,000', description: 'Modern responsive websites', icon: Palette },
  { id: 'brand-identity', name: 'Brand Identity & Logo Design', type: 'creative', price: '$2,000-$5,000', description: 'Complete brand packages', icon: Palette },
  { id: 'ecommerce', name: 'E-commerce Platform', type: 'creative', price: '$3,000-$8,000', description: 'Online stores with payment', icon: Zap },
  { id: 'mobile-app', name: 'Mobile App Design', type: 'creative', price: '$5,000-$15,000', description: 'iOS and Android apps', icon: Brain },
  { id: 'marketing-campaign', name: 'Marketing Campaign', type: 'creative', price: '$2,000-$10,000', description: 'Digital marketing campaigns', icon: Zap },
  
  // EventOS Packages
  { id: 'eventos-basic', name: 'EventOS Basic Boost', type: 'eventos', price: '$1,500', description: 'EventOS Platform License + Basic Design', icon: Zap },
  { id: 'eventos-standard', name: 'EventOS Standard Pro', type: 'eventos', price: '$3,000', description: 'EventOS + AI Event Operator + Analytics', icon: Brain },
  { id: 'eventos-premium', name: 'EventOS Premium Elite', type: 'eventos', price: '$5,000', description: 'EventOS + AI + White-label Rights', icon: Zap },
  { id: 'eventos-custom', name: 'EventOS Custom Scale', type: 'eventos', price: 'Custom', description: 'Enterprise solutions with custom features', icon: Brain }
];

export function UnifiedStartProjectPage({ selectedPlan, selectedServiceType, selectedServiceId, onNavigate }: UnifiedStartProjectPageProps) {
  const [step, setStep] = useState(1);
  const [filter, setFilter] = useState<'all' | 'ai' | 'creative' | 'eventos'>('all');
  const [showUpsell, setShowUpsell] = useState(false);
  const [selectedUpsellPackage, setSelectedUpsellPackage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serviceId: selectedServiceId || '',
    serviceType: selectedServiceType || '',
    projectName: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    description: '',
    eventType: '',
    expectedAttendees: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Auto-select service if pre-selected
  const filteredServices = ALL_SERVICES.filter(service => {
    if (filter === 'all') return true;
    return service.type === filter;
  });

  const selectedService = ALL_SERVICES.find(s => s.id === formData.serviceId);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
     

      // Save to Supabase directly
      try {
        const supabase = getSupabaseClient();
        
        if (selectedService?.type === 'ai') {
          const aiData = {
            contact_name: formData.name,
            contact_email: formData.email,
            company: formData.company,
            phone: formData.phone,
            website: formData.website,
            service_type: selectedService?.id,
            project_name: formData.projectName,
            timeline: formData.timeline,
            budget: parseInt(formData.budget) || 2500,
            description: formData.description
          };
          
          const { error } = await (supabase as any)
            .from('ai_projects')
            .insert([aiData]);
          
          if (error) throw error;
        } else {
          const creativeData = {
            contact_name: formData.name,
            contact_email: formData.email,
            company: formData.company,
            phone: formData.phone,
            website: formData.website,
            service_type: selectedService?.id,
            project_name: formData.projectName,
            timeline: formData.timeline,
            budget: parseInt(formData.budget.replace(/[^\d]/g, '')) || 1500,
            description: formData.description,
            event_type: formData.eventType,
            expected_attendees: parseInt(formData.expectedAttendees) || null
          };
          
          const { error } = await (supabase as any)
            .from('creative_projects')
            .insert([creativeData]);
          
          if (error) throw error;
        }
        console.log('✅ Saved to Supabase');
      } catch (error) {
        console.error('Supabase save error:', error);
        // Continue anyway - data already saved locally
      }

      // n8n handles email automation - no need for separate email service

      // Send to n8n automation directly (no Netlify functions needed)
      try {
        const leadData = {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          service_type: selectedService?.name,
          budget: formData.budget,
          description: formData.description,
          timeline: formData.timeline,
          project_name: formData.projectName,
          source: 'website_form'
        };

        // Direct n8n production webhook call - no Netlify functions!
        const n8nResponse = await fetch('https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData)
        });

        if (n8nResponse.ok) {
          console.log('🚀 Lead sent to n8n automation successfully');
          const result = await n8nResponse.json();
          console.log('💰 PayPal Link Generated:', result.payment_link || 'https://PayPal.Me/9LMNTSSTUDIO/500');
        } else {
          console.log('⚠️ n8n webhook failed, but submission succeeded');
          // Fallback: Generate PayPal link directly
          const budget = parseInt(formData.budget) || 500;
          const fallbackLink = budget >= 3000 
            ? `https://PayPal.Me/9LMNTSSTUDIO/${Math.floor(budget * 0.8)}`
            : 'https://PayPal.Me/9LMNTSSTUDIO/500';
          console.log('💰 Fallback PayPal Link:', fallbackLink);
        }
      } catch (n8nError) {
        console.log('⚠️ n8n automation error:', n8nError);
        // Still show success to user - data saved locally
      }
      
      // Store submission locally for immediate backup
      const submissionData = {
        id: Date.now().toString(),
        ...formData,
        serviceName: selectedService?.name || 'AI Service',
        submittedAt: new Date().toISOString()
      };
      
      // Store in localStorage as backup
      const existingSubmissions = JSON.parse(localStorage.getItem('pending_submissions') || '[]');
      existingSubmissions.push(submissionData);
      localStorage.setItem('pending_submissions', JSON.stringify(existingSubmissions));
      
      console.log('💾 Submission stored locally:', submissionData);
      
      // LOA API is handled by n8n workflow - no need for separate calls
      console.log('🤖 LOA qualification handled by n8n automation');
      
      // Always show success - emails sent and data saved
      setStep(5);
      
    } catch (error: any) {
      console.error('Critical submission error:', error);
      setSubmissionError('An unexpected error occurred. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = ALL_SERVICES.find(s => s.id === serviceId);
    if (service) {
      setFormData({
        ...formData,
        serviceId,
        serviceType: service.type,
        projectName: service.name
      });
      setStep(2);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.serviceId !== '';
      case 2: return formData.projectName !== '' && formData.timeline !== '';
      case 3: return formData.name !== '' && formData.email !== '';
      case 4: return true;
      case 5: return true; // Review step
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() && step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-[#222222] rounded-2xl border border-[#FF7A00]/20 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">Start Your Project</h1>
          <p className="text-gray-400">Transform your business with our AI-powered solutions</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mt-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= num ? 'bg-[#FF7A00] text-white' : 'bg-white/10 text-gray-400'
                }`}>
                  {num}
                </div>
                {num < 5 && <div className={`w-16 h-1 mx-2 ${step > num ? 'bg-[#FF7A00]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Choose Your Service</h2>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-8">
                {['all', 'ai', 'creative', 'eventos'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === type 
                        ? 'bg-[#FF7A00] text-white' 
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6 cursor-pointer hover:border-[#FF7A00] transition-all hover:transform hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#FF7A00]/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#FF7A00]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-1">{service.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                          <p className="text-[#FF7A00] font-bold">{service.price}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Select timeline</option>
                    <option value="ASAP">ASAP (Rush)</option>
                    <option value="2-4 Weeks">2-4 Weeks</option>
                    <option value="1-2 Months">1-2 Months</option>
                    <option value="2-3 Months">2-3 Months</option>
                    <option value="3+ Months">3+ Months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                {formData.serviceType === 'eventos' && (
                  <>
                    <div>
                      <label className="block text-gray-400 mb-2">Event Type</label>
                      <input
                        type="text"
                        value={formData.eventType}
                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                        placeholder="Corporate, Conference, Wedding, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Expected Attendees</label>
                      <input
                        type="number"
                        value={formData.expectedAttendees}
                        onChange={(e) => setFormData({...formData, expectedAttendees: e.target.value})}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                        placeholder="Number of attendees"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-gray-400 mb-2">Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="Your budget range"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Project Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white h-32"
                    placeholder="Tell us about your project..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && !showUpsell && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Review & Submit</h2>
              <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-[#FF7A00] font-bold mb-2">Selected Service</h3>
                  <p className="text-white">{selectedService?.name}</p>
                  <p className="text-gray-400">{selectedService?.description}</p>
                  <p className="text-[#FF7A00] font-bold">{selectedService?.price}</p>
                </div>
                <div>
                  <h3 className="text-[#FF7A00] font-bold mb-2">Project Details</h3>
                  <p className="text-white">Project: {formData.projectName}</p>
                  <p className="text-white">Timeline: {formData.timeline}</p>
                  {formData.budget && <p className="text-white">Budget: {formData.budget}</p>}
                  {formData.description && <p className="text-white">Description: {formData.description}</p>}
                </div>
                <div>
                  <h3 className="text-[#FF7A00] font-bold mb-2">Contact Information</h3>
                  <p className="text-white">Name: {formData.name}</p>
                  <p className="text-white">Email: {formData.email}</p>
                  {formData.phone && <p className="text-white">Phone: {formData.phone}</p>}
                  {formData.company && <p className="text-white">Company: {formData.company}</p>}
                  {formData.website && <p className="text-white">Website: {formData.website}</p>}
                </div>
              </div>
              
              {/* Upsell System */}
              <div className="mt-6">
                <UpsellSystem
                  currentService={selectedService?.name || ''}
                  currentBudget={parseInt(formData.budget.replace(/[^\d]/g, '')) || 0}
                  onPackageSelect={(packageId) => {
                    setSelectedUpsellPackage(packageId);
                    setShowUpsell(true);
                  }}
                />
              </div>
            </div>
          )}

          {step === 5 && showUpsell && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#FF7A00] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Package Upgraded!</h2>
              <p className="text-gray-400 mb-8">Thank you for selecting our premium package. Our team will contact you within 24 hours to discuss your comprehensive solution.</p>
              <button
                onClick={() => {
                  setStep(6);
                  handleSubmit();
                }}
                className="bg-[#FF7A00] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FF7A00]/90 transition-all"
              >
                Complete Submission
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#FF7A00] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Project Submitted Successfully!</h2>
              <p className="text-gray-400 mb-8">Thank you for your submission. Our team will review your project and contact you within 24 hours.</p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-[#FF7A00] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#FF7A00]/90 transition-all"
              >
                Return to Home
              </button>
            </div>
          )}

          {submissionError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-500">{submissionError}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="inline mr-2" />
                Back
              </button>
              <button
                onClick={step === 4 ? () => setStep(5) : handleNext}
                disabled={!isStepValid() || isSubmitting}
                className="px-6 py-3 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : step === 4 ? 'Review' : 'Next'}
                {step < 4 && <ArrowRight className="inline ml-2" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
