import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Compass,
  FolderGit2,
  Cpu,
  Award,
  Radio,
  HelpCircle,
  ArrowUp,
  MousePointer,
  Car,
  LogOut,
  Package,
  Activity,
  Briefcase,
  Maximize2,
  Minimize2,
  Bot,
} from 'lucide-react';
import { STATIONS, type StationData } from '../../data/stationsData';
import { useViewMode } from '../../context/ViewModeContext';
import { sfx } from '../../utils/audio';
import {
  exitFullscreenSafe,
  requestHorizontalFullscreen,
  useViewportState,
} from '../../utils/mobileViewport';
import { type ActionPrompt } from './ThreeEngine';
import { type AvatarEmoteName } from './AvatarController';

interface GameHUDProps {
  nearbyStation: StationData | null;
  onInspectStation: (station: StationData) => void;
  onTeleport: (stationId: string) => void;
  speed: number;
  playerPos: { x: number; z: number; rotation: number };
  onJoystickMove: (x: number, y: number) => void;
  onJump: () => void;
  isTeleporting?: boolean;
  actionPrompt?: ActionPrompt | null;
  isDriving?: boolean;
  onTogglePickThrow?: () => void;
  onToggleRover?: () => void;
  avatarLoaded?: boolean;
  activeEmote?: AvatarEmoteName | null;
  onTriggerEmote?: (emote: AvatarEmoteName) => void;
  onOpenAI?: () => void;
}

