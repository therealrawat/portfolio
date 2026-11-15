export function getCursorActive(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem('ghost_cursor_enabled');
  return val !== null ? val === 'true' : true;
}

export function setCursorActive(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ghost_cursor_enabled', String(enabled));
  window.dispatchEvent(new CustomEvent('ghost-cursor-changed', { detail: enabled }));
}

export function toggleCursorActive(): boolean {
  const next = !getCursorActive();
  setCursorActive(next);
  return next;
}
