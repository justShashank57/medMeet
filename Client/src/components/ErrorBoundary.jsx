import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled UI error:", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                    <h2>Something went wrong.</h2>
                    <p>Please try reloading the page.</p>
                    <button onClick={this.handleReload} style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", cursor: "pointer" }}>
                        Back to home
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
