import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import identityReducer from "../redux/slices/identitySlice";
import userReducer from "../redux/slices/userSlice";
import { ToastProvider } from "./Toast";
import Login from "./login";

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    defaults: {}
}));

// react-router-dom v7's package export conditions aren't resolved correctly by
// react-scripts 5's Jest/Babel setup and crash with "Cannot read properties of
// null (reading 'useRef')" when the real module is loaded. Stub only the pieces
// Login actually uses so the real package is never required.
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>
}));

function setup() {
    const store = configureStore({
        reducer: { user: userReducer, auth: authReducer, identity: identityReducer }
    });

    render(
        <Provider store={store}>
            <ToastProvider>
                <Login />
            </ToastProvider>
        </Provider>
    );

    return store;
}

describe("Login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test("logs in a patient with the entered credentials and redirects home", async () => {
        axios.post.mockResolvedValueOnce({ data: { token: "jwt-token" } });
        const user = userEvent.setup();
        const reduxStore = setup();

        await user.type(screen.getByLabelText("Email"), "patient@example.com");
        await user.type(screen.getByLabelText("Password"), "secret123");
        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("/patient/login"),
            { email: "patient@example.com", password: "secret123" }
        );
        expect(reduxStore.getState().auth.value).toBe(true);
        expect(reduxStore.getState().identity.value).toBe("Patient");
    });

    test("logs in as a doctor when that role is selected", async () => {
        axios.post.mockResolvedValueOnce({ data: { token: "doc-jwt" } });
        const user = userEvent.setup();
        const reduxStore = setup();

        await user.type(screen.getByLabelText("Email"), "doc@example.com");
        await user.type(screen.getByLabelText("Password"), "secret123");
        await user.selectOptions(screen.getByLabelText("Login as"), "Doctor");
        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("/doctor/login"),
            { email: "doc@example.com", password: "secret123" }
        );
        expect(reduxStore.getState().auth.value).toBe(true);
        expect(reduxStore.getState().identity.value).toBe("Doctor");
    });

    test("shows an error toast and does not navigate when credentials are rejected", async () => {
        axios.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });
        const user = userEvent.setup();
        const reduxStore = setup();

        await user.type(screen.getByLabelText("Email"), "patient@example.com");
        await user.type(screen.getByLabelText("Password"), "wrongpass");
        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(await screen.findByRole("alert")).toBeInTheDocument();

        expect(reduxStore.getState().auth.value).toBe(false);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
