import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { RecordManagement } from "../app/components/RecordManagement";

const renderComponent = () =>
  render(
    <MemoryRouter>
      <RecordManagement />
    </MemoryRouter>
  );

describe("RecordManagement Component", () => {
  it("renders main title", () => {
    renderComponent();
    expect(screen.getByText(/record management/i)).toBeInTheDocument();
  });

  it("renders search input", () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("renders export button", () => {
    renderComponent();

    expect(screen.getByText(/export/i)).toBeInTheDocument();
  });

  it("shows loading or empty state", () => {
    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("updates search input value", () => {
    renderComponent();

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "john" } });

    expect((input as HTMLInputElement).value).toBe("john");
  });

  it("renders sidebar", () => {
    renderComponent();

    // based on your DOM snapshot
    expect(screen.getByText(/adminsidebar/i)).toBeInTheDocument();
  });
});