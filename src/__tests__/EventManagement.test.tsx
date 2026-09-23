import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EventManagement } from "../app/components/EventManagement";

/* =============================
   MOCK COMPONENTS
============================= */
vi.mock("../app/components/AdminSidebar", () => ({
  AdminSidebar: () => <div>AdminSidebar</div>,
}));

vi.mock("../app/components/AdminHeader", () => ({
  AdminHeader: ({ title, onLogout }: any) => (
    <div>
      <span>{title}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  ),
}));

/* =============================
   MOCK NAVIGATE
============================= */
const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* =============================
   TEST SUITE
============================= */
describe("EventManagement Component", () => {

  it("renders page title", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    expect(screen.getByText("Event Management")).toBeInTheDocument();
  });

  it("shows empty events message", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No events found")
    ).toBeInTheDocument();
  });

  it("opens create event modal", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Create Event"));

    expect(
      screen.getByText("Create New Event")
    ).toBeInTheDocument();
  });

  it("closes modal when cancel clicked", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Create Event"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(
      screen.queryByText("Create New Event")
    ).not.toBeInTheDocument();
  });

  it("creates new event successfully", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Create Event"));

    fireEvent.change(
      screen.getByPlaceholderText("Event Name"),
      { target: { value: "Hackathon" } }
    );

    fireEvent.change(
      screen.getByDisplayValue("Participation"),
      { target: { value: "achievement" } }
    );

    fireEvent.change(
      screen.getByDisplayValue(""),
      { target: { value: "2026-05-20" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Participants Count"),
      { target: { value: 50 } }
    );

    fireEvent.click(screen.getByText("Create"));

    expect(screen.getByText("Hackathon")).toBeInTheDocument();
  });

  it("toggles event status", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Create Event"));

    fireEvent.change(
      screen.getByPlaceholderText("Event Name"),
      { target: { value: "Workshop" } }
    );

    fireEvent.change(
      screen.getByDisplayValue(""),
      { target: { value: "2026-05-21" } }
    );

    fireEvent.click(screen.getByText("Create"));

    expect(screen.getByText("Status: active")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(screen.getByText("Status: inactive")).toBeInTheDocument();
  });

  it("logout navigates to login", () => {
    render(
      <MemoryRouter>
        <EventManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-login");
  });

});