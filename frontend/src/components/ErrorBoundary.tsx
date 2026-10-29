import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** Last line of defence: show a message instead of a blank page if rendering crashes. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="container page">
        <div className="card empty">
          <h3>Something went wrong</h3>
          <p>The page hit an unexpected error. Reloading usually fixes it.</p>
          <button className="btn btn-primary" onClick={() => window.location.assign('/')}>
            Back to home
          </button>
        </div>
      </div>
    );
  }
}
