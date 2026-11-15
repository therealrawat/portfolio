// Cleanup any legacy key from previous testing so it starts activated by default
if (typeof window !== 'undefined' && localStorage.getItem('ghost_cursor_enabled') !== null) {
  try {
    localStorage.removeItem('ghost_cursor_enabled');
  } catch {
    // ignore
  }
}

export function getCursorActive(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem('ghost_cursor_active');
    // Defaults to true (activated)
    return val !== null ? val === 'true' : true;
  } catch {
    return true;
  }
}

export function setCursorActive(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ghost_cursor_active', String(enabled));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('ghost-cursor-changed', { detail: enabled }));
}

export function toggleCursorActive(): boolean {
  const next = !getCursorActive();
  setCursorActive(next);
  return next;
}
