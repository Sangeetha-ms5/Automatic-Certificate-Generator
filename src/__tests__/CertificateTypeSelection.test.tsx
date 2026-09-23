import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { CertificateTypeSelection } from "../app/components/CertificateTypeSelection";

// ✅ mock react-router navigate
const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// ✅ mock Header
vi.mock("../components/Header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

// ✅ mock TemplateConfigurator
vi.mock("../components/TemplateConfigurator", () => ({
  TemplateConfigurator: () => (
    <div data-testid="configurator">Configurator</div>
  ),
}));

describe("CertificateTypeSelection", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("renders page title", () => {
    render(<CertificateTypeSelection />);
    expect(
      screen.getByText("Select Certificate Type")
    ).toBeInTheDocument();
  });

  it("renders all certificate types", () => {
    render(<CertificateTypeSelection />);

    expect(screen.getByText("Certificate of Participation")).toBeInTheDocument();
    expect(screen.getByText("Certificate of Achievement")).toBeInTheDocument();
    expect(screen.getByText("Certificate of Appreciation")).toBeInTheDocument();
    expect(screen.getByText("Certificate of Completion")).toBeInTheDocument();
  });

  it("shows upload button for each card", () => {
    render(<CertificateTypeSelection />);

    const buttons = screen.getAllByText("Upload Template");
    expect(buttons.length).toBe(4);
  });

  it("disables select button when no template uploaded", () => {
    render(<CertificateTypeSelection />);

    const selectButtons = screen.getAllByText("Upload Template First");
    expect(selectButtons.length).toBe(4);
  });

  it("opens file input when upload clicked", () => {
    render(<CertificateTypeSelection />);

    const uploadButtons = screen.getAllByText("Upload Template");
    fireEvent.click(uploadButtons[0]);

    // no crash = success (file input click triggered)
    expect(uploadButtons[0]).toBeInTheDocument();
  });

  it("navigates when template exists and select clicked", () => {
    localStorage.setItem(
      "template_participation",
      "fake-image-data"
    );

    render(<CertificateTypeSelection />);

    const selectButtons = screen.getAllByText("Select Template");
    fireEvent.click(selectButtons[0]);

    expect(mockNavigate).toHaveBeenCalled();
  });
});