import { Component } from "react";
import { C } from "../data";

// Catches render-time errors so a transient crash (e.g. a wedged Vite hot
// update during development) shows a friendly reload card instead of blanking
// the whole app. In production this only triggers on a genuine error.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("App render error:", error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center", background: C.white, fontFamily: "'Figtree', sans-serif" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>Something hiccuped</p>
        <p style={{ fontSize: 13, color: C.sub, margin: 0, maxWidth: 280, lineHeight: 1.5 }}>The screen ran into an error. Reloading usually fixes it.</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 4, padding: "12px 22px", borderRadius: 12, border: "none", background: C.p600, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          Reload
        </button>
      </div>
    );
  }
}
