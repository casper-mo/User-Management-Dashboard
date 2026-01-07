import type { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/theme/ThemeProvider";

import { useTheme } from "./use-theme";

describe("useTheme Hook", () => {
  it("should throw error when used outside ThemeProvider", () => {
    // Suppress console.error for this test
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleError.mockRestore();
  });

  it("should return theme context when used inside ThemeProvider", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty("mode");
    expect(result.current).toHaveProperty("toggleTheme");
    expect(typeof result.current.toggleTheme).toBe("function");
  });

  it("should have correct initial theme mode", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(["light", "dark"]).toContain(result.current.mode);
  });

  it("should toggle theme mode", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    const initialMode = result.current.mode;

    // Toggle theme
    act(() => {
      result.current.toggleTheme();
    });

    const newMode = result.current.mode;

    // Mode should have changed
    expect(newMode).not.toBe(initialMode);

    // Toggle again
    act(() => {
      result.current.toggleTheme();
    });

    // Should be back to initial mode
    expect(result.current.mode).toBe(initialMode);
  });

  it("should persist theme mode across re-renders", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    const initialMode = result.current.mode;

    // Toggle theme
    result.current.toggleTheme();

    // Force re-render
    rerender();

    // Mode should persist
    expect(result.current.mode).not.toBe(initialMode);
  });

  it("should correctly toggle between light and dark modes", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    const mode1 = result.current.mode;
    act(() => {
      result.current.toggleTheme();
    });
    const mode2 = result.current.mode;

    if (mode1 === "light") {
      expect(mode2).toBe("dark");
    } else {
      expect(mode2).toBe("light");
    }

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe(mode1);
  });
});
