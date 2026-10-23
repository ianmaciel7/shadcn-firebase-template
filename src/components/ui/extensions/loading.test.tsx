import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Loading } from "./loading";
import { LoadingIndicator } from "./loading-indicator";

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
    expect(status.className).toContain("text-inherit");
    const spinner = status.querySelector('[data-slot="spinner"]');
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    expect(spinner?.hasAttribute("aria-label")).toBe(false);
    expect(spinner?.getAttribute("class")).toContain(
      "motion-reduce:animate-none",
    );
  });

  it("LoadingIndicator accepts the label as children or via the label prop", () => {
    const childrenMessage = "Aguarde…";
    const labelMessage = "Espere…";

    render(
      <>
        <LoadingIndicator data-testid="by-children">
          {childrenMessage}
        </LoadingIndicator>
        <LoadingIndicator data-testid="by-label" label={labelMessage} />
      </>,
    );
    expect(screen.getByTestId("by-children").textContent).toBe(childrenMessage);
    expect(screen.getByTestId("by-label").textContent).toBe(labelMessage);
  });
});
