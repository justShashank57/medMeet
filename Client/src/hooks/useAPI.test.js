import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ToastProvider } from "../components/Toast";
import { useAuth, useAppointments } from "./useAPI";

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;

describe("useAuth", () => {
    test("login returns the resolved data and stops loading on success", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        const apiCall = jest.fn().mockResolvedValue({ token: "jwt-token" });

        let response;
        await act(async () => {
            response = await result.current.login(apiCall);
        });

        expect(apiCall).toHaveBeenCalledTimes(1);
        expect(response).toEqual({ token: "jwt-token" });
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    test("login returns null and sets an error message when the API call rejects", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        const apiCall = jest.fn().mockRejectedValue(new Error("Invalid credentials"));

        let response;
        await act(async () => {
            response = await result.current.login(apiCall);
        });

        expect(response).toBeNull();
        expect(result.current.loading).toBe(false);
        // useAuth.login always reports its own fixed error message, not the raw error
        expect(result.current.error).toBe("Login failed");
    });

    test("sets loading to true while the signup call is in flight", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        let resolveApiCall;
        const apiCall = jest.fn(() => new Promise((resolve) => { resolveApiCall = resolve; }));

        act(() => {
            result.current.signup(apiCall, "Patient");
        });

        await waitFor(() => expect(result.current.loading).toBe(true));

        await act(async () => {
            resolveApiCall({ token: "jwt-token" });
        });

        expect(result.current.loading).toBe(false);
    });
});

describe("useAppointments", () => {
    test("bookAppointment returns the result on success", async () => {
        const { result } = renderHook(() => useAppointments(), { wrapper });
        const apiCall = jest.fn().mockResolvedValue({ _id: "appt1" });

        let response;
        await act(async () => {
            response = await result.current.bookAppointment(apiCall);
        });

        expect(response).toEqual({ _id: "appt1" });
        expect(result.current.loading).toBe(false);
    });

    test("bookAppointment returns null and records the error on failure", async () => {
        const { result } = renderHook(() => useAppointments(), { wrapper });
        const apiCall = jest.fn().mockRejectedValue(new Error("Failed to book appointment"));

        let response;
        await act(async () => {
            response = await result.current.bookAppointment(apiCall);
        });

        expect(response).toBeNull();
        expect(result.current.error).toBe("Failed to book appointment");
    });
});
