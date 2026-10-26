import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ArtifactAction } from "./artifact";
import {
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
} from "./attachments";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
} from "./chain-of-thought";
import { Commit, CommitContent, CommitHeader } from "./commit";
import { FileTree, FileTreeFile } from "./file-tree";
import { Question, QuestionOption, QuestionOptions } from "./question";
import { TestResults, TestResultsProgress } from "./test-results";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("reviewed primitive compositions", () => {
  it("renders finite progress when a test suite is empty", () => {
    const view = render(
      <TestResults summary={{ passed: 0, failed: 0, skipped: 0, total: 0 }}>
        <TestResultsProgress />
      </TestResults>,
    );
    expect(screen.getByText("0%")).toBeTruthy();
    expect(view.container.innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it("uses accessible toggle-button semantics instead of unsupported radio navigation", () => {
    render(
      <Question>
        <QuestionOptions>
          <QuestionOption value="first">First option</QuestionOption>
        </QuestionOptions>
      </Question>,
    );
    const option = screen.getByRole("button", { name: "First option" });
    expect(option.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(option);
    expect(option.getAttribute("aria-pressed")).toBe("true");
  });

  it("supports Space and Enter on a file in a button group without scrolling", () => {
    const onSelect = vi.fn();
    render(
      <FileTree onSelect={onSelect}>
        <FileTreeFile name="readme" path="/readme" />
      </FileTree>,
    );
    const item = screen.getByRole("button", { name: "readme" });
    expect(fireEvent.keyDown(item, { key: " ", cancelable: true })).toBe(false);
    fireEvent.keyDown(item, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith("/readme");
  });

  it("uses one named tooltip action and preserves single activation and disabled state", () => {
    const onClick = vi.fn();
    const view = render(
      <ArtifactAction tooltip="Export artifact" onClick={onClick}>
        Export
      </ArtifactAction>,
    );
    const button = screen.getByRole("button", { name: /Export artifact/ });
    expect(view.container.querySelectorAll("button")).toHaveLength(1);
    expect(button.querySelector("button")).toBeNull();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    view.rerender(
      <ArtifactAction tooltip="Export artifact" onClick={onClick} disabled>
        Export
      </ArtifactAction>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Export artifact/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shares panel IDs across each independent chain and preserves controlled state", () => {
    const onOpenChange = vi.fn();
    const view = render(
      <>
        <ChainOfThought defaultOpen>
          <ChainOfThoughtHeader>First reasoning</ChainOfThoughtHeader>
          <ChainOfThoughtContent>First details</ChainOfThoughtContent>
        </ChainOfThought>
        <ChainOfThought open onOpenChange={onOpenChange}>
          <ChainOfThoughtHeader>Second reasoning</ChainOfThoughtHeader>
          <ChainOfThoughtContent>Second details</ChainOfThoughtContent>
        </ChainOfThought>
      </>,
    );
    const first = screen.getByRole("button", { name: "First reasoning" });
    const second = screen.getByRole("button", { name: "Second reasoning" });
    const firstId = first.getAttribute("aria-controls");
    const secondId = second.getAttribute("aria-controls");
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
    expect(document.getElementById(firstId ?? "")?.textContent).toBe(
      "First details",
    );
    expect(document.getElementById(secondId ?? "")?.textContent).toBe(
      "Second details",
    );
    fireEvent.click(first);
    expect(first.getAttribute("aria-expanded")).toBe("false");
    expect(second.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(second);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(second.getAttribute("aria-expanded")).toBe("true");
    expect(
      view.container.querySelectorAll('[data-slot="collapsible"]'),
    ).toHaveLength(2);
  });

  it("makes the non-native commit header a keyboard button", () => {
    render(
      <Commit>
        <CommitHeader>Commit details</CommitHeader>
        <CommitContent>Changed files</CommitContent>
      </Commit>,
    );
    const header = screen.getByRole("button", { name: "Commit details" });
    expect(header.tagName).toBe("DIV");
    expect(header.getAttribute("aria-expanded")).toBe("false");
    fireEvent.keyDown(header, { key: "Enter" });
    expect(header.getAttribute("aria-expanded")).toBe("true");
    const panelId = header.getAttribute("aria-controls");
    expect(document.getElementById(panelId ?? "")?.textContent).toBe(
      "Changed files",
    );
    fireEvent.keyDown(header, { key: " " });
    fireEvent.keyUp(header, { key: " " });
    expect(header.getAttribute("aria-expanded")).toBe("false");
  });

  it.each([undefined, 25])(
    "honors root preview delay and trigger override %s",
    async (triggerDelay) => {
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      render(
        <AttachmentHoverCard
          openDelay={200}
          closeDelay={80}
          onOpenChange={onOpenChange}
        >
          <AttachmentHoverCardTrigger href="#preview" delay={triggerDelay}>
            Preview attachment
          </AttachmentHoverCardTrigger>
          <AttachmentHoverCardContent>
            Preview contents
          </AttachmentHoverCardContent>
        </AttachmentHoverCard>,
      );
      const trigger = screen.getByRole("link", { name: "Preview attachment" });
      fireEvent.focus(trigger);
      const delay = triggerDelay ?? 200;
      await act(() => vi.advanceTimersByTimeAsync(delay - 1));
      expect(onOpenChange).not.toHaveBeenCalled();
      await act(() => vi.advanceTimersByTimeAsync(1));
      expect(onOpenChange.mock.calls.some(([open]) => open === true)).toBe(
        true,
      );
    },
  );
});
