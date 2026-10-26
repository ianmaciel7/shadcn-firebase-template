import "@/app/globals.css";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { ArtifactAction } from "./artifact";
import { Attachment, AttachmentRemove, Attachments } from "./attachments";

test.each(["grid", "inline"] as const)(
  "reveals the %s removal action for keyboard focus without pointer hover",
  async (variant) => {
    const onRemove = vi.fn();
    const screen = await render(
      <Attachments variant={variant}>
        <Attachment
          data={{
            id: "document",
            type: "file",
            mediaType: "text/plain",
            url: "/document.txt",
          }}
          onRemove={onRemove}
        >
          <AttachmentRemove label="Remove document" />
        </Attachment>
      </Attachments>,
    );
    const button = screen.getByRole("button", { name: "Remove document" });
    await userEvent.tab();
    await expect.element(button).toHaveFocus();
    await expect
      .poll(() => getComputedStyle(button.element()).opacity)
      .toBe("1");
    await userEvent.keyboard("{Enter}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  },
);

test("tooltip action has one keyboard stop and one activation per key", async () => {
  const onClick = vi.fn();
  const screen = await render(
    <>
      <ArtifactAction tooltip="Export artifact" onClick={onClick}>
        Export
      </ArtifactAction>
      <button type="button">Next control</button>
    </>,
  );
  const action = screen.getByRole("button", { name: /Export artifact/ });
  await userEvent.tab();
  await expect.element(action).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(onClick).toHaveBeenCalledTimes(1);
  await userEvent.keyboard(" ");
  expect(onClick).toHaveBeenCalledTimes(2);
  await userEvent.tab();
  await expect
    .element(screen.getByRole("button", { name: "Next control" }))
    .toHaveFocus();
  expect(page.getByRole("button").elements()).toHaveLength(2);
});
