import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Node 22+ ships a native localStorage that requires --localstorage-file to
// work correctly.  When vitest forks worker processes the flag path is often
// invalid, leaving a broken Proxy that has getItem/setItem but lacks
// removeItem() and clear().  Replace it with a standards-compliant in-memory
// implementation so that tests relying on Web Storage APIs work reliably.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  [Symbol.iterator]() {
    return this.store.keys();
  }
  [name: string]: unknown;
}

// Only replace when the native implementation is broken
if (
  typeof globalThis.localStorage === "undefined" ||
  typeof globalThis.localStorage.clear !== "function" ||
  typeof globalThis.localStorage.removeItem !== "function"
) {
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });
}

beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});

afterEach(() => {
  // Cleanup after each test
  cleanup();
});
