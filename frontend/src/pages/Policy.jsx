import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJS from 'crypto-js';
import { Shield, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const theme = useThemeStore((state) =>
    CryptoJS.AES.decrypt(
      state.mode,
      import.meta.env.VITE_ENCRYPTION_SECRET
    ).toString(CryptoJS.enc.Utf8)
  );
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />

      <div className="container mx-auto px-4 py-12 mt-20 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className={`inline-flex items-center space-x-2 mb-8 ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isDark
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-500'
              } shadow-lg`}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Privacy Policy
          </h1>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Last Updated: January 2025
          </p>
        </div>

        {/* Content */}
        <div
          className={`${
            isDark ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-lg p-8 md:p-12`}
        >
          <div className="space-y-8">
            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Information We Collect
              </h2>
              <p
                className={`leading-relaxed mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                When you use StudySync AI, we collect:
              </p>
              <ul
                className={`list-disc list-inside space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <li>Account information (name, email) via Firebase Authentication</li>
                <li>Learning activity data (courses, progress, notes, chat history)</li>
                <li>Usage data (device info, IP address, browser type)</li>
              </ul>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                How We Use Your Data
              </h2>
              <ul
                className={`list-disc list-inside space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <li>Provide and improve our AI-powered learning services</li>
                <li>Personalize course recommendations</li>
                <li>Save your notes and track your progress</li>
                <li>Send important platform updates</li>
              </ul>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Data Security
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                We use industry-standard encryption (SSL/TLS) to protect your data. Your information is stored securely in MongoDB Atlas and Cloudinary. We process AI requests through Google Gemini API with strict privacy controls.
              </p>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Third-Party Services
              </h2>
              <p
                className={`leading-relaxed mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                We use trusted services to operate our platform:
              </p>
              <ul
                className={`list-disc list-inside space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <li>Firebase (Google) - Authentication & user management</li>
                <li>MongoDB Atlas - Database storage</li>
                <li>Cloudinary - File storage for PDFs</li>
                <li>Google Gemini AI - AI chat and summaries</li>
              </ul>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Your Rights
              </h2>
              <ul
                className={`list-disc list-inside space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <li>Access and export your data at any time</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Contact Us
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                For privacy concerns or questions, contact us at:{' '}
                <a
                  href="mailto:support@studysync.ai"
                  className={`font-semibold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  } hover:underline`}
                >
                  support@studysync.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
