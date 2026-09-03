import identityReducer, { updateUserIdentity, clearUserIdentity } from "./identitySlice";

describe("identitySlice", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("updateUserIdentity stores the identity in state and localStorage", () => {
        const state = identityReducer({ value: "" }, updateUserIdentity("Doctor"));
        expect(state.value).toBe("Doctor");
        expect(localStorage.getItem("userIdentity")).toBe("Doctor");
    });

    test("clearUserIdentity removes the identity from state and localStorage", () => {
        localStorage.setItem("userIdentity", "Patient");
        const state = identityReducer({ value: "Patient" }, clearUserIdentity());
        expect(state.value).toBe("");
        expect(localStorage.getItem("userIdentity")).toBeNull();
    });
});
