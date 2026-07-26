import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    background: '#050505',
                    color: 'white',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <h1 style={{ color: '#ff0000', marginBottom: '1rem' }}>Sincerest Apologies</h1>
                    <p>Something went wrong during loading.</p>
                    <pre style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: '#111',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        maxWidth: '90%',
                        overflow: 'auto',
                        color: '#888'
                    }}>
                        {this.state.error?.message || "Unknown Error"}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 2rem',
                            background: '#ff0000',
                            border: 'none',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
