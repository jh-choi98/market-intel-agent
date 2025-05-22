import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUpload from "../components/FileUpload";

describe("FileUpload", () => {
  it("renders upload heading", () => {
    render(<FileUpload onComplete={() => {}} />);
    expect(screen.getByText(/upload your documents/i)).toBeInTheDocument();
  });
});
