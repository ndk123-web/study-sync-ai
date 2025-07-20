import React, { useState } from 'react';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJs from 'crypto-js';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Zap, CheckCircle, Star, Globe, Users, Heart } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  const theme = useThemeStore((state) =>
    CryptoJs.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJs.enc.Utf8)
  );

  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setIsSubmitted(false);
      }, 3000);
    }, 2000);
  };

  return (
    <>
    <Header />
    
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div className={`relative py-20 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 animate-pulse">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto mb-12 leading-relaxed`}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <Users className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-500">10K+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Happy Users</div>
            </div>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <Clock className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-500">24/7</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Support</div>
            </div>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <Star className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-500">4.9</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rating</div>
            </div>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <Globe className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-500">50+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information - Left Side */}
          <div className="lg:col-span-1">
            <div className={`p-8 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl border ${isDark ? 'border-gray-700' : 'border-gray-100'} hover:shadow-3xl transition-all duration-500`}>
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Get in Touch
              </h2>
              
              <div className="space-y-8">
                <div className="group">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h3>
                      <p className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:underline cursor-pointer`}>support@studysyncai.com</p>
                      <p className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:underline cursor-pointer`}>info@studysyncai.com</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</h3>
                      <p className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:underline cursor-pointer`}>+1 (555) 123-4567</p>
                      <p className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:underline cursor-pointer`}>+1 (555) 987-6543</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Office</h3>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                        123 Innovation Street<br />
                        Tech Valley, CA 94043<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Support Hours</h3>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                        Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                        Weekend: 10:00 AM - 4:00 PM PST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Support Card */}
              <div className={`mt-10 p-6 rounded-2xl ${isDark ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30' : 'bg-gradient-to-r from-emerald-50 to-teal-50'} border ${isDark ? 'border-emerald-800' : 'border-emerald-200'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Support</h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed`}>
                  Need immediate help? Our AI chatbot is available 24/7 to assist you with common questions.
                </p>
                <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Live Chat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-2">
            <div className={`p-10 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl border ${isDark ? 'border-gray-700' : 'border-gray-100'} hover:shadow-3xl transition-all duration-500`}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Send us a Message
                </h2>
              </div>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold text-green-500 mb-4 ${isDark ? 'text-green-400' : 'text-green-600'}`}>Message Sent Successfully!</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium mb-3 text-emerald-600">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        } group-hover:border-emerald-400`}
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium mb-3 text-emerald-600">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                        } group-hover:border-emerald-400`}
                        placeholder="your@email.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-3 text-emerald-600">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } group-hover:border-emerald-400`}
                      placeholder="What is this about?"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-3 text-emerald-600">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 resize-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } group-hover:border-emerald-400`}
                      placeholder="Tell us more about your inquiry..."
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-5 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Send Message</span>
                        <Zap className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />

    </>
  );
};

export default Contact;
