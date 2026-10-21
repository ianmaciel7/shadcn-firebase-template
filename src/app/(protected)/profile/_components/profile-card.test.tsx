import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  ProfileCard,
  ProfileCardAction,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardFooter,
  ProfileCardHeader,
  ProfileCardTitle,
} from "./profile-card";

describe("ProfileCard", () => {
  afterEach(cleanup);

  it("composes native Card slots and forwards props", () => {
    const header = "Header";
    const content = "Content";
    const footer = "Footer";
    const title = "Title";
    const description = "Description";

    render(
      <ProfileCard
        data-testid="profile-card"
        size="sm"
        className="custom-profile-card"
        aria-label="Profile details"
      >
        <ProfileCardHeader>
          {header}
          <ProfileCardAction aria-label="Profile actions">
            {footer}
          </ProfileCardAction>
          <ProfileCardTitle>{title}</ProfileCardTitle>
          <ProfileCardDescription>{description}</ProfileCardDescription>
        </ProfileCardHeader>
        <ProfileCardContent>{content}</ProfileCardContent>
        <ProfileCardFooter>{footer}</ProfileCardFooter>
      </ProfileCard>,
    );

    const card = screen.getByTestId("profile-card");
    expect(
      card
        .querySelector('[data-slot="card-action"]')
        ?.getAttribute("aria-label"),
    ).toBe("Profile actions");
    expect(card.getAttribute("data-slot")).toBe("card");
    expect(card.getAttribute("data-size")).toBe("sm");
    expect(card.getAttribute("aria-label")).toBe("Profile details");
    expect(card.className).toContain("custom-profile-card");
    expect(card.className).toContain("max-w-sm");
    expect(card.querySelectorAll('[data-slot="card"]')).toHaveLength(0);
    expect(
      card.querySelector('[data-slot="card-header"]')?.textContent,
    ).toContain(header);
    expect(card.querySelector('[data-slot="card-content"]')?.textContent).toBe(
      "Content",
    );
    expect(card.querySelector('[data-slot="card-title"]')?.textContent).toBe(
      title,
    );
    expect(
      card.querySelector('[data-slot="card-description"]')?.textContent,
    ).toBe(description);
    expect(card.querySelector('[data-slot="card-footer"]')?.textContent).toBe(
      "Footer",
    );
  });
});
