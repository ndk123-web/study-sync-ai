import React from 'react';
import { X, BookOpen, Clock, Users, Star, CheckCircle, AlertCircle } from 'lucide-react';

const EnrollmentModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  course, 
  isDark,
  onTitleChange // New prop for dynamic title update
}) => {
  if (!isOpen || !course) return null;

  const handleConfirm = () => {
    // Trigger title change if callback provided
    if (onTitleChange && course) {
      const courseIdToUse = course.courseId || course.id;
      onTitleChange(courseIdToUse, course.title);
    }
    
    onConfirm(course);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative max-w-md w-full mx-4 rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirm Enrollment</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Ready to start your learning journey?
              </p>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="px-6 pb-4">
          <div 
            className={`rounded-xl p-4 border ${
              isDark 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {course.title}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>{course.lessons} lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{course.rating} rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>{course.students}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Instructor: {course.instructor}
              </span>
              <span className="text-xl font-bold text-emerald-500">
                {course.price}
              </span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 pb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Lifetime access to course materials</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Chat Support</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Get Summary</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>See Transcript</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Take Assessment</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Make Notes and Highlights</span>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="px-6 pb-4">
          <div 
            className={`flex items-start space-x-3 p-3 rounded-lg ${
              isDark 
                ? 'bg-blue-900/20 border border-blue-700/30' 
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-600 mb-1">Before you enroll:</p>
              <p className={isDark ? 'text-blue-300' : 'text-blue-700'}>
                Make sure you have a stable internet connection and the required time commitment for this course.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-teal-500 
                       text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 
                       transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Yes, Enroll Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
