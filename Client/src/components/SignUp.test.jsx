import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../redux/slices/tokenSlice";
import identityReducer from "../redux/slices/identitySlice";
import userReducer from "../redux/slices/userSlice";
import { ToastProvider } from "./Toast";
import SignUp from "./SignUp";

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
}));

// react-router-dom v7's package export conditions aren't resolved correctly by
// react-scripts 5's Jest/Babel setup and crash with "Cannot read properties of
// null (reading 'useRef')" when the real module is loaded. Stub only the pieces
// SignUp actually uses so the real package is never required.
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>
}));

function setup() {
    const store = configureStore({
        reducer: { user: userReducer, token: tokenReducer, identity: identityReducer }
    });

    render(
        <Provider store={store}>
            <ToastProvider>
                <SignUp />
            </ToastProvider>
        </Provider>
    );

    return store;
}

describe("SignUp", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test("registers a patient and redirects to the completed page", async () => {
        axios.post.mockResolvedValueOnce({ data: { token: "jwt-token" } });
        const user = userEvent.setup();
        const reduxStore = setup();

        await user.type(screen.getByLabelText("Name"), "Jane Doe");
        await user.type(screen.getByLabelText("Email"), "jane@example.com");
        await user.type(screen.getByLabelText("Phone number"), "1234567890");
        await user.type(screen.getByLabelText("Password"), "secret123");
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/completed"));

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("/patient/signup"),
            {
                name: "Jane Doe",
                email: "jane@example.com",
                password: "secret123",
                phone: "1234567890",
                gender: "Male"
            }
        );
        expect(reduxStore.getState().token.value).toBe("jwt-token");
        expect(reduxStore.getState().identity.value).toBe("Patient");
    });

    test("registers a doctor when that identity is selected", async () => {
        axios.post.mockResolvedValueOnce({ data: { token: "doc-jwt" } });
        const user = userEvent.setup();
        const reduxStore = setup();

        await user.type(screen.getByLabelText("Name"), "Dr. House");
        await user.type(screen.getByLabelText("Email"), "house@example.com");
        await user.type(screen.getByLabelText("Phone number"), "1234567890");
        await user.type(screen.getByLabelText("Password"), "secret123");
        await user.selectOptions(screen.getByLabelText(/Are you a/i), "Doctor");
        await user.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/completed"));

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("/doctor/signup"),
            expect.objectContaining({ name: "Dr. House" })
        );
        expect(reduxStore.getState().token.value).toBe("doc-jwt");
        expect(reduxStore.getState().identity.value).toBe("Doctor");
    });

    test("shows a warning toast and does not call the API when required fields are missing", async () => {
        const user = userEvent.setup();
        const reduxStore = setup();

        await user.click(screen.getByRole("button", { name: /submit/i }));

        expect(await screen.findByText(/please fill all the required fields/i)).toBeInTheDocument();
        expect(axios.post).not.toHaveBeenCalled();
        expect(reduxStore.getState().token.value).toBeFalsy();
    });
});
