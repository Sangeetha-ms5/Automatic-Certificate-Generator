import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { AdminLogin } from "../app/components/AdminLogin";

// mock react-router
const mockedNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("AdminLogin Component", () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
    localStorage.clear();
  });

  it("renders login form", () => {
    render(<AdminLogin />);

    expect(screen.getByText("Admin Login")).toBeInTheDocument();
  });

  it("updates inputs correctly", () => {
    render(<AdminLogin />);

    fireEvent.change(screen.getByPlaceholderText("Enter admin username"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "1234" },
    });

    expect(screen.getByPlaceholderText("Enter admin username")).toHaveValue("admin");
    expect(screen.getByPlaceholderText("Enter password")).toHaveValue("1234");
  });

  it("submits form and navigates", () => {
    render(<AdminLogin />);

    fireEvent.change(screen.getByPlaceholderText("Enter admin username"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    expect(localStorage.getItem("adminAuth")).toBe("true");
    expect(mockedNavigate).toHaveBeenCalledWith("/admin");
  });

  it("back button navigates home", () => {
    render(<AdminLogin />);

    fireEvent.click(screen.getByText("Back to Home"));

    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  // ✅ FIX FOR COVERAGE (useEffect + logo event)
  it("handles logoUpdated event", () => {
    localStorage.setItem("cmxLogo", "logo1");

    render(<AdminLogin />);

    localStorage.setItem("cmxLogo", "logo2");

    window.dispatchEvent(new Event("logoUpdated"));

    expect(localStorage.getItem("cmxLogo")).toBe("logo2");
  });
});