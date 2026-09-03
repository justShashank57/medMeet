import book from "./booking";
import api from "../services/webcalls";

jest.mock("../services/webcalls", () => ({
    __esModule: true,
    default: {
        patient: {
            bookAppointment: jest.fn()
        }
    }
}));

describe("book", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    test("maps arguments into an appointment payload and returns the result", async () => {
        api.patient.bookAppointment.mockResolvedValueOnce({ _id: "appt1" });

        const result = await book("doc1", "2026-09-10", "11:00 AM");

        expect(api.patient.bookAppointment).toHaveBeenCalledWith({
            doctorId: "doc1",
            date: "2026-09-10",
            time: "11:00 AM"
        });
        expect(result).toEqual({ _id: "appt1" });
    });

    test("rethrows when the API call fails", async () => {
        const error = new Error("booking failed");
        api.patient.bookAppointment.mockRejectedValueOnce(error);

        await expect(book("doc1", "2026-09-10", "11:00 AM")).rejects.toBe(error);
    });
});
