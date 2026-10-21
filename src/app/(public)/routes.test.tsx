import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ForgotPasswordPage from "./forgot-password/page";
import RegisterPage from "./register/page";
import SignInPage from "./sign-in/page";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/components/firebase/google-sign-in-button", () => ({
  GoogleSignInButton: () => null,
}));
vi.mock("@/components/firebase/sign-in-auth-screen", () => ({
  SignInAuthScreen: (props: {
    onSignUpClick: () => void;
    onForgotPasswordClick: () => void;
  }) => (
    <>
      <button type="button" onClick={props.onSignUpClick}>
        {"register"}
      </button>
      <button type="button" onClick={props.onForgotPasswordClick}>
        {"reset"}
      </button>
    </>
  ),
}));
vi.mock("@/components/firebase/sign-up-auth-screen", () => ({
  SignUpAuthScreen: (props: { onSignInClick: () => void }) => (
    <button type="button" onClick={props.onSignInClick}>
      {"sign in"}
    </button>
  ),
}));
vi.mock("@/components/firebase/forgot-password-auth-screen", () => ({
  ForgotPasswordAuthScreen: (props: { onBackToSignInClick: () => void }) => (
    <button type="button" onClick={props.onBackToSignInClick}>
      {"back"}
    </button>
  ),
}));

afterEach(() => {
  cleanup();
  push.mockClear();
});
describe("authentication routes", () => {
  it("navigates from sign in to registration and recovery", () => {
    render(<SignInPage />);
    fireEvent.click(screen.getByRole("button", { name: "register" }));
    fireEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(push.mock.calls).toEqual([["/register"], ["/forgot-password"]]);
  });
  it("navigates from registration back to sign in", () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: "sign in" }));
    expect(push).toHaveBeenCalledWith("/sign-in");
  });
  it("navigates from recovery back to sign in", () => {
    render(<ForgotPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: "back" }));
    expect(push).toHaveBeenCalledWith("/sign-in");
  });
});
