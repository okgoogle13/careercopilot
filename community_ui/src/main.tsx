import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('Error caught by ErrorBoundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by componentDidCatch:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <p>Please check the console for more information.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get the root element
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Root element not found');
}

// Log that we're about to render
console.log('Rendering application...');

try {
  // Create root and render the app
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
  
  // Try to show an error message in the UI
  try {
    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '20px';
    errorDiv.style.fontFamily = 'sans-serif';
    errorDiv.style.color = 'red';
    errorDiv.innerHTML = `
      <h2>Application Error</h2>
      <p>Failed to initialize the application.</p>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <p>Check the browser console for more details.</p>
    `;
    rootElement.appendChild(errorDiv);
  } catch (e) {
    console.error('Failed to display error UI:', e);
  }
}
