import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type RandomUserApiResponse,
  type User,
  fetchUsers,
  getUserAddress,
  getUserFullName,
} from "./users";

// Mock axios
vi.mock("axios");

describe("API Users Service", () => {
  const mockUser: User = {
    gender: "male",
    name: {
      title: "Mr",
      first: "John",
      last: "Doe",
    },
    email: "john.doe@example.com",
    phone: "+1234567890",
    location: {
      street: {
        number: 123,
        name: "Main St",
      },
      city: "New York",
      state: "NY",
      country: "USA",
    },
    picture: {
      large: "https://randomuser.me/api/portraits/men/1.jpg",
      medium: "https://randomuser.me/api/portraits/med/men/1.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/men/1.jpg",
    },
    id: {
      name: "SSN",
      value: "123-45-6789",
    },
  };

  const mockApiResponse: RandomUserApiResponse = {
    results: [mockUser],
    info: {
      seed: "test-seed",
      results: 10,
      page: 1,
      version: "1.4",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchUsers", () => {
    it("should fetch users successfully", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      const result = await fetchUsers({ page: 1, results: 10 });

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("randomuser.me"),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 1,
            results: 10,
          }),
        })
      );

      expect(result.users).toHaveLength(1);
      expect(result.users[0]).toEqual(mockUser);
    });

    it("should use default parameters when none provided", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      await fetchUsers();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 1,
            results: 10,
          }),
        })
      );
    });

    it("should include seed parameter when provided", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      await fetchUsers({ page: 1, results: 10, seed: "test-seed-123" });

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 1,
            results: 10,
            seed: "test-seed-123",
          }),
        })
      );
    });

    it("should filter users by search term client-side", async () => {
      const multipleUsers: RandomUserApiResponse = {
        ...mockApiResponse,
        results: [
          mockUser,
          {
            ...mockUser,
            name: { title: "Ms", first: "Jane", last: "Smith" },
            email: "jane.smith@example.com",
          },
          {
            ...mockUser,
            name: { title: "Mr", first: "Bob", last: "Johnson" },
            email: "bob.johnson@example.com",
          },
        ],
      };

      vi.mocked(axios.get).mockResolvedValue({ data: multipleUsers });

      const result = await fetchUsers({ searchTerm: "jane" });

      expect(result.users).toHaveLength(1);
      expect(result.users[0].name.first).toBe("Jane");
    });

    it("should handle case-insensitive search", async () => {
      const multipleUsers: RandomUserApiResponse = {
        ...mockApiResponse,
        results: [
          mockUser,
          {
            ...mockUser,
            name: { title: "Ms", first: "JANE", last: "SMITH" },
            email: "jane.smith@example.com",
          },
        ],
      };

      vi.mocked(axios.get).mockResolvedValue({ data: multipleUsers });

      const result = await fetchUsers({ searchTerm: "jane" });

      expect(result.users).toHaveLength(1);
      expect(result.users[0].name.first).toBe("JANE");
    });

    it("should trim search term whitespace", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      const result = await fetchUsers({ searchTerm: "  john  " });

      expect(result.users).toHaveLength(1);
    });

    it("should return empty array when no matches found", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      const result = await fetchUsers({ searchTerm: "nonexistent" });

      expect(result.users).toHaveLength(0);
    });

    it("should search in both first and last names", async () => {
      const multipleUsers: RandomUserApiResponse = {
        ...mockApiResponse,
        results: [
          mockUser, // John Doe
          {
            ...mockUser,
            name: { title: "Ms", first: "Jane", last: "Doe" },
          },
        ],
      };

      vi.mocked(axios.get).mockResolvedValue({ data: multipleUsers });

      const result = await fetchUsers({ searchTerm: "doe" });

      expect(result.users).toHaveLength(2);
    });

    it("should return correct pagination info", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      const result = await fetchUsers({ page: 2, results: 10 });

      expect(result.info).toEqual({
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
        seed: "test-seed",
      });
    });

    it("should throw error on API failure", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

      await expect(fetchUsers()).rejects.toThrow(
        "Failed to fetch users. Please try again."
      );
    });

    it("should log error on failure", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

      try {
        await fetchUsers();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching users:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle empty results from API", async () => {
      const emptyResponse: RandomUserApiResponse = {
        ...mockApiResponse,
        results: [],
      };

      vi.mocked(axios.get).mockResolvedValue({ data: emptyResponse });

      const result = await fetchUsers();

      expect(result.users).toHaveLength(0);
      expect(result.info.total).toBe(0);
    });

    it("should handle large result sets", async () => {
      const largeResponse: RandomUserApiResponse = {
        ...mockApiResponse,
        results: Array(50).fill(mockUser),
      };

      vi.mocked(axios.get).mockResolvedValue({ data: largeResponse });

      const result = await fetchUsers({ results: 50 });

      expect(result.users).toHaveLength(50);
    });

    it("should not include seed in params if not provided", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      await fetchUsers({ page: 1, results: 10 });

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.not.objectContaining({
            seed: expect.anything(),
          }),
        })
      );
    });
  });

  describe("getUserFullName", () => {
    it("should return full name with title", () => {
      const fullName = getUserFullName(mockUser);

      expect(fullName).toBe("Mr John Doe");
    });

    it("should handle different titles", () => {
      const user = {
        ...mockUser,
        name: { title: "Dr", first: "Jane", last: "Smith" },
      };

      const fullName = getUserFullName(user);

      expect(fullName).toBe("Dr Jane Smith");
    });

    it("should handle long names", () => {
      const user = {
        ...mockUser,
        name: {
          title: "Prof",
          first: "Elizabeth",
          last: "Windsor-Mountbatten",
        },
      };

      const fullName = getUserFullName(user);

      expect(fullName).toBe("Prof Elizabeth Windsor-Mountbatten");
    });

    it("should handle names with special characters", () => {
      const user = {
        ...mockUser,
        name: { title: "Mr", first: "José", last: "García" },
      };

      const fullName = getUserFullName(user);

      expect(fullName).toBe("Mr José García");
    });
  });

  describe("getUserAddress", () => {
    it("should return formatted address", () => {
      const address = getUserAddress(mockUser);

      expect(address).toBe("123 Main St, New York, NY, USA");
    });

    it("should handle different address formats", () => {
      const user: User = {
        ...mockUser,
        location: {
          street: { number: 456, name: "Oak Avenue" },
          city: "Los Angeles",
          state: "CA",
          country: "USA",
        },
      };

      const address = getUserAddress(user);

      expect(address).toBe("456 Oak Avenue, Los Angeles, CA, USA");
    });

    it("should handle international addresses", () => {
      const user: User = {
        ...mockUser,
        location: {
          street: { number: 10, name: "Downing Street" },
          city: "London",
          state: "England",
          country: "UK",
        },
      };

      const address = getUserAddress(user);

      expect(address).toBe("10 Downing Street, London, England, UK");
    });

    it("should handle long street names", () => {
      const user: User = {
        ...mockUser,
        location: {
          street: {
            number: 1,
            name: "Very Long Street Name With Multiple Words",
          },
          city: "City",
          state: "State",
          country: "Country",
        },
      };

      const address = getUserAddress(user);

      expect(address).toContain("Very Long Street Name With Multiple Words");
    });

    it("should handle zero street number", () => {
      const user: User = {
        ...mockUser,
        location: {
          street: { number: 0, name: "Main St" },
          city: "City",
          state: "State",
          country: "Country",
        },
      };

      const address = getUserAddress(user);

      expect(address).toContain("0 Main St");
    });
  });

  describe("Edge Cases", () => {
    it("should handle API timeout", async () => {
      vi.mocked(axios.get).mockRejectedValue(
        new Error("timeout of 30000ms exceeded")
      );

      await expect(fetchUsers()).rejects.toThrow(
        "Failed to fetch users. Please try again."
      );
    });

    it("should handle malformed API response", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: null });

      await expect(fetchUsers()).rejects.toThrow();
    });

    it("should handle special characters in search term", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      // Should not throw
      await expect(
        fetchUsers({ searchTerm: "test@#$%^&*()" })
      ).resolves.toBeDefined();
    });

    it("should handle empty string search term", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      const result = await fetchUsers({ searchTerm: "" });

      // Empty search should return all users
      expect(result.users).toHaveLength(1);
    });

    it("should handle only whitespace search term", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockApiResponse });

      const result = await fetchUsers({ searchTerm: "   " });

      // Whitespace-only search should return all users
      expect(result.users).toHaveLength(1);
    });
  });
});
