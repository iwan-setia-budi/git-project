import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle } from 'lucide-react';

/**
 * Error Boundary component to catch React errors
 * Prevents entire app from crashing
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // Log to error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-2xl">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-slate-300 mb-6">
              We encountered an unexpected error. Try refreshing the page or contact support if the problem persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left text-sm bg-slate-900/50 p-3 rounded-lg overflow-auto max-h-48">
                <summary className="cursor-pointer font-semibold text-slate-300 mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-xs text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:opacity-95 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
