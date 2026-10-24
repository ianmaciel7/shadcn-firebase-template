import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findReceipt,
  findToolEvidence,
  parseJsonl,
  scoreCase,
} from "./run-tool-usage-evals.mjs";

const testCase = {
  id: "DOC-01",
  expectedToolPatterns: ["context7"],
  expectedReceiptTools: ["context7"],
};
const receipt = {
  selected_tools: ["Context7"],
  evidence: ["query-docs completed"],
  outcome: "Documentation found.",
  limitation: "None.",
  validation: "Trace inspected.",
};

describe("tool-usage eval runner", () => {
  it("parses JSONL events", () => {
    assert.deepEqual(parseJsonl('{"type":"a"}\n{"type":"b"}\n'), [
      { type: "a" },
      { type: "b" },
    ]);
  });

  it("finds a structured receipt in a completed message", () => {
    assert.deepEqual(
      findReceipt([
        {
          type: "item.completed",
          item: { type: "agent_message", text: JSON.stringify(receipt) },
        },
      ]),
      receipt,
    );
  });

  it("keeps tool-call evidence separate from prose", () => {
    const events = [
      {
        type: "item.completed",
        item: {
          type: "agent_message",
          text: "Context7 and Playwright were mentioned in prose.",
        },
      },
      {
        type: "item.completed",
        item: { type: "mcp_tool_call", server: "context7", tool: "query-docs" },
      },
    ];
    assert.deepEqual(findToolEvidence(events), [
      "mcp_tool_call\ncontext7\nquery-docs",
    ]);
  });

  it("passes only when exit, trace, and receipt agree", () => {
    const events = [
      {
        type: "item.completed",
        item: { type: "mcp_tool_call", server: "context7", tool: "query-docs" },
      },
      {
        type: "item.completed",
        item: { type: "agent_message", text: JSON.stringify(receipt) },
      },
    ];
    assert.equal(scoreCase(testCase, events, 0).passed, true);
    assert.equal(scoreCase(testCase, events, 1).passed, false);
    assert.equal(scoreCase(testCase, [events[1]], 0).passed, false);
  });
});
