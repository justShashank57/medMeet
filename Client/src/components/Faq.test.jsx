import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Faq from "./Faq";
import faqData from "../data/faq";

describe("Faq", () => {
    test("renders without crashing and shows the heading", () => {
        render(<Faq />);
        expect(screen.getByText(/Most questions by our beloved Patients/i)).toBeInTheDocument();
    });

    test("renders one question box per faq data entry", () => {
        const { container } = render(<Faq />);
        const boxes = container.querySelectorAll("#question");
        expect(boxes.length).toBe(faqData.length);
    });

    test("renders the text of every question", () => {
        render(<Faq />);
        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        faqData.forEach((entry) => {
            expect(screen.getAllByText(new RegExp(escapeRegExp(entry.question))).length).toBeGreaterThan(0);
        });
    });
});