export default function GameHUD({
  nearbyStation,
  onInspectStation,
  onTeleport,
  speed,
  playerPos,
  onJoystickMove,
  onJump,
  isTeleporting = false,
  actionPrompt = null,
  isDriving = false,
  onTogglePickThrow,
  onToggleRover,
  avatarLoaded = true,
  activeEmote = null,
  onTriggerEmote,
  onOpenAI,
}: GameHUDProps) {
  const { mode, setMode } = useViewMode();
  const viewport = useViewportState();
  const { showTouchControls, isCompactLandscape, isLandscape, isFullscreen } = viewport;
  const [isMuted, setIsMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRadar, setShowRadar] = useState(true);
  const [showMoves, setShowMoves] = useState(false);

  // Virtual Joystick State
  const [joystickThumbPos, setJoystickThumbPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Keyboard shortcut handlers for station inspection & spacebar safety
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }
      // Prevent Spacebar from triggering focused DOM button
      if (e.code === 'Space') {
        e.preventDefault();
      }
      if ((e.code === 'KeyE' || e.code === 'Enter') && nearbyStation) {
        onInspectStation(nearbyStation);
        sfx.playInteract();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyStation, onInspectStation]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sfx.setMuted(nextMuted);
    if (!nextMuted) {
      sfx.playInteract();
    }
  };

  // Touch Joystick Handlers
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const maxRadius = isCompactLandscape ? 36 : 45;

    let dx = touch.clientX - touchStartPos.current.x;
    let dy = touch.clientY - touchStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    setJoystickThumbPos({ x: dx, y: dy });
    onJoystickMove(dx / maxRadius, dy / maxRadius);
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    setJoystickThumbPos({ x: 0, y: 0 });
    onJoystickMove(0, 0);
  };

  const toggleFullscreen = () => {
    sfx.playInteract();
    if (isFullscreen) {
      void exitFullscreenSafe();
    } else {
      void requestHorizontalFullscreen();
    }
  };

  // HQ Map calculations (scaled for enclosed 58m x 54m tiled corporate floorplan)
  const radarScale = 40 / 34;
  const radarPlayerX = 50 + playerPos.x * radarScale;
  const radarPlayerY = 50 + playerPos.z * radarScale;
  const playerDeg = (playerPos.rotation * 180) / Math.PI;

  const fireTouchButton = (e: React.PointerEvent<HTMLButtonElement>, action?: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.blur();
    action?.();
  };

  const renderMovesTray = () => (
    <AnimatePresence>
      {showMoves && !isDriving && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.16 }}
          className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-neutral-950/90 backdrop-blur-2xl border border-orange-500/35 rounded-2xl shadow-2xl shadow-orange-950/50 max-w-full overflow-x-auto scrollbar-none"
        >
          {[
            { id: 'punch' as AvatarEmoteName, label: 'Punch', key: 'Q' },
            { id: 'kick' as AvatarEmoteName, label: 'Kick', key: 'X' },
            { id: 'kick_punch' as AvatarEmoteName, label: 'Combo', key: 'C' },
            { id: 'pushups' as AvatarEmoteName, label: 'Push-ups', key: 'V' },
          ].map((move) => {
            const isActive = activeEmote === move.id;
            return (
              <button
                key={move.id}
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onTriggerEmote?.(move.id);
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shrink-0 ${
                  isActive
                    ? 'bg-orange-500 text-black shadow-md shadow-orange-500/40'
                    : 'bg-white/5 hover:bg-white/15 text-neutral-200'
                }`}
              >
                <span className="text-[10px] sm:text-[11px]">{move.label}</span>
                {!showTouchControls && (
                  <span
                    className={`px-1 py-0.5 rounded text-[9px] font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-orange-300'
                    }`}
                  >
                    {move.key}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderZoneDock = (includeDesktopActions: boolean) => (
    <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-neutral-950/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto max-w-full scrollbar-none">
      {!isCompactLandscape && (
        <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 px-2.5 hidden sm:inline shrink-0">
          Zones:
        </span>
      )}
      {[
        { id: 'spawn', label: 'Overview', icon: Compass },
        { id: 'projects', label: 'Case Studies', icon: FolderGit2 },
        { id: 'tech', label: 'Stack', icon: Cpu },
        { id: 'experience', label: 'Track Record', icon: Award },
        { id: 'contact', label: 'Hire Me', icon: Radio },
      ].map((item) => {
        const Icon = item.icon;
        const isNearbyZone = nearbyStation?.id === item.id;
        return (
          <button
            type="button"
            key={item.id}
            onClick={(e) => {
              e.currentTarget.blur();
              sfx.playInteract();
              if (isNearbyZone && nearbyStation) {
                onInspectStation(nearbyStation);
              } else {
                onTeleport(item.id);
              }
            }}
            title={isNearbyZone && nearbyStation ? `Open ${nearbyStation.name} Brief [E]` : `Jump to ${item.label}`}
            className={`flex items-center gap-1 sm:gap-1.5 ${
              isCompactLandscape ? 'px-2 py-1 text-[10px]' : 'px-2.5 sm:px-3 py-1.5 text-xs'
            } rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shrink-0 ${
              isNearbyZone
                ? 'bg-orange-500/20 border border-orange-400/70 text-white shadow-md shadow-orange-500/20'
                : 'bg-white/5 hover:bg-white/15 border border-transparent text-neutral-300 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="text-[10px] sm:text-[11px] whitespace-nowrap">{item.label}</span>
            {isNearbyZone && (
              <span className="px-1 py-0.5 bg-white text-black rounded text-[9px] font-mono font-bold leading-none">
                {showTouchControls ? 'OPEN' : 'E'}
              </span>
            )}
          </button>
        );
      })}

      {includeDesktopActions && (
        <>
          <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block shrink-0" />

          {/* Drive Rover / Exit Button in Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleRover?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 ${
              isDriving
                ? 'bg-orange-500/30 border border-orange-400 text-orange-200 shadow-orange-500/30 animate-pulse'
                : actionPrompt?.type === 'enter_rover'
                  ? 'bg-amber-500/25 border border-amber-400/75 text-amber-100 shadow-amber-500/25'
                  : 'bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white'
            }`}
            title={actionPrompt?.type === 'enter_rover' ? `${actionPrompt.label} [R]` : 'Enter or Exit Executive Rover [R]'}
          >
            {isDriving ? (
              <>
                <LogOut className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px]">Exit [R]</span>
              </>
            ) : (
              <>
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Rover [R]</span>
              </>
            )}
          </button>

          {/* Pick Up / Throw Prop Button in Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onTogglePickThrow?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 shrink-0 ${
              actionPrompt?.type === 'throw'
                ? 'bg-amber-500/30 border border-amber-400 text-amber-100 shadow-md shadow-amber-500/25'
                : actionPrompt?.type === 'pickup'
                  ? 'bg-orange-500/25 border border-orange-400/75 text-orange-100 shadow-md shadow-orange-500/20'
                  : 'bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white'
            }`}
            title={
              actionPrompt?.type === 'pickup' || actionPrompt?.type === 'throw'
                ? `${actionPrompt.label} [G]`
                : 'Pick Up or Throw Office Object [G]'
            }
          >
            <Package className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] hidden sm:inline">
              {actionPrompt?.type === 'throw' ? 'Throw [G]' : 'Grab/Throw [G]'}
            </span>
          </button>

          {/* Jump Action Trigger in Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onJump();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 shrink-0"
            title="Jump [Space]"
          >
            <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Jump [Space]</span>
          </button>

          {/* Character Moves / Emotes Tray Toggle */}
          {!isDriving && (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                sfx.playInteract();
                setShowMoves((v) => !v);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shrink-0 ${
                showMoves || activeEmote
                  ? 'bg-orange-500/25 border border-orange-400/60 text-orange-200'
                  : 'bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white'
              }`}
              title="Toggle Character Moves & Emotes (Punch, Kick, Combo, Push-ups)"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] hidden sm:inline">Moves</span>
            </button>
          )}
        </>
      )}
    </div>
  );

  const renderJoystick = () => (
    <div
      onTouchStart={handleJoystickTouchStart}
      onTouchMove={handleJoystickTouchMove}
      onTouchEnd={handleJoystickTouchEnd}
      className={`pointer-events-auto relative shrink-0 rounded-full bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center touch-none ${
        isCompactLandscape ? 'w-20 h-20' : 'w-24 h-24'
      }`}
    >
      <div
        className={`rounded-full bg-orange-500/80 shadow-lg shadow-orange-500/50 ${
          isCompactLandscape ? 'w-8 h-8' : 'w-10 h-10'
        }`}
        style={{
          transform: `translate(${joystickThumbPos.x}px, ${joystickThumbPos.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      />
    </div>
  );

  const renderTouchButtons = () => {
    const btnSize = isCompactLandscape ? 'w-12 h-12' : 'w-13 h-13';
    const jumpSize = isCompactLandscape ? 'w-12 h-12' : 'w-14 h-14';
    return (
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0 touch-none">
        <button
          type="button"
          onPointerDown={(e) => fireTouchButton(e, onTogglePickThrow)}
          className={`${btnSize} rounded-full border flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg ${
            actionPrompt?.type === 'throw'
              ? 'bg-amber-500/35 border-amber-300 shadow-amber-500/30'
              : actionPrompt?.type === 'pickup'
                ? 'bg-orange-500/35 border-orange-300 shadow-orange-500/30'
                : 'bg-orange-500/20 active:bg-orange-500/60 border-orange-400/50 shadow-orange-500/20'
          }`}
          title="Pick Up or Throw"
        >
          <Package className="w-4 h-4 text-orange-300" />
          <span className="text-[7px] font-mono uppercase font-bold tracking-wider">
            {actionPrompt?.type === 'throw' ? 'THROW' : 'GRAB'}
          </span>
        </button>

        <button
          type="button"
          onPointerDown={(e) => fireTouchButton(e, onToggleRover)}
          className={`${btnSize} rounded-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg ${
            isDriving
              ? 'bg-red-500/30 border border-red-400 text-red-200'
              : actionPrompt?.type === 'enter_rover'
                ? 'bg-amber-500/35 border border-amber-300 shadow-amber-500/30'
                : 'bg-amber-500/20 active:bg-amber-500/60 border border-amber-400/50'
          }`}
          title="Drive or Exit Rover"
        >
          {isDriving ? <LogOut className="w-4 h-4 text-red-300" /> : <Car className="w-4 h-4 text-amber-300" />}
          <span className="text-[7px] font-mono uppercase font-bold tracking-wider">
            {isDriving ? 'EXIT' : 'ROVER'}
          </span>
        </button>

        <button
          type="button"
          onPointerDown={(e) => fireTouchButton(e, onJump)}
          className={`${jumpSize} rounded-full bg-orange-500/20 active:bg-orange-500/60 border border-orange-400/50 flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-orange-500/25`}
          title="Jump"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
          <span className="text-[7px] sm:text-[8px] font-mono uppercase font-bold tracking-wider">JUMP</span>
        </button>
      </div>
    );
  };

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-40 flex flex-col justify-between select-none font-sans [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))] ${
        isCompactLandscape || showTouchControls ? 'py-2 sm:py-3' : 'py-4 sm:py-6 sm:px-6'
      }`}
    >
      {/* --- TOP BAR --- */}
      <header className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 w-full max-w-7xl mx-auto">
        {/* Brand & View Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shrink-0">
            <span className="text-sm font-black tracking-tighter text-white">PR.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 sm:p-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl shrink-0">
            <button
              onClick={() => {
                sfx.playSwitch();
                setMode('2d');
              }}
              className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                mode === '2d'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📄 Standard</span>
            </button>
            <button
              onClick={() => {
                sfx.playSwitch();
                setMode('3d');
              }}
              className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                mode === '3d'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🎮 3D World</span>
            </button>
          </div>

          {/* Avatar Streaming Indicator Badge */}
          {!avatarLoaded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-black/75 border border-orange-500/40 text-orange-300 rounded-full text-[11px] font-mono shrink-0"
            >
              <div className="w-2.5 h-2.5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <span className="hidden lg:inline">Loading 3D Character...</span>
              <span className="lg:hidden">Loading...</span>
            </motion.div>
          )}

          {/* Active Driving Indicator Badge */}
          {isDriving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full text-[11px] font-mono font-bold shadow-lg shadow-amber-500/20 animate-pulse shrink-0"
            >
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>ROVER ACTIVE</span>
            </motion.div>
          )}
        </div>

        {/* Right Quick Actions, Speedometer (compact/touch), Audio, Fullscreen & Help */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {(showTouchControls || isCompactLandscape) && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-mono text-neutral-300">
              <span>{isDriving ? 'ROVER' : 'PACE'}</span>
              <span className="text-white font-bold tabular-nums">{speed}</span>
              <span className="text-neutral-500">KM/H</span>
            </div>
          )}

          {/* Quick Executive Brief / Hire Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              sfx.playInteract();
              onInspectStation(STATIONS[0]);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/40 text-orange-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Open Priyanshu's Executive Brief & Hiring Summary"
          >
            <Briefcase className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">Hire / Brief</span>
          </button>

          {/* Touch/Compact Moves Emote Trigger in Header */}
          {(showTouchControls || isCompactLandscape) && !isDriving && (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                sfx.playInteract();
                setShowMoves((v) => !v);
              }}
              className={`p-1.5 sm:p-2 backdrop-blur-xl border rounded-xl transition-colors ${
                showMoves || activeEmote
                  ? 'bg-orange-500/25 border-orange-400/60 text-orange-200'
                  : 'bg-black/60 border-white/10 hover:border-white/20 text-neutral-300 hover:text-white'
              }`}
              title="Toggle Character Moves & Emotes"
              aria-label="Toggle Character Moves"
            >
              <Activity className="w-4 h-4 text-orange-400" />
            </button>
          )}

          {/* Compact AI Assistant Trigger (replaces overlapping corner orb on mobile/compact 3D) */}
          {(showTouchControls || isCompactLandscape) && onOpenAI && (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                sfx.playInteract();
                onOpenAI();
              }}
              className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-200 hover:text-white transition-colors"
              title="Open AI Assistant"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-4 h-4 text-orange-400" />
            </button>
          )}

          {/* HQ Map Toggle */}
          <button
            onClick={() => setShowRadar(!showRadar)}
            className="hidden sm:flex p-1.5 sm:p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
            title={showRadar ? 'Hide HQ Map' : 'Show HQ Map'}
            aria-label="Toggle HQ Map"
          >
            <Compass className={`w-4 h-4 ${showRadar ? 'text-orange-400' : 'text-neutral-500'}`} />
          </button>

          {/* Landscape Fullscreen Toggle */}
          {(showTouchControls || isCompactLandscape) && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Horizontal Fullscreen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-orange-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
          </button>

          {/* Help Button */}
          <button
            onClick={() => {
              sfx.playInteract();
              setShowHelp(true);
            }}
            className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
            title="Controls & Help"
            aria-label="Controls and Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- EXECUTIVE HQ FLOORPLAN MINIMAP (TOP RIGHT) --- */}
      {showRadar && (
        <div
          className={`pointer-events-auto absolute hidden sm:block select-none ${
            isCompactLandscape ? 'top-13 right-3' : 'top-20 right-6'
          }`}
        >
          <div
            className={`relative rounded-full bg-black/85 backdrop-blur-2xl border border-orange-500/30 p-1 shadow-2xl shadow-orange-950/40 ${
              isCompactLandscape ? 'w-20 h-20' : 'w-28 h-28'
            }`}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* HQ Floorplan Grid Rings */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="0.8" />

              {/* Outer Tiled Office Room Boundary */}
              <rect
                x="18.2"
                y="18.2"
                width="68.2"
                height="63.5"
                rx="2"
                fill="rgba(255, 255, 255, 0.03)"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="0.7"
              />

              {/* Executive Office Suite Footprint (West Wing) */}
              <rect
                x="20.0"
                y="22.11"
                width="10.22"
                height="56.13"
                rx="1"
                fill="rgba(249, 115, 22, 0.16)"
                stroke="rgba(249, 115, 22, 0.42)"
                strokeWidth="0.6"
              />

              {/* Crosshairs */}
              <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(249, 115, 22, 0.12)" strokeWidth="0.8" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(249, 115, 22, 0.12)" strokeWidth="0.8" />

              {/* Rotating Orientation Sweep */}
              <line
                x1="50"
                y1="50"
                x2="85"
                y2="50"
                stroke="rgba(249, 115, 22, 0.4)"
                strokeWidth="1.5"
                className="origin-[50px_50px] animate-spin"
                style={{ animationDuration: '4s' }}
              />

              {/* Zone Blips */}
              {STATIONS.map((station) => {
                const sx = 50 + station.position[0] * radarScale;
                const sy = 50 + station.position[2] * radarScale;
                return (
                  <circle
                    key={station.id}
                    cx={sx}
                    cy={sy}
                    r="3.5"
                    fill={station.color}
                    className="cursor-pointer hover:r-5 transition-all"
                    onClick={() => {
                      sfx.playInteract();
                      onTeleport(station.id);
                    }}
                  >
                    <title>{station.name} (Click to Jump)</title>
                  </circle>
                );
              })}

              {/* Player Arrow Marker */}
              <g
                transform={`translate(${radarPlayerX}, ${radarPlayerY}) rotate(${-playerDeg})`}
              >
                <polygon points="0,-4 3,3 -3,3" fill="#ffffff" stroke="#f97316" strokeWidth="1" />
              </g>
            </svg>

            {/* Minimap Label */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 rounded border border-white/10 text-[8px] font-mono uppercase tracking-widest text-neutral-400">
              HQ MAP
            </div>
          </div>
        </div>
      )}

      {/* --- BOTTOM SECTION (HORIZONTAL TOUCH COCKPIT OR DESKTOP DOCK) --- */}
      <footer className="w-full max-w-7xl mx-auto">
        {showTouchControls ? (
          isLandscape ? (
            <div className="flex items-end justify-between gap-2.5 w-full">
              {renderJoystick()}
              <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5">
                {renderMovesTray()}
                {renderZoneDock(false)}
              </div>
              {renderTouchButtons()}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 w-full">
              {renderMovesTray()}
              {renderZoneDock(false)}
              <div className="flex items-center justify-between w-full px-1 pt-1">
                {renderJoystick()}
                {renderTouchButtons()}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-3 w-full">
            {renderMovesTray()}
            {renderZoneDock(true)}

            {/* Desktop Controls Indicator & Speedometer */}
            <div className="hidden sm:flex items-center justify-between w-full text-[11px] text-neutral-500 font-mono px-2 select-none">
              <div className="flex items-center gap-3.5 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">W A S D</span> /{' '}
                  <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">Arrows</span> Move
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onToggleRover?.();
                  }}
                  className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Enter or Exit Executive Rover [R]"
                >
                  <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">R</span> Rover
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onTogglePickThrow?.();
                  }}
                  className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Pick Up or Throw Office Objects [G]"
                >
                  <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">G</span> Grab
                </button>
                {!isDriving && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onTriggerEmote?.('punch');
                      }}
                      className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Punch Attack [Q]"
                    >
                      <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">Q</span> Punch
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onTriggerEmote?.('kick');
                      }}
                      className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Kick Attack [X]"
                    >
                      <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">X</span> Kick
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onTriggerEmote?.('pushups');
                      }}
                      className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Push-ups Workout Emote [V]"
                    >
                      <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">V</span> Push-ups
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onJump();
                  }}
                  className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Click or press Space to Jump"
                >
                  <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">Space</span> Jump
                </button>
                <span className="hidden lg:flex items-center gap-1.5">
                  <MousePointer className="w-3 h-3 text-neutral-400" /> Click to Move
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-neutral-400">
                  {isDriving ? 'ROVER' : 'PACE'}: <span className="text-white font-bold">{speed}</span> KM/H
                </span>
              </div>
            </div>
          </div>
        )}
      </footer>

      {/* --- HELP / CONTROLS MODAL OVERLAY --- */}
      <AnimatePresence>
        {showHelp && (
          <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-neutral-950 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base sm:text-lg font-bold">Priyanshu&apos;s 3D Corporate HQ — Guide</h3>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1.5 text-neutral-400 hover:text-white bg-white/5 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                {[
                  { label: 'Walk / Drive', key: 'Joystick or W A S D', tone: 'text-white' },
                  { label: 'Drive / Exit Rover', key: 'ROVER btn or [ R ]', tone: 'text-amber-300' },
                  { label: 'Pick Up & Throw', key: 'GRAB btn or [ G ]', tone: 'text-orange-400' },
                  { label: 'Jump', key: 'JUMP btn or Spacebar', tone: 'text-white' },
                  { label: 'Punch / Kick / Combo', key: 'Moves tray or Q / X / C', tone: 'text-amber-300' },
                  { label: 'Push-ups Workout', key: 'Moves tray or [ V ]', tone: 'text-orange-300' },
                  { label: 'Sprint / Rover Boost', key: 'Hold [ Shift ]', tone: 'text-white' },
                  { label: 'Talk to HR / Open Zone', key: 'Tap NPC / Zone or [ E ]', tone: 'text-white' },
                  { label: 'Tap / Click to Move', key: 'Tap floor tiles directly', tone: 'text-white' },
                  { label: 'Horizontal Fullscreen', key: 'Fullscreen icon in top bar', tone: 'text-orange-300' },
                ].map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between gap-2 p-2.5 bg-white/[0.04] rounded-xl"
                  >
                    <span className="text-neutral-400">{entry.label}</span>
                    <span className={`font-mono font-bold text-right ${entry.tone}`}>{entry.key}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Got It, Let’s Tour HQ
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- QUANTUM WARP TELEPORTATION HUD FLASH --- */}
      <AnimatePresence>
        {isTeleporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, times: [0, 0.38, 0.55, 1.0] }}
            className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/35 via-amber-500/15 to-transparent backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
