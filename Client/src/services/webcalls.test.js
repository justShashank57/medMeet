import axios from "axios";
import api from "./webcalls";

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    defaults: {}
}));

describe("webcalls api", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    describe("auth.patientLogin", () => {
        test("returns response data on success", async () => {
            axios.post.mockResolvedValueOnce({ data: { token: "jwt-token" } });

            const result = await api.auth.patientLogin({ email: "a@b.com", password: "pw" });

            expect(result).toEqual({ token: "jwt-token" });
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/patient/login"),
                { email: "a@b.com", password: "pw" }
            );
        });

        test("throws the server error payload on failure", async () => {
            axios.post.mockRejectedValueOnce({
                response: { data: { message: "Invalid credentials" } }
            });

            await expect(api.auth.patientLogin({ email: "a@b.com", password: "wrong" }))
                .rejects.toEqual({ message: "Invalid credentials" });
        });
    });

    describe("patient.bookAppointment", () => {
        test("posts the appointment payload and relies on the httpOnly session cookie for auth", async () => {
            axios.post.mockResolvedValueOnce({ data: { _id: "appt1" } });

            const result = await api.patient.bookAppointment({ doctorId: "doc1", date: "2026-09-10", time: "11:00 AM" });

            expect(result).toEqual({ _id: "appt1" });
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/patient/create-appointment"),
                { doctorId: "doc1", date: "2026-09-10", time: "11:00 AM" }
            );
        });

        test("propagates a raw error when there is no response payload", async () => {
            const networkError = new Error("Network Error");
            axios.post.mockRejectedValueOnce(networkError);

            await expect(api.patient.bookAppointment({ doctorId: "doc1" })).rejects.toBe(networkError);
        });
    });

    describe("admin key + createDoctor", () => {
        test("setKey/hasKey/clearKey manage the admin key in sessionStorage", () => {
            expect(api.admin.hasKey()).toBe(false);

            api.admin.setKey("secret-key");
            expect(sessionStorage.getItem("adminKey")).toBe("secret-key");
            expect(api.admin.hasKey()).toBe(true);

            api.admin.clearKey();
            expect(sessionStorage.getItem("adminKey")).toBeNull();
            expect(api.admin.hasKey()).toBe(false);
        });

        test("createDoctor sends the admin key header", async () => {
            api.admin.setKey("secret-key");
            axios.post.mockResolvedValueOnce({ data: { _id: "newDoc" } });

            await api.admin.createDoctor({ name: "Dr. Who" });

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/admin/doctor"),
                { name: "Dr. Who" },
                { headers: { "x-admin-key": "secret-key" } }
            );
        });
    });

    describe("module setup", () => {
        test("enables withCredentials so the httpOnly session cookie is sent cross-origin", () => {
            expect(axios.defaults.withCredentials).toBe(true);
        });
    });
});

describe("webcalls module load", () => {
    const originalUrl = process.env.REACT_APP_API_BASE_URL;

    afterEach(() => {
        process.env.REACT_APP_API_BASE_URL = originalUrl;
    });

    test("throws instead of silently falling back to a hardcoded URL when unset", () => {
        process.env.REACT_APP_API_BASE_URL = "";
        jest.resetModules();

        expect(() => require("./webcalls")).toThrow(/REACT_APP_API_BASE_URL is not set/);
    });
});
