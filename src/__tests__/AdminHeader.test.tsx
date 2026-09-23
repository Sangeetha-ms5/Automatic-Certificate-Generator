import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminHeader } from "../app/components/AdminHeader";

/* ✅ mock lucide icons */
vi.mock("lucide-react", () => ({
  Award: () => <div>AwardIcon</div>,
  Upload: () => <div>UploadIcon</div>,
  LogOut: () => <div>LogoutIcon</div>,
}));

describe("AdminHeader Component", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it("renders header title", () => {
    render(<AdminHeader title="Dashboard" />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("shows default logo when no logo exists", () => {
    render(<AdminHeader title="Dashboard" />);

    expect(screen.getByText("AwardIcon")).toBeInTheDocument();
  });

  it("shows upload logo button when logo not present", () => {
    render(<AdminHeader title="Dashboard" />);

    expect(screen.getByText("Upload Logo")).toBeInTheDocument();
  });

  it("calls logout function when logout clicked", () => {
    const mockLogout = vi.fn();

    render(
      <AdminHeader title="Dashboard" onLogout={mockLogout} />
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("updates logo when logoUpdated event fired", () => {
    localStorage.setItem("cmxLogo", "test-logo");

    render(<AdminHeader title="Dashboard" />);

    window.dispatchEvent(new Event("logoUpdated"));

    expect(localStorage.getItem("cmxLogo")).toBe("test-logo");
  });

});