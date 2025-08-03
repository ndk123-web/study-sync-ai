import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorNotification = ({ isVisible, onClose, message, isDark = false }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Notification */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${
        isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}>
        <div className={`max-w-sm w-full rounded-xl shadow-2xl border-l-4 border-red-500 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">Error</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-4 py-4">
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {message}
            </p>
          </div>
          
          {/* Action buttons (optional) */}
          <div className="px-4 pb-4">
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorNotification;
