import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "./profile/page";

vi.mock("./profile/_components/profile-card", () => ({
  ProfileCard: () => <div data-testid="profile-card">{"Profile"}</div>,
}));

afterEach(cleanup);

describe("protected routes", () => {
  it("renders profile route composition root", () => {
    render(<ProfilePage />);
    expect(screen.getByTestId("profile-card")).toBeTruthy();
  });
});
