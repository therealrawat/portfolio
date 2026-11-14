import { useEffect, useState } from 'react';

export interface ViewportState {
  width: number;
  height: number;
  isLandscape: boolean;
  isTouchDevice: boolean;
  showTouchControls: boolean;
  isCompactLandscape: boolean;
  isPortraitMobile: boolean;
  isFullscreen: boolean;
}

interface ScreenOrientationWithLock extends ScreenOrientation {
  lock?: (orientation: 'landscape' | 'portrait' | 'any' | 'natural') => Promise<void>;
}

export function getViewportSnapshot(): ViewportState {
  if (typeof window === 'undefined') {
    return {
      width: 1280,
      height: 720,
      isLandscape: true,
      isTouchDevice: false,
      showTouchControls: false,
      isCompactLandscape: false,
      isPortraitMobile: false,
      isFullscreen: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width >= height;
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const hasTouchPoints = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const minDim = Math.min(width, height);

  // Avoid treating large 1080p touchscreen desktop monitors as handheld touch UIs
  const isTouchDevice = hasCoarsePointer || (hasTouchPoints && minDim <= 1024);
  const showTouchControls = isTouchDevice && minDim <= 920;
  const isCompactLandscape = isLandscape && height <= 540;
  const isPortraitMobile = !isLandscape && (showTouchControls || width < 640);
  const isFullscreen = Boolean(document.fullscreenElement);

  return {
    width,
    height,
    isLandscape,
    isTouchDevice,
    showTouchControls,
    isCompactLandscape,
    isPortraitMobile,
    isFullscreen,
  };
}

/**
 * React hook tracking viewport dimensions, touch device status, and horizontal/portrait state.
 */
export function useViewportState(): ViewportState {
  const [state, setState] = useState<ViewportState>(() => getViewportSnapshot());

  useEffect(() => {
    const sync = () => setState(getViewportSnapshot());
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    document.addEventListener('fullscreenchange', sync);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
      document.removeEventListener('fullscreenchange', sync);
    };
  }, []);

  return state;
}

/**
 * Attempts fullscreen + landscape orientation lock from a user gesture on mobile browsers.
 */
export async function requestHorizontalFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  try {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen();
    }
  } catch {
    // Fullscreen may be unsupported (e.g., iOS Safari non-video elements)
  }

  try {
    const orientation = window.screen?.orientation as ScreenOrientationWithLock | undefined;
    if (orientation?.lock) {
      await orientation.lock('landscape');
      return true;
    }
  } catch {
    // Orientation lock is browser/PWA gated; rotate overlay acts as clean fallback
  }

  return false;
}

/**
 * Exits fullscreen and unlocks orientation safely when leaving landscape fullscreen.
 */
export async function exitFullscreenSafe(): Promise<void> {
  if (typeof document === 'undefined') return;

  try {
    const orientation = window.screen?.orientation as ScreenOrientationWithLock | undefined;
    orientation?.unlock?.();
  } catch {
    // Ignore unsupported unlock
  }

  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch {
    // Ignore exit failures
  }
}
