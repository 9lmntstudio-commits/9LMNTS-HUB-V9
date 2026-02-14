'use client';

import React, { useState } from 'react';

export default function AIservicepage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const services = [
    {
      id: 'ai-brand-voice',
      name: 'AI Brand Voice',
      price: 2000,
      description: 'AI-powered content strategy, automated social media management, brand voice consistency',
      features: [
        'Automated content creation',
        'Social media management',
        'Brand voice consistency',
        'Content strategy development',
        'Performance analytics'
      ],
      paypalLink: 'https://PayPal.Me/9LMNTSSTUDIO/2000'
    },
    {
      id: 'web-design',
      name: 'Web Design',
      price: 1500,
      description: 'Modern, responsive design, AI integration, SEO optimization',
      features: [
        'Responsive design',
        'AI integration',
        'SEO optimization',
        'Mobile-first approach',
        'Fast loading speeds'
      ],
      paypalLink: 'https://PayPal.Me/9LMNTSSTUDIO/1500'
    },
    {
      id: 'ai-automation',
      name: 'AI Business Automation',
      price: 3000,
      description: 'Complete workflow automation, process optimization, revenue acceleration',
      features: [
        'Workflow automation',
        'Process optimization',
        'Revenue acceleration',
        'AI integration',
        'Performance monitoring'
      ],
      paypalLink: 'https://PayPal.Me/9LMNTSSTUDIO/3000'
    },
    {
      id: 'eventos',
      name: 'EventOS Platform',
      price: 1000,
      description: 'Event management automation, AI-powered operations, white-label rights',
      features: [
        'Event management',
        'AI-powered operations',
        'White-label rights',
        'Ticket management',
        'Analytics dashboard'
      ],
      paypalLink: 'https://PayPal.Me/9LMNTSSTUDIO/1000'
    },
    {
      id: 'custom-ai',
      name: 'Custom AI Development',
      price: 5000,
      description: 'Tailored AI solutions, custom development, enterprise integration',
      features: [
        'Custom AI solutions',
        'Enterprise integration',
        'Dedicated support',
        'Scalable architecture',
        'Custom training'
      ],
      paypalLink: 'https://PayPal.Me/9LMNTSSTUDIO/5000'
    }
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Send to n8n webhook
    fetch('https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        source: 'ai-service-page',
        timestamp: new Date().toISOString()
      })
    })
    .then(response => response.json())
    .then(data => {
      alert('Thank you for your inquiry! We will contact you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    })
    .catch(error => {
      alert('Error submitting form. Please contact us directly at 9lmntstudio@gmail.com');
    });
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🤖 9LMNTS STUDIO AI</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI POWERED SOLUTIONS
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your business with cutting-edge AI automation. 
            Complete workflow automation, process optimization, and revenue acceleration.
          </p>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-red-600 mb-2">🔥 LIMITED TIME OFFER</h3>
            <p className="text-red-700 font-semibold">
              20% OFF all services $3,000+ - Use code: AI20
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">AI Services</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 text-3xl mb-4">
                  {service.id === 'ai-brand-voice' && '🤖'}
                  {service.id === 'web-design' && '🎨'}
                  {service.id === 'ai-automation' && '⚡'}
                  {service.id === 'eventos' && '🎯'}
                  {service.id === 'custom-ai' && '🚀'}
                </div>
                <h4 className="text-xl font-bold mb-4">{service.name}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-2xl font-bold text-blue-600 mb-4">
                  ${service.price.toLocaleString()}
                </div>
                
                <a 
                  href={service.paypalLink}
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Start Your AI Journey</h3>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Service Interest *</label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start AI Transformation
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h4 className="text-xl font-bold mb-6">Get in Touch</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-3">📧</span>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-gray-600">9lmntstudio@gmail.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-green-600 mr-3">📞</span>
                    <div>
                      <div className="font-semibold">Phone</div>
                      <div className="text-gray-600">(343) 262-8842</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-purple-600 mr-3">🌐</span>
                    <div>
                      <div className="font-semibold">Website</div>
                      <div className="text-gray-600">9lmntsstudio.com</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-bold mb-2">🎉 ACT NOW - AUTOMATION STARTS IMMEDIATELY!</h5>
                  <p className="text-sm text-gray-600">
                    Contact us today and start your AI-powered business transformation. 
                    All services include immediate setup and ongoing support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2024 9LMNTS STUDIO. All rights reserved.</p>
            <p className="mt-2 text-gray-400">
              AI-powered automation solutions for modern businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
