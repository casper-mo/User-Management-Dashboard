/**
 * Authentication token keys for cookie storage
 */
const ACCESS_TOKEN_KEY = 'user_management_access_token';
const REFRESH_TOKEN_KEY = 'user_management_refresh_token';

/**
 * Cookie configuration options
 */
const COOKIE_OPTIONS = {
  ACCESS_TOKEN_EXPIRES: 7, // days
  REFRESH_TOKEN_EXPIRES: 30, // days
  SAME_SITE: 'strict' as const,
} as const;

export { ACCESS_TOKEN_KEY, COOKIE_OPTIONS, REFRESH_TOKEN_KEY };

