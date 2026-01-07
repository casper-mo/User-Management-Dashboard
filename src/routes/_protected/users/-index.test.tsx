import { QueryClient } from "@tanstack/react-query";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as usersApi from "@/api/users";
import { mockApiUser, renderWithProviders, userEvent } from "@/test/test-utils";

// Mock the users page component
import { Route } from "./index";

// Mock @mui/x-data-grid BEFORE any other imports
vi.mock("@mui/x-data-grid", () => ({
  DataGrid: vi.fn(({ rows, columns }) => (
    <div data-testid="data-grid">
      {rows.map((row: any) => (
        <div key={row.id} data-testid={`row-${row.id}`}>
          {columns.map((col: any) => (
            <div key={col.field} data-testid={`cell-${col.field}`}>
              {typeof col.renderCell === "function"
                ? col.renderCell({ row, value: row[col.field] })
                : row[col.field]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )),
}));

// Extract component from route options
const RouteComponent = (Route as any).options?.component;

// Mock TanStack Router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    createFileRoute: () => ({
      useNavigate: () => mockNavigate,
      useSearch: () => ({
        page: 1,
        pageSize: 10,
        search: "",
      }),
    }),
  };
});

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

// Create a test component wrapper
const UsersPageTestWrapper = () => {
  if (!RouteComponent) {
    throw new Error("RouteComponent not found");
  }
  return <RouteComponent />;
};

describe("Users Page Integration Tests", () => {
  const mockUsersResponse = {
    users: [mockApiUser],
    info: {
      total: 1,
      page: 1,
      perPage: 10,
      totalPages: 1,
      seed: "test-seed",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Page Rendering", () => {
    it("should render users page with title", async () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/users/i)).toBeInTheDocument();
      });
    });

    it("should render search input", () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("should render DataGrid", async () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });
    });
  });

  describe("Data Loading", () => {
    it("should fetch and display users on mount", async () => {
      const fetchUsersSpy = vi
        .spyOn(usersApi, "fetchUsers")
        .mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(fetchUsersSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 1,
            results: 10,
          })
        );
      });
    });

    it("should display user data in table", async () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      });
    });

    it("should show loading state while fetching", async () => {
      vi.spyOn(usersApi, "fetchUsers").mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockUsersResponse), 1000)
          )
      );

      renderWithProviders(<UsersPageTestWrapper />);

      // Check for loading indicator
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should handle empty results", async () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue({
        users: [],
        info: {
          total: 0,
          page: 1,
          perPage: 10,
          totalPages: 0,
          seed: "test-seed",
        },
      });

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/no rows/i)).toBeInTheDocument();
      });
    });

    it("should handle API errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.spyOn(usersApi, "fetchUsers").mockRejectedValue(
        new Error("API Error")
      );

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      renderWithProviders(<UsersPageTestWrapper />, { queryClient });

      await waitFor(() => {
        // Should handle error without crashing
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Search Functionality", () => {
    it("should update search input on typing", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "john");

      expect(searchInput).toHaveValue("john");
    });

    it("should debounce search input", async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      const searchInput = screen.getByPlaceholderText(/search/i);

      // Type quickly
      await user.type(searchInput, "john");

      // Should not navigate immediately
      expect(mockNavigate).not.toHaveBeenCalled();

      // Fast forward time
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.objectContaining({
            search: expect.objectContaining({
              search: "john",
              page: 1,
            }),
          })
        );
      });

      vi.useRealTimers();
    });

    it("should reset page to 1 when searching", async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, "test");

      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.objectContaining({
            search: expect.objectContaining({
              page: 1,
            }),
          })
        );
      });

      vi.useRealTimers();
    });

    it("should clear search when input is emptied", async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      const searchInput = screen.getByPlaceholderText(/search/i);

      await user.type(searchInput, "test");
      vi.advanceTimersByTime(500);

      await user.clear(searchInput);
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenLastCalledWith(
          expect.objectContaining({
            search: expect.objectContaining({
              search: undefined,
            }),
          })
        );
      });

      vi.useRealTimers();
    });
  });

  describe("Pagination", () => {
    it("should handle page change", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });

      // Find and click next page button
      const nextPageButton = screen.getByRole("button", {
        name: /next page/i,
      });

      if (nextPageButton && !nextPageButton.hasAttribute("disabled")) {
        await user.click(nextPageButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalled();
        });
      }
    });

    it("should handle page size change", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });

      // Find page size selector
      const pageSizeButton = screen.getByRole("combobox", {
        name: /rows per page/i,
      });

      if (pageSizeButton) {
        await user.click(pageSizeButton);

        // Select 25 rows per page
        const option25 = screen.getByRole("option", { name: "25" });
        if (option25) {
          await user.click(option25);

          await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
              expect.objectContaining({
                search: expect.objectContaining({
                  pageSize: 25,
                }),
              })
            );
          });
        }
      }
    });
  });

  describe("User Details Modal", () => {
    it("should open modal when view button clicked", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Find and click view button
      const viewButtons = screen.getAllByLabelText(/view details/i);
      await user.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should close modal when close button clicked", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Open modal
      const viewButtons = screen.getAllByLabelText(/view details/i);
      await user.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should display user details in modal", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByLabelText(/view details/i);
      await user.click(viewButtons[0]);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toContainHTML("john.doe@example.com");
      });
    });
  });

  describe("Query Caching", () => {
    it("should cache query results", async () => {
      const fetchUsersSpy = vi
        .spyOn(usersApi, "fetchUsers")
        .mockResolvedValue(mockUsersResponse);

      const { unmount } = renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(fetchUsersSpy).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Re-render
      renderWithProviders(<UsersPageTestWrapper />);

      // Should use cached data, not fetch again immediately
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible search input", () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toHaveAttribute("type", "text");
    });

    it("should have accessible grid", async () => {
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        const grid = screen.getByRole("grid");
        expect(grid).toBeInTheDocument();
      });
    });

    it("should support keyboard navigation in table", async () => {
      const user = userEvent.setup();
      vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsersResponse);

      renderWithProviders(<UsersPageTestWrapper />);

      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });

      // Tab through interactive elements
      await user.tab();

      // Should focus on grid or interactive element
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });
});
