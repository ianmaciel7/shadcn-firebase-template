import { describe, expect, it } from "vitest";
import { getSafeReturnUrl } from "./return-url";

describe("getSafeReturnUrl", () => {
  it.each([
    ["/profile", "/profile"],
    ["/settings?tab=security", "/settings?tab=security"],
    ["/notes/42?sort=latest#details", "/notes/42?sort=latest#details"],
    [null, "/profile"],
    ["https://evil.example/steal", "/profile"],
    ["//evil.example/steal", "/profile"],
    ["/\\evil.example", "/profile"],
    ["/sign-in", "/profile"],
    ["/register?next=/profile", "/profile"],
    ["/forgot-password", "/profile"],
    ["/%2e%2e/sign-in", "/profile"],
  ])("resolves %s to %s", (input, expected) => {
    expect(getSafeReturnUrl(input)).toBe(expected);
  });
});
