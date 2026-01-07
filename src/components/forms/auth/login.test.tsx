import { screen, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authUtils from "@/lib/auth";
import { renderWithProviders, userEvent } from "@/test/test-utils";

import LoginForm from "./login";

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      // Provide sensible defaults for common keys
      const translations: Record<string, string> = {
        "auth.signIn.title": "Sign In",
        "auth.signIn.emailLabel": "Email",
        "auth.signIn.passwordLabel": "Password",
        "auth.signIn.signInButton": "Sign In",
        "auth.validation.invalidEmail": "Invalid email",
        "auth.validation.passwordMinLength":
          "Password must be at least 6 characters",
        "auth.errors.invalidCredentials":
          "Invalid email or password. Please try again.",
        "auth.errors.signInFailed":
          "An error occurred during login. Please try again.",
      };
      return translations[key] || fallback || key;
    },
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

describe("LoginForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render login form with all elements", () => {
      renderWithProviders(<LoginForm />);

      expect(
        screen.getByRole("heading", { name: /sign in/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\*\*\*\*\*\*/)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("should render email and password input fields", () => {
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);

      expect(emailInput).toHaveAttribute("type", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should render email icon", () => {
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(
        emailInput.closest(".MuiFormControl-root")?.querySelector("svg")
      ).toBeInTheDocument();
    });

    it("should have show/hide password toggle button", () => {
      renderWithProviders(<LoginForm />);

      const toggleButton = screen.getByLabelText(/toggle password visibility/i);
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("should allow typing in email field", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should allow typing in password field", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    it("should toggle password visibility", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const toggleButton = screen.getByLabelText(/toggle password visibility/i);

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute("type", "password");

      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      // Click to hide password again
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Validation", () => {
    it("should show error for invalid email", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it("should show error for password less than 6 characters", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(passwordInput, "12345");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password.*6/i)).toBeInTheDocument();
      });
    });

    it("should show errors for both empty fields", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByText(/invalid|required|minimum/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Form Submission - Success", () => {
    it("should submit form with valid credentials", async () => {
      const user = userEvent.setup();
      const setAuthTokensSpy = vi.spyOn(authUtils, "setAuthTokens");
      const setUserSpy = vi.spyOn(authUtils, "setUser");

      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "q@quantum.io");
      await user.type(passwordInput, "qTask123#");
      await user.click(submitButton);

      // Wait for async submission
      await waitFor(
        () => {
          expect(setAuthTokensSpy).toHaveBeenCalled();
          expect(setUserSpy).toHaveBeenCalled();
          expect(mockNavigate).toHaveBeenCalledWith({ to: "/", replace: true });
        },
        { timeout: 3000 }
      );
    });

    it("should store user data in localStorage after successful login", async () => {
      const user = userEvent.setup();
      const setUserSpy = vi.spyOn(authUtils, "setUser");

      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "q@quantum.io");
      await user.type(passwordInput, "qTask123#");
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(setUserSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              email: "q@quantum.io",
              name: expect.any(String),
              phone: expect.any(String),
            })
          );
        },
        { timeout: 3000 }
      );
    });

    it("should show loading state during submission", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "q@quantum.io");
      await user.type(passwordInput, "qTask123#");
      await user.click(submitButton);

      // Check for loading spinner
      await waitFor(() => {
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
      });
    });

    it("should disable submit button during submission", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "q@quantum.io");
      await user.type(passwordInput, "qTask123#");
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Form Submission - Failure", () => {
    it("should show error for invalid credentials", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "wrong@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining("Invalid email or password")
          );
        },
        { timeout: 3000 }
      );
    });

    it("should not navigate on invalid credentials", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "wrong@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should re-enable submit button after failed submission", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "wrong@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(submitButton).not.toBeDisabled();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      renderWithProviders(<LoginForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\*\*\*\*\*\*/)).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*/);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Tab through form
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      // Skip visibility toggle button
      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    it("should display error messages accessibly", async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginForm />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  });
});
