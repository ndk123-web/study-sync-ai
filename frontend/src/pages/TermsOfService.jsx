import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/slices/useThemeStore';
import CryptoJS from 'crypto-js';
import { FileText, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
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
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500'
              } shadow-lg`}
            >
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Terms of Service
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
                Acceptance of Terms
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                By using StudySync AI, you agree to these Terms of Service. If you don't agree, please don't use our platform.
              </p>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                User Accounts
              </h2>
              <ul
                className={`list-disc list-inside space-y-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <li>You must be at least 13 years old to use StudySync AI</li>
                <li>Keep your account credentials secure</li>
                <li>You're responsible for all activity under your account</li>
                <li>Don't share your account with others</li>
              </ul>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Acceptable Use
              </h2>
              <p
                className={`leading-relaxed mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                You agree to:
              </p>
              <ul
                className={`list-disc list-inside space-y-2 mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <li>Use the platform for personal educational purposes</li>
                <li>Respect intellectual property rights</li>
                <li>Not upload malicious files or content</li>
                <li>Not attempt to hack or disrupt our services</li>
              </ul>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                AI Services Disclaimer
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Our AI features (summaries, chat responses, recommendations) are provided "as-is" and may contain errors. They're meant for educational support and shouldn't replace critical thinking or professional advice.
              </p>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Content Ownership
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                You own the content you create (notes, uploaded files). By using our platform, you grant us permission to store and process your content to provide our services.
              </p>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Limitation of Liability
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                StudySync AI is provided "as-is" without warranties. We're not liable for any indirect damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Changes to Terms
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                We may update these terms occasionally. Continued use of StudySync AI after changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Contact
              </h2>
              <p
                className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Questions about these terms? Contact us at:{' '}
                <a
                  href="mailto:legal@studysync.ai"
                  className={`font-semibold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  } hover:underline`}
                >
                  legal@studysync.ai
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

export default TermsOfService;
