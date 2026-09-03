import authReducer, { setLoggedIn, setLoggedOut } from "./authSlice";

describe("authSlice", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("setLoggedIn flips the flag on and records it in localStorage", () => {
        const state = authReducer({ value: false }, setLoggedIn());
        expect(state.value).toBe(true);
        expect(localStorage.getItem("isLoggedIn")).toBe("true");
    });

    test("setLoggedOut flips the flag off and clears localStorage", () => {
        localStorage.setItem("isLoggedIn", "true");
        const state = authReducer({ value: true }, setLoggedOut());
        expect(state.value).toBe(false);
        expect(localStorage.getItem("isLoggedIn")).toBeNull();
    });
});
