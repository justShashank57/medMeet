import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function Bomb() {
    throw new Error("boom");
}

describe("ErrorBoundary", () => {
    let consoleErrorSpy;

    beforeEach(() => {
        // React and componentDidCatch both log to console.error for a caught
        // render error; that's expected noise for this test, not a real failure.
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("renders children normally when there is no error", () => {
        render(
            <ErrorBoundary>
                <p>All good</p>
            </ErrorBoundary>
        );
        expect(screen.getByText("All good")).toBeInTheDocument();
    });

    test("catches an error from a child and renders the fallback UI instead of crashing", () => {
        render(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>
        );

        expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Back to home" })).toBeInTheDocument();
    });
});
