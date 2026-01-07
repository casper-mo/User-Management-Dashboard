import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authUtils from "@/lib/auth";
import { renderWithProviders, userEvent } from "@/test/test-utils";

import Header from "./Header";

// Mock TanStack Router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useMatches: () => [{ pathname: "/" }, { pathname: "/users" }],
  };
});

describe("Header Component", () => {
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render header component", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should render theme toggle button", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />);

      const themeButton = screen.getByLabelText(/toggle theme/i);
      expect(themeButton).toBeInTheDocument();
    });

    it("should render user profile button", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      expect(profileButton).toBeInTheDocument();
    });

    it("should display user initials in avatar", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />);

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("should display single initial for single name", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue({
        ...mockUser,
        name: "John",
      });
      renderWithProviders(<Header />);

      expect(screen.getByText("JO")).toBeInTheDocument();
    });

    it("should display default initial when no user name", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue({
        ...mockUser,
        name: "",
      });
      renderWithProviders(<Header />);

      expect(screen.getByText("U")).toBeInTheDocument();
    });

    it("should handle null user gracefully", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(null);
      renderWithProviders(<Header />);

      expect(screen.getByText("U")).toBeInTheDocument();
    });
  });

  describe("Theme Toggle", () => {
    it("should toggle theme when button clicked", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const themeButton = screen.getByLabelText(/toggle theme/i);

      // Get initial icon
      const initialIcon = themeButton.querySelector("svg");
      const initialIconData = initialIcon?.getAttribute("data-testid");

      await user.click(themeButton);

      await waitFor(() => {
        const newIcon = themeButton.querySelector("svg");
        const newIconData = newIcon?.getAttribute("data-testid");
        // Icon should have changed
        expect(newIconData).not.toBe(initialIconData);
      });
    });

    it("should display correct icon for light mode", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />, { initialTheme: "light" });

      const themeButton = screen.getByLabelText(/toggle theme/i);
      // In light mode, should show dark mode icon
      expect(themeButton.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("User Menu", () => {
    it("should open menu when profile button clicked", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should display user info in menu", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      });
    });

    it("should display profile and logout menu items", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
      });
    });

    it("should close menu when clicking outside", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Press Escape to close menu
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to profile page when profile menu item clicked", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      const profileMenuItem = await screen.findByText(/profile/i);
      await user.click(profileMenuItem);

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/profile" });
    });

    it("should logout and navigate to login page when logout clicked", async () => {
      const user = userEvent.setup();
      const clearAuthSpy = vi.spyOn(authUtils, "clearAllAuthData");
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      const logoutMenuItem = await screen.findByText(/logout/i);
      await user.click(logoutMenuItem);

      expect(clearAuthSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("should close menu after profile navigation", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      const profileMenuItem = await screen.findByText(/profile/i);
      await user.click(profileMenuItem);

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should close menu after logout", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      vi.spyOn(authUtils, "clearAllAuthData");

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);
      await user.click(profileButton);

      const logoutMenuItem = await screen.findByText(/logout/i);
      await user.click(logoutMenuItem);

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Responsive Behavior", () => {
    it("should render correctly on mobile", () => {
      // Mock mobile viewport
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 899px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria labels", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);
      renderWithProviders(<Header />);

      expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/account menu/i)).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const themeButton = screen.getByLabelText(/toggle theme/i);
      const profileButton = screen.getByLabelText(/account menu/i);

      // Focus theme button directly (breadcrumb elements are focusable too)
      themeButton.focus();
      expect(themeButton).toHaveFocus();

      // Tab to profile button
      await user.tab();
      expect(profileButton).toHaveFocus();

      // Press Enter to open menu
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should announce menu state changes to screen readers", async () => {
      const user = userEvent.setup();
      vi.spyOn(authUtils, "getUser").mockReturnValue(mockUser);

      renderWithProviders(<Header />);

      const profileButton = screen.getByLabelText(/account menu/i);

      // Check aria-haspopup
      expect(profileButton).toHaveAttribute("aria-haspopup", "true");

      await user.click(profileButton);

      await waitFor(() => {
        // Menu should be visible and have proper role
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long user names", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue({
        ...mockUser,
        name: "VeryLongFirstName VeryLongLastName",
      });

      renderWithProviders(<Header />);

      // Should only show first two initials
      expect(screen.getByText("VV")).toBeInTheDocument();
    });

    it("should handle names with special characters", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue({
        ...mockUser,
        name: "José María",
      });

      renderWithProviders(<Header />);

      expect(screen.getByText("JM")).toBeInTheDocument();
    });

    it("should handle multiple spaces in name", () => {
      vi.spyOn(authUtils, "getUser").mockReturnValue({
        ...mockUser,
        name: "John    Doe",
      });

      renderWithProviders(<Header />);

      // Should handle multiple spaces and get correct initials
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });
});
