import tokenReducer, { updateToken, deleteToken } from "./tokenSlice";

describe("tokenSlice", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("updateToken stores the token in state and localStorage", () => {
        const state = tokenReducer({ value: "" }, updateToken("abc123"));
        expect(state.value).toBe("abc123");
        expect(localStorage.getItem("jwt")).toBe("abc123");
    });

    test("deleteToken clears the token from state and localStorage", () => {
        localStorage.setItem("jwt", "abc123");
        const state = tokenReducer({ value: "abc123" }, deleteToken());
        expect(state.value).toBe("");
        expect(localStorage.getItem("jwt")).toBe("");
    });
});
