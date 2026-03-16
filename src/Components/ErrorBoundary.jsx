import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    // Clear potentially corrupted local state that causes the crash
    // We do NOT clear token intentionally here unless needed, but clearing caches is safe
    window.localStorage.removeItem("bd");
    window.localStorage.removeItem("role");
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f9fa', color: '#333', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Tizimda kichik xatolik yuz berdi </h1>
          <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center', maxWidth: '400px' }}>
            Iltimos, sahifani yangilab qaytadan urinib ko'ring yoki keshni tozalang.
          </p>
          <button 
            onClick={this.handleReset}
            style={{ padding: '10px 20px', background: '#053786', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
          >
            Sahifani yangilash
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
