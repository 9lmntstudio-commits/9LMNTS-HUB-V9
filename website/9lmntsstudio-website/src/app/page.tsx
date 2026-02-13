'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send to n8n webhook
    fetch('https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        source: 'website',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
              <h1 className="text-2xl font-bold text-gray-900">🚀 9LMNTS STUDIO</h1>
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
            Get your business automated with our cutting-edge AI services. 
            Complete workflow automation, process optimization, and revenue acceleration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://PayPal.Me/9LMNTSSTUDIO/2000"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started - AI Brand Voice $2,000
            </a>
            <a 
              href="https://PayPal.Me/9LMNTSSTUDIO/3000"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Premium Automation $3,000
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Brand Voice */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-blue-600 text-3xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-4">AI Brand Voice</h4>
              <p className="text-gray-600 mb-4">AI-powered content strategy, automated social media management, brand voice consistency</p>
              <div className="text-2xl font-bold text-blue-600">$2,000</div>
              <a href="https://PayPal.Me/9LMNTSSTUDIO/2000" 
                 className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Get Started
              </a>
            </div>

            {/* Web Design */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-3xl mb-4">🎨</div>
              <h4 className="text-xl font-bold mb-4">Web Design</h4>
              <p className="text-gray-600 mb-4">Modern, responsive design, AI integration, SEO optimization</p>
              <div className="text-2xl font-bold text-green-600">$1,500</div>
              <a href="https://PayPal.Me/9LMNTSSTUDIO/1500" 
                 className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Get Started
              </a>
            </div>

            {/* AI Business Automation */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-purple-600 text-3xl mb-4">⚡</div>
              <h4 className="text-xl font-bold mb-4">AI Business Automation</h4>
              <p className="text-gray-600 mb-4">Complete workflow automation, process optimization, revenue acceleration</p>
              <div className="text-2xl font-bold text-purple-600">$3,000</div>
              <a href="https://PayPal.Me/9LMNTSSTUDIO/3000" 
                 className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                Get Started
              </a>
            </div>

            {/* EventOS Platform */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-orange-600 text-3xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-4">EventOS Platform</h4>
              <p className="text-gray-600 mb-4">Event management automation, AI-powered operations, white-label rights</p>
              <div className="text-2xl font-bold text-orange-600">$1,000</div>
              <a href="https://PayPal.Me/9LMNTSSTUDIO/1000" 
                 className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
                Get Started
              </a>
            </div>

            {/* Special Offer */}
            <div className="bg-gray-50 p-8 rounded-lg border-2 border-red-200">
              <div className="text-red-600 text-3xl mb-4">🔥</div>
              <h4 className="text-xl font-bold mb-4">SPECIAL OFFER</h4>
              <p className="text-gray-600 mb-4">20% OFF projects $3,000+. Premium packages, enterprise solutions, custom AI development</p>
              <div className="text-2xl font-bold text-red-600">Save 20%</div>
              <a href="https://PayPal.Me/9LMNTSSTUDIO/2400" 
                 className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                Get Discount
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Contact Us</h3>
          
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
                    <option value="ai-brand-voice">AI Brand Voice - $2,000</option>
                    <option value="web-design">Web Design - $1,500</option>
                    <option value="ai-automation">AI Business Automation - $3,000</option>
                    <option value="eventos">EventOS Platform - $1,000</option>
                    <option value="custom">Custom Solution</option>
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
                  Send Message
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
