import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProtectedLayout from "./layout";

vi.mock("./_components/protected-gate-client", () => ({
  ProtectedGateClient: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="protected-gate">{children}</section>
  ),
}));

afterEach(cleanup);

describe("ProtectedLayout", () => {
  it("composes the protected gate around its children", () => {
    render(
      <ProtectedLayout params={Promise.resolve({})}>
        <p>{"Protected Content"}</p>
      </ProtectedLayout>,
    );
    expect(screen.getByTestId("protected-gate")).toBeTruthy();
    expect(screen.getByText("Protected Content")).toBeTruthy();
  });
});
