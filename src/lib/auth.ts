import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, COOKIE_OPTIONS, REFRESH_TOKEN_KEY } from './constants';

/**
 * Get the access token from cookies
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token from cookies
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Set the access token in cookies
 */
export const setAccessToken = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: COOKIE_OPTIONS.ACCESS_TOKEN_EXPIRES,
    secure: import.meta.env.PROD,
    sameSite: COOKIE_OPTIONS.SAME_SITE,
  });
};

/**
 * Set the refresh token in cookies
 */
export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: COOKIE_OPTIONS.REFRESH_TOKEN_EXPIRES,
    secure: import.meta.env.PROD,
    sameSite: COOKIE_OPTIONS.SAME_SITE,
  });
};

/**
 * Set both access and refresh tokens
 */
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Remove the access token from cookies
 */
export const removeAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};

/**
 * Remove the refresh token from cookies
 */
export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY);
};

/**
 * Clear all authentication tokens from cookies
 */
export const clearAuthTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * Check if user is authenticated (has access token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Check if refresh token exists
 */
export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};
