import servicesData from "./services";

describe("services data", () => {
    test("is exported as a non-empty array", () => {
        expect(Array.isArray(servicesData)).toBe(true);
        expect(servicesData.length).toBeGreaterThan(0);
    });

    test("every entry has the expected shape", () => {
        servicesData.forEach((entry) => {
            expect(typeof entry.name).toBe("string");
            expect(entry.name.length).toBeGreaterThan(0);
            expect(typeof entry.desc).toBe("string");
            expect(entry.desc.length).toBeGreaterThan(0);
        });
    });
});
