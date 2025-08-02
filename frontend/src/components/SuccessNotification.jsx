import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessNotification = ({ 
  isVisible, 
  onClose, 
  message, 
  isDark 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 transform transition-all duration-300 ease-in-out">
      <div 
        className={`max-w-sm w-full shadow-2xl rounded-xl border overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
            : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600">
                Success!
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-green-500 transition-all duration-3000 ease-linear"
            style={{ 
              animation: 'progress 3s linear forwards',
              width: '0%'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SuccessNotification;
