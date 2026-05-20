'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy } from 'lucide-react';
import { trialService } from '@/services/trialService';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', grade: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await trialService.requestTrial(formData);
      setSubmitted(true);
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', grade: '' });
      }, 5000);
    } catch (err: unknown) {
      console.error('Error submitting trial request:', err);
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to request trial. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="w-full py-4 pr-6 md:pr-12 pl-2 md:pl-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="relative flex items-center justify-start shrink-0 transition-all duration-300 h-12 sm:h-14 md:h-16 w-auto">
            <img
              src="/images/navbarlogo.png"
              alt="PlayFit LMS"
              className="w-auto h-full object-contain max-w-full max-h-full"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 font-medium text-dark-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#trial" className="hover:text-primary-600 transition-colors">Free Trial</a>
          </nav>
          <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
            Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative w-full px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-b from-primary-50 to-white">
          <div className="md:w-1/2 flex flex-col gap-6 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New Courses Available
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-dark-900 leading-tight">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-600">Learning Journey</span> Today.
            </h1>
            <p className="text-lg md:text-xl text-dark-500 leading-relaxed max-w-xl">
              Join PlayFit LMS to access world-class educational materials, expert instructors, and a community dedicated to helping you achieve your goals.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="#trial" className="bg-dark-900 hover:bg-dark-800 text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Start Free Trial
              </a>
              <a href="#features" className="bg-white border-2 border-dark-200 hover:border-primary-500 hover:text-primary-600 text-dark-700 px-8 py-3.5 rounded-full font-semibold text-lg transition-all">
                Learn More
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 relative flex justify-center items-center z-10 w-full max-w-lg">
            <div className="absolute inset-0 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            {/* Abstract Graphic representation */}
            <div className="w-full aspect-square bg-gradient-to-tr from-primary-100 to-secondary-50 rounded-3xl border-8 border-white shadow-2xl overflow-hidden relative flex flex-col">
               <div className="flex-1 w-full bg-primary-50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-secondary-200 rounded-full mix-blend-multiply opacity-70 animate-blob"></div>
                  <div className="absolute top-10 right-10 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-32 h-32 bg-primary-300 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
                  
                  <div className="z-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white flex flex-col gap-4 text-center">
                     <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto shadow-inner text-white">
                        <Trophy size={32} />
                     </div>
                     <div>
                       <h3 className="font-bold text-dark-800 text-xl">Top Rated</h3>
                       <p className="text-dark-500 text-sm">Learning Platform</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="py-20 px-6 bg-white flex flex-col items-center">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-4">Why Choose PlayFit?</h2>
              <p className="text-dark-500 max-w-2xl mx-auto text-lg">Our comprehensive learning management system provides everything you need to succeed.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: "Expert Materials", desc: "Access premium securely protected documents, videos, and interactive content." },
                { icon: Users, title: "Live Instructors", desc: "Learn directly from certified professionals through our interactive portal." },
                { icon: Trophy, title: "Track Progress", desc: "Monitor your learning journey with detailed analytics and milestone tracking." }
              ].map((feature, i) => (
                <div key={i} className="bg-primary-50 rounded-2xl p-8 border border-primary-100 hover:shadow-xl hover:border-primary-300 transition-all group">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-800 mb-3">{feature.title}</h3>
                  <p className="text-dark-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="trial" className="py-24 px-6 bg-dark-900 relative overflow-hidden flex justify-center">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500 rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
          
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 relative z-10 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to transform?</h2>
              <p className="text-dark-200 text-lg md:text-xl leading-relaxed">
                Book a free trial today and get 7 days of unlimited access to our premium course materials and instructor guidance. No credit card required.
              </p>
              <ul className="space-y-4 mt-8">
                {['Personalized skill assessment', 'Access to beginner courses', '1-on-1 instructor consultation', 'Progress tracking dashboard'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark-100">
                    <CheckCircle className="text-primary-400 w-6 h-6 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-border">
              <h3 className="text-2xl font-bold text-text-primary text-center mb-2">Book Your Free Trial</h3>
              <p className="text-center text-sm text-text-muted mb-8">Fill out the form below and we&apos;ll be in touch shortly.</p>
              
              {submitted ? (
                <div className="bg-primary-50 border border-primary-200 text-primary-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Trial Requested!</h4>
                    <p className="text-primary-700">Thanks for reaching out. We'll contact you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-hover text-error text-sm text-center">
                      {error}
                    </div>
                  )}
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </div>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-medium text-text-primary">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Grade field */}
                  <div className="space-y-1.5">
                    <label htmlFor="grade" className="block text-sm font-medium text-text-primary">Grade / Class</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                      <input 
                        type="text" 
                        id="grade" 
                        name="grade"
                        required
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="e.g. 10th Grade"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm mt-6"
                  >
                    {loading ? (
                      'Submitting...'
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        Claim My Free Trial
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-text-muted mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-950 text-dark-400 py-12 px-6 border-t border-dark-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="relative flex items-center justify-center shrink-0 transition-all duration-300 h-10 w-auto">
                <img
                  src="/images/navbarlogo.png"
                  alt="PlayFit LMS"
                  className="w-full h-full object-contain max-w-full max-h-full filter brightness-0 invert"
                />
              </Link>
            </div>
            <p className="max-w-md">Empowering your learning journey through expert-led courses and a supportive community platform.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Instructors</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-dark-800 text-center text-sm">
          &copy; {new Date().getFullYear()} PlayFit LMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
