import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../app/components/ui/button";

describe("Button Component", () => {
  it("renders button text correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Press</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Press" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders default variant", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: "Default" });

    expect(button.className).toContain("bg-primary");
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: "Secondary" });

    expect(button.className).toContain("bg-secondary");
  });

  it("renders destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: "Delete" });

    expect(button.className).toContain("bg-destructive");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: "Disabled" });

    expect(button).toBeDisabled();
  });
});