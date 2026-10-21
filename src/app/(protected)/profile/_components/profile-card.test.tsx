import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ProfileCard } from "./profile-card";

describe("ProfileCard", () => {
  afterEach(cleanup);

  it("composes native Card slots and forwards props", () => {
    const header = "Header";
    const content = "Content";
    const footer = "Footer";

    render(
      <ProfileCard
        data-testid="profile-card"
        size="sm"
        className="custom-profile-card"
        aria-label="Profile details"
      >
        <CardHeader>{header}</CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter>{footer}</CardFooter>
      </ProfileCard>,
    );

    const card = screen.getByTestId("profile-card");
    expect(card.getAttribute("data-slot")).toBe("card");
    expect(card.getAttribute("data-size")).toBe("sm");
    expect(card.getAttribute("aria-label")).toBe("Profile details");
    expect(card.className).toContain("custom-profile-card");
    expect(card.className).toContain("max-w-sm");
    expect(card.querySelectorAll('[data-slot="card"]')).toHaveLength(0);
    expect(card.querySelector('[data-slot="card-header"]')?.textContent).toBe(
      "Header",
    );
    expect(card.querySelector('[data-slot="card-content"]')?.textContent).toBe(
      "Content",
    );
    expect(card.querySelector('[data-slot="card-footer"]')?.textContent).toBe(
      "Footer",
    );
  });
});
