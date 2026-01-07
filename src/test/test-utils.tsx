import type { ReactElement, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";

import { ThemeProvider } from "@/theme";

/**
 * Create a test query client with optimized settings for testing
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed requests in tests
        gcTime: Infinity, // Keep cache indefinitely in tests
        staleTime: 0, // Data immediately stale
      },
      mutations: {
        retry: false,
      },
    },
  });

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  initialTheme?: "light" | "dark";
}

/**
 * Custom render function with all providers
 * Use this instead of @testing-library/react's render
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    initialTheme = "light",
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

/**
 * Helper to wait for query to finish loading
 */
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock user data for testing
 */
export const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: "123 Main St, City, Country",
};

/**
 * Mock API user response
 */
export const mockApiUser = {
  gender: "male",
  name: {
    title: "Mr",
    first: "John",
    last: "Doe",
  },
  location: {
    street: {
      number: 123,
      name: "Main St",
    },
    city: "City",
    state: "State",
    country: "Country",
    postcode: "12345",
    coordinates: {
      latitude: "0.0000",
      longitude: "0.0000",
    },
    timezone: {
      offset: "+0:00",
      description: "UTC",
    },
  },
  email: "john.doe@example.com",
  login: {
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    username: "johndoe",
    password: "password123",
    salt: "salt",
    md5: "md5hash",
    sha1: "sha1hash",
    sha256: "sha256hash",
  },
  dob: {
    date: "1990-01-01T00:00:00.000Z",
    age: 34,
  },
  registered: {
    date: "2020-01-01T00:00:00.000Z",
    age: 4,
  },
  phone: "+1234567890",
  cell: "+0987654321",
  id: {
    name: "SSN",
    value: "123-45-6789",
  },
  picture: {
    large: "https://randomuser.me/api/portraits/men/1.jpg",
    medium: "https://randomuser.me/api/portraits/med/men/1.jpg",
    thumbnail: "https://randomuser.me/api/portraits/thumb/men/1.jpg",
  },
  nat: "US",
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
