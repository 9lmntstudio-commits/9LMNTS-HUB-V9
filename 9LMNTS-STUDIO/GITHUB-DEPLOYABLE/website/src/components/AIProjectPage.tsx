import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Calendar, Mail, Phone, User, Building2, Globe, MessageSquare } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { submitToLOA, qualifyLead, AIProjectData } from '../services/loaApi';

interface AIProjectPageProps {
  selectedPlan?: string;
  onNavigate: (page: string) => void;
}

export function AIProjectPage({ selectedPlan, onNavigate }: AIProjectPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    plan: selectedPlan || '',
    projectType: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    description: '',
    budget: '',
  });

  const plans = [
    { name: 'AI Brand Voice & Content Generation', price: 'From $2,500', value: 'ai-brand-voice', description: 'MCing Element - Custom GPT that creates content in your brand voice' },
    { name: 'AI User Experience Flow', price: 'From $3,000', value: 'ai-ux-flow', description: 'DJing Element - AI-powered UX optimization and personalization' },
    { name: 'AI Visual Design System', price: 'From $2,000', value: 'ai-visual-design', description: 'Graffiti Element - AI logo and brand identity generation' },
    { name: 'AI Innovation & Disruption', price: 'From $1,500', value: 'ai-innovation', description: 'Breaking Element - AI trend prediction and competitive intelligence' },
    { name: 'AI Interaction & Animation', price: 'From $2,000', value: 'ai-interaction', description: 'Beatboxing Element - AI-powered interactions and real-time animation' },
    { name: 'AI Content & Learning Systems', price: 'From $1,000', value: 'ai-content-learning', description: 'Knowledge Element - AI-powered content curation and learning' },
    { name: 'AI Trend Forecasting', price: 'From $2,500', value: 'ai-trend-forecasting', description: 'Fashion Element - Real-time trend prediction and style adaptation' },
    { name: 'AI Business Automation', price: 'From $3,000', value: 'ai-business-automation', description: 'Entrepreneurship Element - AI workflow automation and optimization' },
    { name: 'AI Multilingual Communication', price: 'From $3,500', value: 'ai-multilingual', description: 'Language Element - AI translation and cultural adaptation' },
  ];

  const projectTypes = [
    'AI Brand Voice & Content Generation',
    'AI User Experience Flow',
    'AI Visual Design System',
    'AI Innovation & Disruption',
    'AI Interaction & Animation',
    'AI Content & Learning Systems',
    'AI Trend Forecasting',
    'AI Business Automation',
    'AI Multilingual Communication',
    'Custom AI Solution',
  ];

  const timelines = [
    'ASAP (Rush)',
    '2-4 Weeks',
    '1-2 Months',
    '2-3 Months',
    '3+ Months',
    'Flexible',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
      // Prepare data for LOA API
      const loaData: AIProjectData = {
        service_type: formData.plan,
        project_name: formData.projectType || `AI ${formData.plan.replace('-', ' ')} Project`,
        contact_email: formData.email,
        contact_name: formData.name,
        company: formData.company,
        phone: formData.phone,
        website: formData.website,
        timeline: formData.timeline,
        budget: formData.budget ? parseInt(formData.budget) : 2500,
        description: formData.description,
        requirements: formData.description, // Reuse description as requirements
        challenges: "Looking for AI transformation" // Default challenge
      };

      // Send to LOA API
      const result = await submitToLOA(loaData, 'ai');
      
      if (result.success) {
        // Get AI qualification from LOA
        const qualification = await qualifyLead(loaData, 'ai');
        
        if (qualification) {
          console.log('🎯 AI Qualification Score:', qualification.qualification.score);
          console.log('💰 Estimated Value:', qualification.qualification.estimated_value);
          
          // Store qualification in localStorage for admin dashboard
          const submissions = JSON.parse(localStorage.getItem('ai_project_submissions') || '[]');
          submissions.push({
            ...loaData,
            id: result.tracking_id,
            status: 'pending',
            qualification_score: qualification.qualification.score,
            estimated_value: qualification.qualification.estimated_value,
            created_at: new Date().toISOString()
          });
          localStorage.setItem('ai_project_submissions', JSON.stringify(submissions));
        }
        
        setStep(5); // Show success
      } else {
        setSubmissionError('Failed to submit to LOA system. Please try again.');
      }
      
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmissionError('An unexpected error occurred. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true; // Step 1 is just review of selected plan
      case 2:
        return formData.plan !== '' && formData.projectType !== '' && formData.timeline !== '';
      case 3:
        return formData.name !== '' && formData.email !== '';
      default:
        return true;
    }
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-[#FF7A00] rounded-full flex items-center justify-center">
              <Check size={40} className="text-[#1A1A1A]" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl text-white mb-6">
            <span className="font-futuristic">AI Project</span>{' '}
            <span className="font-graffiti text-[#FF7A00]">Submitted!</span>
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Thank you for choosing 9LMNTS Studio! We've received your AI project details.
          </p>
          <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-lg p-4 mb-6">
            <p className="text-[#FF7A00] font-bold">✅ Confirmation email sent to {formData.email}</p>
            <p className="text-white text-sm mt-2">Check your inbox for next steps and timeline information</p>
          </div>
          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-8 mb-8">
            <h3 className="text-white text-xl mb-4">What Happens Next?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">1</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">AI Strategy Review</h4>
                  <p className="text-gray-400 text-sm">We'll analyze your AI requirements and prepare a tailored implementation plan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">2</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">AI Discovery Call</h4>
                  <p className="text-gray-400 text-sm">Schedule a free consultation to discuss your AI vision in detail</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">3</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">AI Proposal & Timeline</h4>
                  <p className="text-gray-400 text-sm">Receive a detailed proposal with AI scope, timeline, and investment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">4</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">AI Implementation</h4>
                  <p className="text-gray-400 text-sm">Start bringing your AI vision to life with 9LMNTS process</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-4 bg-[#FF7A00] text-[#1A1A1A] rounded-lg hover:bg-[#FF7A00]/90 transition-all inline-flex items-center gap-2"
          >
            Back to Home
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl text-white mb-4">
            <span className="font-futuristic">Start Your</span>{' '}
            <span className="font-graffiti text-[#FF7A00]">AI Project</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Let's bring your AI vision to life in {4 - step + 1} simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= num
                      ? 'bg-[#FF7A00] text-[#1A1A1A]'
                      : 'bg-[#222222] text-gray-400 border border-[#FF7A00]/20'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-0.5 transition-all ${
                    step > num ? 'bg-[#FF7A00]' : 'bg-[#222222]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Select Plan</span>
            <span>Project Details</span>
            <span>Contact Info</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step 1: Select AI Plan */}
        {step === 1 && (
          <div className="bg-[#222222] rounded-lg p-8 mb-8">
            <h2 className="text-2xl text-white mb-6">Choose Your AI Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.value}
                  onClick={() => handleInputChange('plan', plan.value)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.plan === plan.value
                      ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                      : 'border-[#333333] hover:border-[#FF7A00]/50'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-[#FF7A00] text-xl font-bold mb-2">{plan.price}</p>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <button
                    onClick={() => handleInputChange('plan', plan.value)}
                    className="w-full px-4 py-2 bg-[#FF7A00] text-[#1A1A1A] rounded hover:bg-[#FF7A00]/90 transition-all"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {step === 2 && (
          <div className="bg-[#222222] rounded-lg p-8 mb-8">
            <h2 className="text-2xl text-white mb-6">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">AI Service Type</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                >
                  <option value="">Select AI Service</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                >
                  <option value="">Select Timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-gray-400 mb-2">Project Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your AI project requirements..."
                rows={4}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="bg-[#222222] rounded-lg p-8 mb-8">
            <h2 className="text-2xl text-white mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="bg-[#222222] rounded-lg p-8 mb-8">
            <h2 className="text-2xl text-white mb-6">Review Your AI Project</h2>
            <div className="bg-[#1A1A1A] rounded-lg p-6 mb-6">
              <h3 className="text-lg text-white mb-4">Project Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Service:</span>
                  <span className="text-white">{formData.plan || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Project Type:</span>
                  <span className="text-white">{formData.projectType || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Timeline:</span>
                  <span className="text-white">{formData.timeline || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{formData.name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{formData.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white">{formData.company || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Website:</span>
                  <span className="text-white">{formData.website || 'Not provided'}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-lg p-4 mb-6">
              <p className="text-[#FF7A00] font-bold">🤖 Ready to Transform with AI?</p>
              <p className="text-white text-sm mt-2">Click submit to start your AI journey with 9LMNTS Studio</p>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-[#FF7A00] text-[#1A1A1A] rounded-lg hover:bg-[#FF7A00]/90 transition-all font-semibold"
            >
              Submit AI Project
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg transition-all ${
              step === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#222222] text-white hover:bg-[#333333]'
            }`}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`px-6 py-3 rounded-lg transition-all flex items-center ${
              isStepValid()
                ? 'bg-[#FF7A00] text-[#1A1A1A] hover:bg-[#FF7A00]/90'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === 4 ? 'Submit' : 'Next'}
            {step < 4 && <ArrowRight size={20} className="ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}
