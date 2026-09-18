'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BookOpen, Users, Trophy, Star, Menu, X, Target, Mail, Phone, Heart, Zap } from 'lucide-react';
import { instructorRegistrationService } from '@/services/instructorRegistrationService';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', qualification: '', subject: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await instructorRegistrationService.registerInstructor(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', qualification: '', subject: '', phone: '' });
      }, 5000);
    } catch (err: unknown) {
      console.error('Error submitting instructor registration:', err);
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to submit registration. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-200 safe-top shadow-lg shadow-purple-500/10">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-16 lg:h-18 xl:h-20">
            <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
              <img
                src="/logo.jpg"
                alt="Playfit"
                className="h-7 sm:h-9 md:h-11 lg:h-13 xl:h-15 w-auto object-contain max-w-[100px] xs:max-w-[110px] sm:max-w-[130px] md:max-w-[160px] transition-transform hover:scale-105"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-5">
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, 'features')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <a 
                href="#apply" 
                onClick={(e) => scrollToSection(e, 'apply')}
                className="text-xs lg:text-sm xl:text-base font-bold text-gray-700 hover:text-purple-600 transition-all hover:scale-105 whitespace-nowrap relative group px-1 lg:px-2 cursor-pointer"
              >
                Apply Now
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
              </a>
              <Link href="/login" className="ml-1 lg:ml-2 xl:ml-3 px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white text-xs lg:text-sm xl:text-base font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl whitespace-nowrap shadow-purple-500/40">
                Login
              </Link>
            </nav>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-200 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="px-3 sm:px-4 py-3 space-y-2 max-w-md mx-auto">
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, 'features')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Contact
              </a>
              <a 
                href="#apply" 
                onClick={(e) => scrollToSection(e, 'apply')}
                className="block py-3 px-4 text-sm font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all touch-target active:scale-95 cursor-pointer"
              >
                Apply Now
              </a>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-sm font-bold rounded-lg text-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all mt-2 touch-target shadow-lg shadow-purple-500/40 active:scale-95">
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-white py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Join 500+ Instructors</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Teaching Career
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Teach live online classes in subjects you love. Share your expertise in Art, Chess, Piano, Public Speaking, Abacus, and more. Make a real impact on students' lives while earning competitively.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="#apply"
                  onClick={(e) => scrollToSection(e, 'apply')}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-base font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105 cursor-pointer"
                >
                  Apply to Teach
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link 
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 text-base font-semibold rounded-lg hover:border-gray-300 hover:shadow-lg transition-all"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-6 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-bold text-gray-900">4.9</span>
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image/Visual */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <Users className="w-12 h-12 mb-3" />
                    <p className="text-sm font-semibold text-center">Live Classes</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <Trophy className="w-12 h-12 mb-3" />
                    <p className="text-sm font-semibold text-center">Earn More</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <Target className="w-12 h-12 mb-3" />
                    <p className="text-sm font-semibold text-center">Flexible Hours</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <BookOpen className="w-12 h-12 mb-3" />
                    <p className="text-sm font-semibold text-center">11+ Subjects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Teach With Playfit
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of expert instructors and make a real impact on students' lives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Flexible Schedule",
                description: "Set your own availability and teach at times that work best for you",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Competitive Earnings",
                description: "Earn competitive rates with performance-based bonuses and incentives",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Teaching Support",
                description: "Access lesson planning tools, resources, and dedicated instructor support",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Live Platform",
                description: "State-of-the-art video platform with interactive tools and whiteboards",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "11+ Subjects",
                description: "Teach Art, Chess, Piano, Public Speaking, Abacus, and more",
                color: "from-amber-500 to-orange-500"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Make an Impact",
                description: "Inspire students and help them build confidence and essential skills",
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, i) => (
              <div key={i} className="relative h-full">
                <div className="h-full bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-gray-200 transition-all hover:shadow-lg flex flex-col">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Getting Started is Simple
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join our teaching platform in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Apply Online",
                description: "Submit your application with your qualifications and teaching experience",
                icon: <BookOpen className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02",
                title: "Get Approved",
                description: "Our team reviews your application within 48 hours",
                icon: <CheckCircle className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Start Teaching",
                description: "Set your schedule and begin inspiring students with your expertise",
                icon: <Zap className="w-8 h-8" />,
                color: "from-orange-500 to-red-500"
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-gray-400 mb-2">STEP {item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="#apply"
              onClick={(e) => scrollToSection(e, 'apply')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 shadow-xl cursor-pointer"
            >
              Apply Now
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
              <span className="text-sm font-semibold text-purple-900">Instructor Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Instructors Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from instructors who've transformed their teaching careers with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Prof. Ananya Sharma", 
                location: "Mumbai", 
                course: "Art Instructor", 
                quote: "Teaching on Playfit has been incredibly rewarding! The platform is intuitive, students are engaged, and I love the flexibility.",
                rating: 5,
                avatar: "🎨"
              },
              { 
                name: "Rohan Patel", 
                location: "Delhi", 
                course: "Chess Expert", 
                quote: "I've taught 200+ students so far! The earning potential is great, and seeing my students win tournaments makes it worthwhile.",
                rating: 5,
                avatar: "♟️"
              },
              { 
                name: "Dr. Priya Reddy", 
                location: "Bangalore", 
                course: "Music Teacher", 
                quote: "The quality of students and support from Playfit team is exceptional. I can focus on teaching while they handle everything else.",
                rating: 5,
                avatar: "🎹"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100">
                <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <p className="text-sm font-semibold text-purple-600">{testimonial.course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 md:py-24 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Playfit
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Playfit is a fun and engaging learning platform designed to help young children build <strong>confidence</strong>, <strong>communication skills</strong>, <strong>reading habits</strong>, and <strong>creative thinking</strong>. Our programs are carefully created for early learners with age-appropriate lessons, interactive activities, games, and practice sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg">
                  <img src="/images/puja.jpg" alt="Puja Agarwal" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Puja Agarwal</h4>
                  <p className="text-purple-600 font-semibold">Co-Founder & Lead Educator</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Experienced educator with <strong>15+ years of teaching experience</strong>. Graduate with a <strong>Phonics Teacher's Degree</strong>, specializing in early reading, phonics, and child-friendly teaching methods.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg">
                  <img src="/images/sonika.jpg" alt="Sonika Goel" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Sonika Goel</h4>
                  <p className="text-blue-600 font-semibold">Co-Founder & Marketing Lead</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Marketing professional with a <strong>postgraduate degree in Marketing</strong> and <strong>10+ years of experience</strong>. Certified in Public Speaking with a diploma in French.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions? We're here to help you start your teaching journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Phone</h3>
              <a href="tel:+918910484299" className="text-gray-300 hover:text-green-400 transition-colors text-lg">
                +91 8910484299
              </a>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email</h3>
              <a href="mailto:cplayfit@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors text-lg break-all">
                cplayfit@gmail.com
              </a>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visit Us</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                18, Rabindra Sarani, Poddar Court, 4th floor<br />
                Kolkata, West Bengal 700012
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Apply to Teach
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Join our team of expert instructors and start making an impact
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for your interest. We'll review your application and contact you within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="qualification" className="block text-sm font-semibold text-gray-900 mb-2">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                      placeholder="e.g., Master's in Computer Science"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject/Expertise *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    >
                      <option value="">Select a subject</option>
                      <option value="art">Art & Drawing</option>
                      <option value="chess">Chess</option>
                      <option value="piano">Piano</option>
                      <option value="phonics">Phonics</option>
                      <option value="speaking">Public Speaking</option>
                      <option value="abacus">Abacus</option>
                      <option value="readers">Reader's Club</option>
                      <option value="computers">Computers</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Submit Application
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="inline-block mb-4">
                <img src="/logo.jpg" alt="Playfit" className="h-12 w-auto object-contain" />
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Join our platform to teach, inspire, and earn. Share your expertise with students worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Teaching Subjects</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Art & Drawing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chess</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Piano</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Public Speaking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Abacus</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">For Instructors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#apply" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:cplayfit@gmail.com" className="hover:text-white transition-colors break-all">cplayfit@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+918910484299" className="hover:text-white transition-colors">+91 8910484299</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Playfit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
