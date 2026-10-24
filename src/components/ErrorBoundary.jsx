import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#020230",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "20px"
        }}>
          <h1 style={{ fontSize: "28px", color: "#f87171", marginBottom: "12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#94a3b8", maxWidth: "480px", marginBottom: "24px" }}>
            An unexpected error occurred in the quiz engine. You can restart the app to continue playing.
          </p>
          <button
            type="button"
            onClick={this.handleRestart}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#38bdf8",
              color: "#0f172a",
              cursor: "pointer"
            }}
          >
            Restart Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
