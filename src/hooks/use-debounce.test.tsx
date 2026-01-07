import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "./use-debounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));

    expect(result.current).toBe("test");
  });

  it("should debounce value changes with default delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "initial" },
      }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "changed" });

    // Value should not change immediately
    expect(result.current).toBe("initial");

    // Fast-forward time by 499ms
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // Value should still not change
    expect(result.current).toBe("initial");

    // Fast-forward time by 1ms more (total 500ms)
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Value should now change
    expect(result.current).toBe("changed");
  });

  it("should debounce with custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      {
        initialProps: { value: "initial" },
      }
    );

    rerender({ value: "changed" });

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("changed");
  });

  it("should reset timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "initial" },
      }
    );

    // First change
    rerender({ value: "change1" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Second change (should reset timer)
    rerender({ value: "change2" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Still initial value
    expect(result.current).toBe("initial");

    // Third change (should reset timer again)
    rerender({ value: "change3" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("initial");

    // Now wait full delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("change3");
  });

  it("should handle different data types - numbers", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 0 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it("should handle different data types - objects", () => {
    const initialObj = { name: "John", age: 30 };
    const updatedObj = { name: "Jane", age: 25 };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: initialObj },
      }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedObj);
  });

  it("should handle different data types - arrays", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: [1, 2, 3] },
      }
    );

    expect(result.current).toEqual([1, 2, 3]);

    rerender({ value: [4, 5, 6] });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual([4, 5, 6]);
  });

  it("should handle boolean values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: false },
      }
    );

    expect(result.current).toBe(false);

    rerender({ value: true });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(true);
  });

  it("should handle null and undefined", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: null as string | null },
      }
    );

    expect(result.current).toBe(null);

    rerender({ value: "value" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("value");

    rerender({ value: null });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(null);
  });

  it("should cleanup timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("should handle zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      {
        initialProps: { value: "initial" },
      }
    );

    rerender({ value: "changed" });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe("changed");
  });

  it("should simulate real-world search input scenario", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "" },
      }
    );

    // User types "h"
    rerender({ value: "h" });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("");

    // User types "e"
    rerender({ value: "he" });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("");

    // User types "l"
    rerender({ value: "hel" });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("");

    // User types "l"
    rerender({ value: "hell" });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("");

    // User types "o"
    rerender({ value: "hello" });

    // Wait full delay
    act(() => vi.advanceTimersByTime(500));

    // Should only trigger once with final value
    expect(result.current).toBe("hello");
  });
});
