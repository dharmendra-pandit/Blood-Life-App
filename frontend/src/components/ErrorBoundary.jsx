import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('[GLOBAL ERROR BOUNDARY]', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Something went wrong
            </h1>

            <p className="text-slate-600 mb-6 text-sm sm:text-base">
              An unexpected error occurred in the application. Please try reloading the page or return home.
            </p>

            {isDev && this.state.error && (
              <div className="mb-6 text-left p-4 bg-slate-900 text-red-400 rounded-xl overflow-x-auto text-xs font-mono max-h-48">
                <p className="font-bold text-white mb-1">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-slate-400 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition shadow-sm"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
              >
                <Home className="w-4 h-4" /> Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
