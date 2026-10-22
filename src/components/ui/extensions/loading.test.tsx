import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Loading } from "./loading";

describe("Loading", () => {
  afterEach(cleanup);
  it("announces the translated message once and hides the decorative spinner", () => {
    const message = "Salvando perfil…";
    render(
      <Loading className="custom-loading" data-testid="loading">
        {message}
      </Loading>,
    );
    const status = screen.getByRole("status");
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(status.textContent).toBe(message);
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.className).toContain("custom-loading");
    const spinner = status.querySelector('[data-slot="spinner"]');
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    expect(spinner?.hasAttribute("aria-label")).toBe(false);
  });
});
