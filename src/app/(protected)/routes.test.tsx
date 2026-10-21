import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "./profile/page";

vi.mock("./profile/_components/profile-client", () => ({
  ProfileClient: () => <div data-testid="profile-client">{"Profile"}</div>,
}));

afterEach(cleanup);

describe("protected routes", () => {
  it("renders profile route composition root", () => {
    render(<ProfilePage />);
    expect(screen.getByTestId("profile-client")).toBeTruthy();
  });
});
