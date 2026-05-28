import React from "react";
import { AlertBanner } from "./Feedback";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Application error boundary caught an error:", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12">
          <AlertBanner
            tone="error"
            title="Something went wrong"
            message="The app hit an unexpected error. Reload the page to recover, or try again in a moment."
            action={
              <button
                onClick={this.handleRetry}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Reload app
              </button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
