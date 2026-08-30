import faqData from "./faq";

describe("faq data", () => {
    test("is exported as a non-empty array", () => {
        expect(Array.isArray(faqData)).toBe(true);
        expect(faqData.length).toBeGreaterThan(0);
    });

    test("every entry has the expected shape", () => {
        faqData.forEach((entry) => {
            expect(typeof entry.question).toBe("string");
            expect(entry.question.length).toBeGreaterThan(0);
            expect(typeof entry.content).toBe("string");
            expect(entry.content.length).toBeGreaterThan(0);
        });
    });
});
