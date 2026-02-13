import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Zap, Crown, Check } from 'lucide-react';

interface UpsellPackage {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  savings: number;
  features: string[];
  recommended: boolean;
  icon: React.ComponentType<any>;
  description: string;
}

interface UpsellSystemProps {
  currentService: string;
  currentBudget: number;
  onPackageSelect: (packageId: string) => void;
}

export function UpsellSystem({ currentService, currentBudget, onPackageSelect }: UpsellSystemProps) {
  const [recommendedPackages, setRecommendedPackages] = useState<UpsellPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = () => {
      setLoading(true);
      
      const packages: UpsellPackage[] = [];

      // AI Brand Voice upsells
      if (currentService.includes('AI Brand Voice')) {
        packages.push({
          id: 'ai-brand-complete',
          name: 'AI Brand Complete Package',
          price: 5000,
          originalPrice: 8500,
          savings: 41,
          features: [
            'AI Brand Voice & Content Generation',
            'AI Visual Design System',
            'AI Multilingual Communication',
            '3 Months Content Strategy',
            'Priority Support'
          ],
          recommended: currentBudget >= 3000,
          icon: Star,
          description: 'Complete brand transformation with AI-powered voice, visuals, and global communication'
        });
      }

      // AI Business Automation upsells
      if (currentService.includes('AI Business Automation')) {
        packages.push({
          id: 'ai-business-empire',
          name: 'AI Business Empire',
          price: 15000,
          originalPrice: 25000,
          savings: 40,
          features: [
            'AI Business Automation',
            'AI Innovation & Disruption',
            'AI Trend Forecasting',
            'Custom AI Model Development',
            'Enterprise Support'
          ],
          recommended: currentBudget >= 5000,
          icon: Crown,
          description: 'Build an AI-powered business empire with automation, innovation, and trend prediction'
        });
      }

      // Web Design upsells
      if (currentService.includes('Web Design')) {
        packages.push({
          id: 'digital-dominance',
          name: 'Digital Dominance Package',
          price: 7500,
          originalPrice: 13500,
          savings: 44,
          features: [
            'Web Design & Development',
            'AI Brand Voice Basic',
            'AI User Experience Flow',
            'SEO Optimization',
            '6 Months Support'
          ],
          recommended: currentBudget >= 4000,
          icon: Zap,
          description: 'Establish digital dominance with AI-powered design, UX, and brand voice'
        });
      }

      // Cross-service recommendations
      if (currentBudget >= 3000) {
        packages.push({
          id: 'ai-transformation',
          name: 'AI Transformation Bundle',
          price: 10000,
          originalPrice: 18000,
          savings: 44,
          features: [
            'AI Brand Voice & Content',
            'AI Business Automation',
            'AI Visual Design System',
            'AI Trend Forecasting',
            'Complete Integration'
          ],
          recommended: true,
          icon: Crown,
          description: 'Transform your entire business with our comprehensive AI suite'
        });
      }

      // Budget-based recommendations
      if (currentBudget >= 8000) {
        packages.push({
          id: 'enterprise-ai-suite',
          name: 'Enterprise AI Suite',
          price: 25000,
          originalPrice: 50000,
          savings: 50,
          features: [
            'All AI Services (Pro Level)',
            'Custom AI Model Development',
            'Dedicated Infrastructure',
            'White-label Rights',
            'Priority Enterprise Support'
          ],
          recommended: currentBudget >= 10000,
          icon: Crown,
          description: 'Complete enterprise AI solution with custom development and white-label rights'
        });
      }

      setRecommendedPackages(packages);
      setLoading(false);
    };

    generateRecommendations();
  }, [currentService, currentBudget]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
        <div className="text-white text-center">Generating personalized recommendations...</div>
      </div>
    );
  }

  if (recommendedPackages.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🚀 Recommended for You</h3>
        <p className="text-gray-400">
          Based on your interest in <span className="text-[#FF7A00] font-bold">{currentService}</span> 
          {currentBudget > 0 && ` and budget of ${formatCurrency(currentBudget)}`}, 
          {' '}we've curated these packages to maximize your ROI.
        </p>
      </div>

      <div className="space-y-4">
        {recommendedPackages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div
              key={pkg.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all hover:transform hover:scale-102 ${
                pkg.recommended 
                  ? 'border-[#FF7A00] bg-[#FF7A00]/5' 
                  : 'border-white/20 bg-white/5'
              }`}
              onClick={() => onPackageSelect(pkg.id)}
            >
              {pkg.recommended && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-[#FF7A00]" />
                  <span className="text-[#FF7A00] font-bold text-sm">RECOMMENDED</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#FF7A00]/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#FF7A00]" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{pkg.description}</p>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <span className="text-2xl font-bold text-white">{formatCurrency(pkg.price)}</span>
                      <span className="text-gray-400 line-through ml-2">{formatCurrency(pkg.originalPrice)}</span>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-bold">
                      Save {pkg.savings}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-white font-bold mb-2">What's included:</h5>
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-bold hover:bg-[#FF7A00]/90 transition-all flex items-center justify-center gap-2"
                onClick={() => onPackageSelect(pkg.id)}
              >
                Select This Package
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-[#FF7A00]" />
          <span className="text-[#FF7A00] font-bold">Limited Time Offer</span>
        </div>
        <p className="text-white text-sm">
          These special packages are available for the next 48 hours. Save up to 50% on comprehensive AI solutions.
        </p>
      </div>
    </div>
  );
}
