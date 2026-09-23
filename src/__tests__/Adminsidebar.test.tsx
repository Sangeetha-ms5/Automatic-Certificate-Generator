import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { AdminSidebar } from "../app/components/AdminSidebar";

// ---------------- MOCK ROUTER ----------------

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/admin",
    }),
  };
});

// ---------------- TESTS ----------------

describe("AdminSidebar Component", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  // ✅ Sidebar title
  it("renders sidebar title", () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("CMX")).toBeInTheDocument();
  });

  // ✅ Menu items render
  it("renders all menu items", () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Event Management")).toBeInTheDocument();
    expect(screen.getByText("Templates")).toBeInTheDocument();
    expect(screen.getByText("Records")).toBeInTheDocument();
    expect(screen.getByText("Email Automation")).toBeInTheDocument();
  });

  // ✅ Default icon when no logo
  it("shows default icon when logo not in localStorage", () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("CMX")).toBeInTheDocument();
  });

  // ✅ Load logo from localStorage
  it("loads logo from localStorage", () => {
    localStorage.setItem("cmxLogo", "test-logo.png");

    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const logo = screen.getByAltText("CMX Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "test-logo.png");
  });

  // ✅ Navigation click
  it("navigates when menu item clicked", () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Templates"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/templates");
  });

  // ✅ Active menu highlight
  it("highlights active menu item", () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const activeItem = screen.getByText("Dashboard");
    expect(activeItem.closest("button")).toHaveClass("bg-blue-50");
  });

  // ✅ Logo update event (FIXED VERSION)
  it("updates logo when logoUpdated event fired", async () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    localStorage.setItem("cmxLogo", "updated-logo.png");

    await act(async () => {
      window.dispatchEvent(new Event("logoUpdated"));
    });

    const updatedLogo = await screen.findByAltText("CMX Logo");

    expect(updatedLogo).toHaveAttribute("src", "updated-logo.png");
  });
});