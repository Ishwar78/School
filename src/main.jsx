import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          padding: "20px"
        }}>
          <div style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e2e8f0",
            textAlign: "center"
          }}>
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#fee2e2",
              color: "#ef4444",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 auto 16px"
            }}>
              !
            </div>
            <h2 style={{ color: "#0f172a", margin: "0 0 8px", fontSize: "1.5rem" }}>
              Application Recovered
            </h2>
            <p style={{ color: "#64748b", margin: "0 0 20px", fontSize: "0.95rem", lineHeight: "1.5" }}>
              A temporary display error was caught. Click below to clear stored cache and reload smoothly.
            </p>
            <pre style={{
              backgroundColor: "#f1f5f9",
              padding: "12px",
              borderRadius: "8px",
              overflowX: "auto",
              color: "#dc2626",
              fontSize: "0.85rem",
              textAlign: "left",
              marginBottom: "20px"
            }}>
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {
                    console.error(e);
                  }
                  window.location.href = "/";
                }}
                style={{
                  backgroundColor: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.95rem"
                }}
              >
                Clear Cache &amp; Reload Home
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.95rem"
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
