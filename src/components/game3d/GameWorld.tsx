import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Maximize2 } from 'lucide-react';
import { ThreeEngine, type ActionPrompt, type LoadProgressState } from './ThreeEngine';
import { type AvatarEmoteName } from './AvatarController';
import GameHUD from './GameHUD';
import StationModal from './StationModal';
import { type StationData } from '../../data/stationsData';
import { sfx } from '../../utils/audio';
import { useViewMode } from '../../context/ViewModeContext';
import { requestHorizontalFullscreen, useViewportState } from '../../utils/mobileViewport';

interface GameWorldProps {
  onOpenAI?: () => void;
}

export default function GameWorld({ onOpenAI }: GameWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);
  const { setMode } = useViewMode();
  const viewport = useViewportState();
  const [portraitBypassed, setPortraitBypassed] = useState(false);

  const [nearbyStation, setNearbyStation] = useState<StationData | null>(null);
  const [activeModalStation, setActiveModalStation] = useState<StationData | null>(null);
  const [speed, setSpeed] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 6, rotation: 0 });
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [actionPrompt, setActionPrompt] = useState<ActionPrompt | null>(null);
  const [isDriving, setIsDriving] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [activeEmote, setActiveEmote] = useState<AvatarEmoteName | null>(null);
  const [loadState, setLoadState] = useState<LoadProgressState>({
    progress: 2,
    stage: 'Preparing 3D workspace renderer...',
    ready: false,
  });

  // Initialize Three.js Engine
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new ThreeEngine(containerRef.current, {
      onNearbyStation: (station) => {
        setNearbyStation(station);
      },
      onInspectStation: (station) => {
        setActiveModalStation(station);
        sfx.playInteract();
      },
      onSpeedChange: (currentSpeed) => {
        setSpeed(currentSpeed);
      },
      onPlayerState: (x, z, rotation) => {
        setPlayerPos({ x, z, rotation });
      },
      onTeleportState: (active) => {
        setIsTeleporting(active);
      },
      onActionPrompt: (prompt) => {
        setActionPrompt(prompt);
      },
      onDriveState: (driving) => {
        setIsDriving(driving);
      },
      onAvatarLoaded: () => {
        setAvatarLoaded(true);
      },
      onEmoteChange: (emote) => {
        setActiveEmote(emote);
      },
      onLoadProgress: (state) => {
        setLoadState(state);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleTeleport = useCallback((stationId: string) => {
    engineRef.current?.teleportToStation(stationId);
  }, []);

  const handleJoystickMove = useCallback((x: number, y: number) => {
    engineRef.current?.setJoystickVector(x, y);
  }, []);

  const handleJump = useCallback(() => {
    engineRef.current?.triggerJump();
  }, []);

  const handleTogglePickThrow = useCallback(() => {
    engineRef.current?.togglePickThrow();
  }, []);

  const handleToggleRover = useCallback(() => {
    engineRef.current?.toggleRoverDrive();
  }, []);

  const handleTriggerEmote = useCallback((emote: AvatarEmoteName) => {
    engineRef.current?.triggerAvatarEmote(emote);
  }, []);

  const handleInspectStation = useCallback((station: StationData) => {
    setActiveModalStation(station);
    sfx.playInteract();
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#090807] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Staged 3D Scene & Shader Warmup Preloader */}
      <AnimatePresence>
        {!loadState.ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-[#090807] px-4 py-4 text-white"
            aria-busy="true"
            aria-live="polite"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-orange-500/15 blur-[110px]" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#12100e]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-orange-400">
                    Priyanshu • Executive HQ
                  </span>
                </div>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              </div>

              <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold tracking-tight text-white">
                Preparing 3D Corporate Office
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                Streaming office architecture, workstations, interactive advisors, and pre-compiling graphics shaders so navigation stays smooth.
              </p>

              <div className="mt-4 sm:mt-6">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(4, Math.min(100, loadState.progress))}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-medium text-neutral-300">{loadState.stage}</span>
                  <span className="shrink-0 font-mono tabular-nums text-orange-400">
                    {loadState.progress}%
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4">
                <span className="text-[11px] text-neutral-500">
                  {viewport.isPortraitMobile ? 'Best experienced horizontally (landscape)' : 'WebGL Interactive Tour'}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('2d')}
                  className="text-xs font-medium text-neutral-400 transition-colors hover:text-white"
                >
                  Switch to 2D Portfolio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portrait Mobile Orientation Prompt -> Encourages Horizontal Landscape Mode */}
      <AnimatePresence>
        {loadState.ready && viewport.isPortraitMobile && !portraitBypassed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#090807]/90 px-5 py-6 text-white backdrop-blur-xl"
          >
            <div className="w-full max-w-sm rounded-2xl border border-orange-500/30 bg-[#14110f]/95 p-6 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/15 text-orange-400">
                <RotateCw className="h-7 w-7 animate-spin" style={{ animationDuration: '5s' }} />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-orange-400">
                Horizontal View Recommended
              </span>
              <h2 className="mt-2 text-lg font-bold tracking-tight text-white">
                Rotate Phone to Landscape
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                The 3D Corporate Office &amp; dual-thumb controls are designed to be played horizontally rather than vertically. Turn your device sideways for full widescreen framing.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playInteract();
                    void requestHorizontalFullscreen();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span>Enter Horizontal Fullscreen</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sfx.playSwitch();
                    setMode('2d');
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-neutral-200 transition-colors hover:bg-white/10"
                >
                  Switch to Standard 2D Portfolio
                </button>

                <button
                  type="button"
                  onClick={() => setPortraitBypassed(true)}
                  className="mt-1 text-[11px] text-neutral-500 underline underline-offset-4 hover:text-neutral-300"
                >
                  Continue vertically anyway
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Game HUD with Executive Office Map & Controls */}
      {loadState.ready && (
        <GameHUD
          nearbyStation={nearbyStation}
          onInspectStation={handleInspectStation}
          onTeleport={handleTeleport}
          speed={speed}
          playerPos={playerPos}
          onJoystickMove={handleJoystickMove}
          onJump={handleJump}
          isTeleporting={isTeleporting}
          actionPrompt={actionPrompt}
          isDriving={isDriving}
          onTogglePickThrow={handleTogglePickThrow}
          onToggleRover={handleToggleRover}
          avatarLoaded={avatarLoaded}
          activeEmote={activeEmote}
          onTriggerEmote={handleTriggerEmote}
          onOpenAI={onOpenAI}
        />
      )}

      {/* Station Details Inspection Modal */}
      <StationModal
        station={activeModalStation}
        onClose={() => setActiveModalStation(null)}
        onOpenAI={onOpenAI}
      />
    </div>
  );
}
