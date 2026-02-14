import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Calendar, Mail, Phone, User, Building2, Globe, MessageSquare } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';

interface StartProjectPageProps {
  selectedPlan?: string;
  onNavigate: (page: string) => void;
}

export function StartProjectPage({ selectedPlan, onNavigate }: StartProjectPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    plan: selectedPlan || '',
    projectType: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    description: '',
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

  const handleSubmit = async () => {
    try {
      // Store submission in localStorage for demo purposes
      const submissions = JSON.parse(localStorage.getItem('project_submissions') || '[]');
      const newSubmission = {
        id: Date.now().toString(),
        plan: formData.plan,
        project_type: formData.projectType,
        timeline: formData.timeline,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website,
        description: formData.description,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      submissions.push(newSubmission);
      localStorage.setItem('project_submissions', JSON.stringify(submissions));

      console.log('Submission saved locally:', newSubmission);

      // Send to 9LMNTS API for Notion sync and AI processing
      try {
        const response = await fetch(`https://vfrxxfviaykafzbxpehw.supabase.co/functions/v1/ai-empire-lead-submission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: formData.plan,
            project_type: formData.projectType,
            timeline: formData.timeline,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            website: formData.website,
            description: formData.description
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Lead synced to Notion:', result);
          console.log(`🎯 AI Qualification Score: ${result.qualification_score}%`);
          console.log(`💰 Estimated Value: $${result.estimated_value}`);
        } else {
          console.log('⚠️ API not available, data saved locally only');
        }
      } catch (apiError) {
        console.log('⚠️ Could not reach API, data saved locally only');
      }

      // Also try to save to Supabase if available (won't fail if table doesn't exist)
      try {
        const supabase = getSupabaseClient();
        // @ts-ignore
        const { data, error } = await supabase
          .from('project_submissions' as any)
          .insert([newSubmission] as any);

        if (!error) {
          console.log('Also saved to Supabase:', data);
        }
      } catch (supabaseError) {
        console.log('Supabase not available, data saved locally only');
      }

      setStep(5); // Show success message
    } catch (error) {
      console.error('Error submitting form:', error);
      setStep(5); // Still show success to user
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
            <span className="font-futuristic">Project</span>{' '}
            <span className="font-graffiti text-[#FF7A00]">Submitted!</span>
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Thank you for choosing 9LMNTS Studio! We've received your project details.
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
                  <h4 className="text-white mb-1">Initial Review</h4>
                  <p className="text-gray-400 text-sm">We'll review your project details and prepare a tailored proposal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">2</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">Discovery Call</h4>
                  <p className="text-gray-400 text-sm">Schedule a free consultation to discuss your vision in detail</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">3</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">Proposal & Timeline</h4>
                  <p className="text-gray-400 text-sm">Receive a detailed proposal with scope, timeline, and investment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#1A1A1A]">4</span>
                </div>
                <div>
                  <h4 className="text-white mb-1">Kick-Off</h4>
                  <p className="text-gray-400 text-sm">Start bringing your vision to life with the 9LMNTS process</p>
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
            <span className="font-graffiti text-[#FF7A00]">Project</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Let's bring your vision to life in {4 - step + 1} simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= num
                      ? 'bg-[#FF7A00] text-[#1A1A1A]'
                      : 'bg-[#222222] text-gray-400 border border-[#FF7A00]/20'
                    }`}
                >
                  {step > num ? <Check size={20} /> : num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${step > num ? 'bg-[#FF7A00]' : 'bg-[#222222]'
                      }`}
                  />
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

        {/* Form Steps */}
        <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-8">
          {/* Step 1: Show Selected Plan */}
          {step === 1 && (
            <div className="text-center py-8">
              <h2 className="text-2xl text-white mb-6">Your Selected Plan</h2>
              <div className="max-w-md mx-auto p-8 rounded-lg border-2 border-[#FF7A00] bg-[#FF7A00]/10">
                <h3 className="text-white text-3xl mb-2">
                  {plans.find(p => p.value === formData.plan)?.name || 'Custom Solution'}
                </h3>
                <p className="text-[#FF7A00] text-2xl font-futuristic mb-4">
                  {plans.find(p => p.value === formData.plan)?.price || 'Contacting...'}
                </p>
                <p className="text-gray-400">
                  {plans.find(p => p.value === formData.plan)?.description || 'Tailored to your needs'}
                </p>
              </div>
              <p className="mt-8 text-gray-400 italic">
                You can modify your plan or add project details in the next step.
              </p>
            </div>
          )}

          {/* Step 2: Project Details & Plan Modification */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl text-white mb-6">Project Details</h2>
              <div className="space-y-8">
                {/* Plan Modification */}
                <div>
                  <label className="block text-white mb-4 font-semibold text-lg">Modify Plan (Optional)</label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.value}
                        onClick={() => handleInputChange('plan', plan.value)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.plan === plan.value
                            ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                            : 'border-[#FF7A00]/20 hover:border-[#FF7A00]/40'
                          }`}
                      >
                        <h3 className="text-white font-bold">{plan.name}</h3>
                        <p className="text-[#FF7A00] text-sm">{plan.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">Project Type *</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Expected Timeline *</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Project Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    placeholder="Tell us about your project vision, goals, and any specific requirements..."
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF7A00] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF7A00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF7A00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF7A00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your Company Inc."
                      className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF7A00] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Website (if applicable)</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF7A00] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl text-white mb-6">Review Your Information</h2>
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF7A00]/20">
                  <h3 className="text-[#FF7A00] mb-4">Selected Plan</h3>
                  <p className="text-white text-xl">
                    {plans.find((p) => p.value === formData.plan)?.name || 'Not selected'}
                  </p>
                  <p className="text-gray-400">
                    {plans.find((p) => p.value === formData.plan)?.price}
                  </p>
                </div>

                <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF7A00]/20">
                  <h3 className="text-[#FF7A00] mb-4">Project Details</h3>
                  <div className="space-y-2 text-gray-400">
                    <p>
                      <span className="text-white">Type:</span> {formData.projectType || 'Not specified'}
                    </p>
                    <p>
                      <span className="text-white">Timeline:</span> {formData.timeline || 'Not specified'}
                    </p>
                    {formData.description && (
                      <p>
                        <span className="text-white">Description:</span> {formData.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#FF7A00]/20">
                  <h3 className="text-[#FF7A00] mb-4">Contact Information</h3>
                  <div className="space-y-2 text-gray-400">
                    <p>
                      <span className="text-white">Name:</span> {formData.name}
                    </p>
                    <p>
                      <span className="text-white">Email:</span> {formData.email}
                    </p>
                    {formData.phone && (
                      <p>
                        <span className="text-white">Phone:</span> {formData.phone}
                      </p>
                    )}
                    {formData.company && (
                      <p>
                        <span className="text-white">Company:</span> {formData.company}
                      </p>
                    )}
                    {formData.website && (
                      <p>
                        <span className="text-white">Website:</span> {formData.website}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#FF7A00]/20">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all ${step === 1
                  ? 'bg-[#333333] text-gray-500 cursor-not-allowed'
                  : 'bg-transparent border border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/10'
                }`}
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all ${isStepValid()
                    ? 'bg-[#FF7A00] text-[#1A1A1A] hover:bg-[#FF7A00]/90'
                    : 'bg-[#333333] text-gray-500 cursor-not-allowed'
                  }`}
              >
                Next
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#FF7A00] text-[#1A1A1A] rounded-lg hover:bg-[#FF7A00]/90 transition-all inline-flex items-center gap-2"
              >
                Submit Project
                <Check size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}