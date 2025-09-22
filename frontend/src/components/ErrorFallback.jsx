import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorFallback = () => {
  const error = useRouteError();
  console.error('⚠️ Route error boundary caught:', error);

  const status = error?.status || 404;
  const message = error?.statusText || error?.message || 'Something went wrong';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-lg w-full">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
          {status}
        </h1>
        <h2 className="text-2xl font-semibold mb-4">{message}</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          This page could not be found or an unexpected error occurred while rendering it.
          You can go back to the previous page or return to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => window.history.back()} className="px-6 py-3 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition">
            Go Back
          </button>
          <Link to="/dashboard" className="px-6 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 transition">
            Dashboard
          </Link>
          <Link to="/" className="px-6 py-3 rounded-lg font-medium bg-teal-600 hover:bg-teal-500 transition">
            Home
          </Link>
        </div>
        {process.env.NODE_ENV !== 'production' && error && (
          <pre className="mt-10 text-left text-sm bg-gray-800/70 p-4 rounded-lg overflow-auto max-h-72 border border-gray-700">
            {JSON.stringify({ status, message, stack: error?.stack }, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
