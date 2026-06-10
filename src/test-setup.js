import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 22+'s experimental localStorage global shadows jsdom's and is undefined
// without --localstorage-file; give tests a real in-memory implementation.
const store = new Map();
const localStorageMock = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

afterEach(() => {
    cleanup();
    localStorage.clear();
});

// jsdom has no scrollIntoView; ChatPanel calls it after every message render.
window.HTMLElement.prototype.scrollIntoView = () => {};
