import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type User,
  clearAllAuthData,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  getUser,
  hasRefreshToken,
  isAuthenticated,
  removeAccessToken,
  removeRefreshToken,
  removeUser,
  setAccessToken,
  setAuthTokens,
  setRefreshToken,
  setUser,
} from "./auth";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";

// Mock js-cookie
vi.mock("js-cookie");

describe("Auth Utilities", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("Token Management - Access Token", () => {
    it("should get access token from cookies", () => {
      const mockToken = "mock-access-token";
      vi.mocked(Cookies.get).mockReturnValue(mockToken as any);

      const token = getAccessToken();

      expect(Cookies.get).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(token).toBe(mockToken);
    });

    it("should return undefined when no access token exists", () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as any);

      const token = getAccessToken();

      expect(token).toBeUndefined();
    });

    it("should set access token in cookies with correct options", () => {
      const mockToken = "new-access-token";
      setAccessToken(mockToken);

      expect(Cookies.set).toHaveBeenCalledWith(
        ACCESS_TOKEN_KEY,
        mockToken,
        expect.objectContaining({
          expires: expect.any(Number),
          sameSite: "strict",
        })
      );
    });

    it("should remove access token from cookies", () => {
      removeAccessToken();

      expect(Cookies.remove).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    });
  });

  describe("Token Management - Refresh Token", () => {
    it("should get refresh token from cookies", () => {
      const mockToken = "mock-refresh-token";
      vi.mocked(Cookies.get).mockReturnValue(mockToken as any);

      const token = getRefreshToken();

      expect(Cookies.get).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
      expect(token).toBe(mockToken);
    });

    it("should set refresh token in cookies", () => {
      const mockToken = "new-refresh-token";
      setRefreshToken(mockToken);

      expect(Cookies.set).toHaveBeenCalledWith(
        REFRESH_TOKEN_KEY,
        mockToken,
        expect.objectContaining({
          expires: expect.any(Number),
          sameSite: "strict",
        })
      );
    });

    it("should remove refresh token from cookies", () => {
      removeRefreshToken();

      expect(Cookies.remove).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    });

    it("should check if refresh token exists", () => {
      vi.mocked(Cookies.get).mockReturnValue("some-token" as any);

      expect(hasRefreshToken()).toBe(true);

      vi.mocked(Cookies.get).mockReturnValue(undefined as any);

      expect(hasRefreshToken()).toBe(false);
    });
  });

  describe("Token Management - Combined Operations", () => {
    it("should set both access and refresh tokens", () => {
      const accessToken = "access-token";
      const refreshToken = "refresh-token";

      setAuthTokens(accessToken, refreshToken);

      expect(Cookies.set).toHaveBeenCalledTimes(2);
      expect(Cookies.set).toHaveBeenCalledWith(
        ACCESS_TOKEN_KEY,
        accessToken,
        expect.any(Object)
      );
      expect(Cookies.set).toHaveBeenCalledWith(
        REFRESH_TOKEN_KEY,
        refreshToken,
        expect.any(Object)
      );
    });

    it("should clear all authentication tokens", () => {
      clearAuthTokens();

      expect(Cookies.remove).toHaveBeenCalledTimes(2);
      expect(Cookies.remove).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(Cookies.remove).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    });
  });

  describe("Authentication Status", () => {
    it("should return true when user is authenticated", () => {
      vi.mocked(Cookies.get).mockReturnValue("valid-token" as any);

      expect(isAuthenticated()).toBe(true);
    });

    it("should return false when user is not authenticated", () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined as any);

      expect(isAuthenticated()).toBe(false);
    });

    it("should return false for empty token string", () => {
      vi.mocked(Cookies.get).mockReturnValue("" as any);

      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("User Management - LocalStorage", () => {
    const mockUser: User = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      address: "123 Main St, City, Country",
      jobTitle: "Senior Developer",
      yearOfExperience: 5,
      workingHours: 40,
    };

    it("should store user in localStorage", () => {
      setUser(mockUser);

      const storedUser = localStorage.getItem("user");
      expect(storedUser).toBeTruthy();
      expect(JSON.parse(storedUser!)).toEqual(mockUser);
    });

    it("should retrieve user from localStorage", () => {
      localStorage.setItem("user", JSON.stringify(mockUser));

      const user = getUser();

      expect(user).toEqual(mockUser);
    });

    it("should return null when no user exists", () => {
      const user = getUser();

      expect(user).toBeNull();
    });

    it("should handle corrupted user data gracefully", () => {
      localStorage.setItem("user", "invalid-json{");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const user = getUser();

      expect(user).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to parse user from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should remove user from localStorage", () => {
      localStorage.setItem("user", JSON.stringify(mockUser));

      removeUser();

      expect(localStorage.getItem("user")).toBeNull();
    });

    it("should handle user without optional fields", () => {
      const minimalUser: User = {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+1987654321",
        address: "456 Oak Ave",
      };

      setUser(minimalUser);
      const retrievedUser = getUser();

      expect(retrievedUser).toEqual(minimalUser);
      expect(retrievedUser?.jobTitle).toBeUndefined();
      expect(retrievedUser?.yearOfExperience).toBeUndefined();
    });
  });

  describe("Clear All Auth Data", () => {
    it("should clear both tokens and user data", () => {
      const mockUser: User = {
        name: "Test User",
        email: "test@example.com",
        phone: "123",
        address: "Test Address",
      };

      // Setup data
      localStorage.setItem("user", JSON.stringify(mockUser));

      // Clear all
      clearAllAuthData();

      // Verify tokens removed
      expect(Cookies.remove).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(Cookies.remove).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);

      // Verify user removed
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("should work even when no data exists", () => {
      expect(() => clearAllAuthData()).not.toThrow();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle localStorage quota exceeded", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error
      const originalSetItem = window.localStorage.setItem;
      window.localStorage.setItem = vi.fn(() => {
        throw new Error("QuotaExceededError");
      });

      const largeUser: User = {
        name: "Test",
        email: "test@test.com",
        phone: "123",
        address: "a".repeat(10000),
      };

      setUser(largeUser);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save user to localStorage:",
        expect.any(Error)
      );

      // Restore
      window.localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });

    it("should handle null and undefined values", () => {
      vi.mocked(Cookies.get).mockReturnValue(null as any);
      expect(getAccessToken()).toBeNull();

      vi.mocked(Cookies.get).mockReturnValue(undefined as any);
      expect(getAccessToken()).toBeUndefined();
    });
  });
});
