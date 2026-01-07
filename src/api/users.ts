import axios from "axios";

const RANDOM_USER_API =
  import.meta.env.VITE_RANDOM_USER_API || "https://randomuser.me/api/";

export interface UserQueryParams {
  page?: number;
  results?: number;
  seed?: string; // For consistent results across pagination
}

export interface UserSearchParams extends UserQueryParams {
  searchTerm?: string;
}

export interface Location {
  street: {
    name: string;
    number: number;
  };
  city: string;
  state: string;
  country: string;
}

/**
 * User type definition
 */
export interface User {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  location: Location;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  id: {
    name: string;
    value: string | null;
  };
}

export interface RandomUserApiResponse {
  results: User[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

/**
 * Paginated users response with metadata
 */
export interface PaginatedUsersResponse {
  users: User[];
  info: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    seed: string;
  };
}

/**
 * Fetch users with pagination, filtering, and search
 *
 * @param params - Query parameters including pagination and filters
 * @returns Promise with paginated user data
 *
 * @example
 * ```typescript
 * // Fetch first page with 10 users
 * const data = await fetchUsers({ page: 1, results: 10 });
 *
 * // Search for users with "john" in their name
 * const filtered = await fetchUsers({
 *   page: 1,
 *   results: 10,
 *   searchTerm: 'john'
 * });
 *
 * ```
 */

export const fetchUsers = async (
  params: UserSearchParams = {}
): Promise<PaginatedUsersResponse> => {
  const { page = 1, results = 10, searchTerm, seed } = params;

  const queryParams: Record<string, string | number> = {
    page,
    results,
    inc: "gender,name,email,phone,location,picture,id",
  };

  if (seed) queryParams.seed = seed;

  try {
    const response = await axios.get<RandomUserApiResponse>(RANDOM_USER_API, {
      params: queryParams,
    });

    let users = response.data.results;

    // Client-side filtering by name, API doesn't support name search
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      users = users.filter((user) => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        return fullName.includes(term);
      });
    }

    return {
      users,
      info: {
        total: users.length,
        page: response.data.info.page,
        perPage: response.data.info.results,
        totalPages: Math.ceil(users.length / response.data.info.results),
        seed: response.data.info.seed,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users. Please try again.");
  }
};

export const getUserFullName = (user: User): string => {
  return `${user.name.title} ${user.name.first} ${user.name.last}`;
};

export const getUserAddress = (user: User): string => {
  const { street, city, state, country } = user.location;
  return `${street.number} ${street.name}, ${city}, ${state}, ${country}`;
};

export default {
  fetchUsers,
  getUserFullName,
  getUserAddress,
};
