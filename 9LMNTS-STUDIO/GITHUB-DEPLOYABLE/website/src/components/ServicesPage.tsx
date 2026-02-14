import { Mic2, Disc3, Paintbrush, Users, Radio, BookOpen, Lightbulb, Code, Palette, Brain, Zap, Globe, TrendingUp, Target, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ServicesPageProps {
  onNavigate: (page: string, plan?: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const services = [
    {
      id: 'ai-brand',
      icon: Brain,
      title: 'AI Brand Voice & Content Generation',
      subtitle: 'MCing Element - Custom GPT that creates content in your brand voice',
      description: 'Transform your brand with AI-powered voice training, automated content creation, and multi-platform consistency.',
      price: 'From $2,500',
      features: ['Custom GPT Training', 'Automated Content', 'Brand Voice AI'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1730463527127-7c6c1c1faf6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwcmFwcGVyJTIwc3R1ZGlvfGVufDF8fHx8MTc2NDcxODYyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-ux',
      icon: Zap,
      title: 'AI User Experience Flow',
      subtitle: 'DJing Element - AI-powered UX optimization and personalization',
      description: 'Behavioral pattern analysis, dynamic user journey optimization, and AI-driven A/B testing for maximum conversion.',
      price: 'From $3,000',
      features: ['UX Pattern Analysis', 'Journey Optimization', 'AI Personalization'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1600542552868-56ed242290e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm5hYmxlJTIwZGF0YWJhc2UlMjBtaXhpbmclMjBkYXRhfGVufDF8fHx8MTc2NDcxODYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-visual',
      icon: Palette,
      title: 'AI Visual Design System',
      subtitle: 'Graffiti Element - AI logo and brand identity generation',
      description: 'AI-powered logo generation, brand consistency checking, and dynamic visual adaptation for unlimited design variations.',
      price: 'From $2,000',
      features: ['AI Logo Generation', 'Brand Identity', 'Visual Consistency'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1628522994788-53bc1b1502c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHN0cmVldCUyMGFydHxlbnwxfHx8fDE3NjQ4MzQ0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-innovation',
      icon: TrendingUp,
      title: 'AI Innovation & Disruption',
      subtitle: 'Breaking Element - AI trend prediction and competitive intelligence',
      description: 'Market trend analysis, automated competitive intelligence, and disruptive strategy generation for market leadership.',
      price: 'From $1,500',
      features: ['Trend Analysis', 'Competitive Intelligence', 'Innovation Reports'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1588671815815-b0cd3a9189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2RhbmNpbmclMjB1cmJhbiUyMGRhbmNlfGVufDF8fHx8MTc2NDcxODYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-animation',
      icon: Radio,
      title: 'AI Interaction & Animation',
      subtitle: 'Beatboxing Element - AI-powered interactions and real-time animation',
      description: 'Voice interaction design, real-time animation generation, and AI avatars for immersive user experiences.',
      price: 'From $2,000',
      features: ['Voice Interaction', 'Animation Generation', 'AI Avatars'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y3Rpb24lMjBzdHVkeW98ZW58MXx8fHwxNzY0NjczNTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-learning',
      icon: BookOpen,
      title: 'AI Content & Learning Systems',
      subtitle: 'Knowledge Element - AI-powered content curation and learning',
      description: 'AI content curation, personalized learning paths, and automated knowledge base creation for intelligent content management.',
      price: 'From $1,000',
      features: ['Content Curation', 'Learning Paths', 'AI Knowledge Base'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1760869028443-07e914573a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGxpYnJhcnklMjBvb29rc3xlbnwxfHx8fDE3NjQ3MTg2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-trend',
      icon: Lightbulb,
      title: 'AI Trend Forecasting',
      subtitle: 'Fashion Element - Real-time trend prediction and style adaptation',
      description: 'Real-time trend analysis, style recommendation engine, and automated aesthetic updates for staying ahead of the curve.',
      price: 'From $2,500',
      features: ['Trend Prediction', 'Style Recommendations', 'Aesthetic Updates'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1635650805015-2fa50682873a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMHVyYmFufGVufDF8fHx8MTc2NDcxNjE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-automation',
      icon: Code,
      title: 'AI Business Automation',
      subtitle: 'Entrepreneurship Element - AI workflow automation and optimization',
      description: 'AI workflow automation, business process optimization, and automated decision making for scalable growth.',
      price: 'From $3,000',
      features: ['Workflow Automation', 'Process Optimization', 'AI Decision Making'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1540397106260-e24a507a08ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2NDcxODYyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ai-multilingual',
      icon: Globe,
      title: 'AI Multilingual Communication',
      subtitle: 'Language Element - AI translation and cultural adaptation',
      description: 'Real-time translation, cultural adaptation, and AI-powered localization for global brand communication.',
      price: 'From $3,500',
      features: ['Real-time Translation', 'Cultural Adaptation', 'AI Localization'],
      color: '#FF7A00',
      category: 'ai-service',
      image: 'https://images.unsplash.com/photo-1523837157348-ffbdaccfc7de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXBvZ3JhcGh5JTIwZGVzaWduJTIwY3JlYXRpdmU8ZW58MXx8fHwxNzY0NjYxNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="px-4 py-2 bg-[#222222] border border-[#FF7A00]/30 rounded-full text-[#FF7A00] text-sm">
              Our Services
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
            <span className="font-futuristic">The Nine Pillars of</span><br />
            <span className="font-graffiti text-[#FF7A00]">AI-Powered Digital Dominance</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Each pillar represents a core discipline of Hip-Hop culture, 
            reimagined with cutting-edge AI for business transformation
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  onClick={() => onNavigate('start-project', service.id)}
                  className="group bg-[#222222] rounded-lg border border-[#FF7A00]/20 hover:border-[#FF7A00] transition-all hover:transform hover:scale-105 cursor-pointer overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-[#222222]/50 to-transparent"></div>
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-4 right-4 p-3 bg-[#FF7A00] rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="text-[#1A1A1A]" size={24} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-white text-xl mb-3 group-hover:text-[#FF7A00] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                      {service.subtitle}
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-[#00D4FF] font-semibold">{service.price}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-[#222222] border border-[#FF7A00]/20 rounded text-xs text-gray-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl text-white mb-4">
              <span className="font-futuristic">Our</span> <span className="font-graffiti text-[#FF7A00]">AI Sales Process</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Automated lead generation, qualification, and closing - 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'AI Lead Scraping', desc: '24/7 automated lead generation and qualification' },
              { step: '02', title: 'AI Proposal Generation', desc: 'Instant AI-powered proposals and pricing' },
              { step: '03', title: 'AI Service Delivery', desc: 'Automated setup and deployment of AI services' },
              { step: '04', title: 'Revenue Collection', desc: 'Automated invoicing and payment processing' },
            ].map((phase, index) => (
              <div key={index} className="relative">
                <div className="text-6xl text-[#FF7A00]/20 mb-4">{phase.step}</div>
                <h3 className="text-white text-xl mb-2">{phase.title}</h3>
                <p className="text-gray-400">{phase.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-[#FF7A00]/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl text-white mb-6">
            <span className="font-futuristic">Ready to Build Your</span><br />
            <span className="font-graffiti text-[#FF7A00]">AI Empire?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Let's transform your business with Nine Pillars AI services and start generating revenue immediately
          </p>
          <button
            onClick={() => onNavigate('start-project')}
            className="px-8 py-4 bg-[#FF7A00] text-[#1A1A1A] rounded-lg hover:bg-[#FF7A00]/90 transition-all transform hover:scale-105"
          >
            Start Your AI Transformation
          </button>
        </div>
      </section>
    </div>
  );
}