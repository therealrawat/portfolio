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
  Sparkles,
  HelpCircle,
  Zap,
  ArrowRight,
  MousePointer,
  Waves,
  Car,
  LogOut,
  Package,
  Flame,
} from 'lucide-react';
import { STATIONS, type StationData } from '../../data/stationsData';
import { useViewMode } from '../../context/ViewModeContext';
import { sfx } from '../../utils/audio';
import { type ActionPrompt } from './ThreeEngine';

interface GameHUDProps {
  nearbyStation: StationData | null;
  onInspectStation: (station: StationData) => void;
  onTeleport: (stationId: string) => void;
  coresCollected: number;
  totalCores: number;
  speed: number;
  playerPos: { x: number; z: number; rotation: number };
  onJoystickMove: (x: number, y: number) => void;
  onBoostToggle: (boosting: boolean) => void;
  onTriggerShockwave: () => void;
  isTeleporting?: boolean;
  actionPrompt?: ActionPrompt | null;
  isDriving?: boolean;
  onTogglePickThrow?: () => void;
  onToggleRover?: () => void;
}

export default function GameHUD({
  nearbyStation,
  onInspectStation,
  onTeleport,
  coresCollected,
  totalCores,
  speed,
  playerPos,
  onJoystickMove,
  onBoostToggle,
  onTriggerShockwave,
  isTeleporting = false,
  actionPrompt = null,
  isDriving = false,
  onTogglePickThrow,
  onToggleRover,
}: GameHUDProps) {
  const { mode, setMode } = useViewMode();
  const [isMuted, setIsMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRadar, setShowRadar] = useState(true);
  const [touchActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  // Virtual Joystick State
  const [joystickThumbPos, setJoystickThumbPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Keyboard shortcut handlers for station inspection & spacebar safety
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const maxRadius = 45;

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

  const handleJoystickTouchEnd = () => {
    setIsDragging(false);
    setJoystickThumbPos({ x: 0, y: 0 });
    onJoystickMove(0, 0);
  };

  const isOverdrive = coresCollected >= totalCores;

  // Radar Map calculations
  const radarScale = 40 / 55;
  const radarPlayerX = 50 + playerPos.x * radarScale;
  const radarPlayerY = 50 + playerPos.z * radarScale;
  const playerDeg = (playerPos.rotation * 180) / Math.PI;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      {/* --- TOP BAR --- */}
      <header className="pointer-events-auto flex items-center justify-between gap-4 w-full max-w-7xl mx-auto">
        {/* Brand & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl">
            <span className="text-sm font-black tracking-tighter text-white">PR.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-black/80 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl">
            <button
              onClick={() => {
                sfx.playSwitch();
                setMode('2d');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === '3d'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🎮 3D World</span>
            </button>
          </div>

          {/* Active Driving Indicator Badge */}
          {isDriving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full text-xs font-mono font-bold shadow-lg shadow-amber-500/20 animate-pulse"
            >
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>ROVER ACTIVE</span>
            </motion.div>
          )}
        </div>

        {/* Right Status Pill, Audio & Help */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PRD Data Cores Counter */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all ${
              isOverdrive
                ? 'bg-orange-950/80 border-orange-500 text-orange-200 shadow-lg shadow-orange-500/30 animate-pulse'
                : 'bg-black/60 backdrop-blur-xl border-white/10 text-neutral-300'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isOverdrive ? 'text-amber-400' : 'text-orange-400'}`} />
            <span>
              {isOverdrive ? 'OVERDRIVE ACTIVE' : `CORES: ${coresCollected}/${totalCores}`}
            </span>
          </div>

          {/* Radar Toggle */}
          <button
            onClick={() => setShowRadar(!showRadar)}
            className="p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
            title={showRadar ? 'Hide Tactical Radar' : 'Show Tactical Radar'}
            aria-label="Toggle Radar"
          >
            <Compass className={`w-4 h-4 ${showRadar ? 'text-orange-400' : 'text-neutral-500'}`} />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
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
            className="p-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-neutral-300 hover:text-white transition-colors"
            title="Controls & Help"
            aria-label="Controls and Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- TACTICAL HOLOGRAPHIC RADAR MINIMAP (TOP RIGHT) --- */}
      {showRadar && (
        <div className="pointer-events-auto absolute top-20 right-6 hidden md:block select-none">
          <div className="relative w-28 h-28 rounded-full bg-black/85 backdrop-blur-2xl border border-orange-500/30 p-1 shadow-2xl shadow-orange-950/40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Radar Grid Rings */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="0.8" />

              {/* Crosshairs */}
              <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(249, 115, 22, 0.12)" strokeWidth="0.8" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(249, 115, 22, 0.12)" strokeWidth="0.8" />

              {/* Rotating Radar Sweep Beam */}
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

              {/* Station Blips */}
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
                    <title>{station.name} (Click to Teleport)</title>
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

            {/* Radar Label */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 rounded border border-white/10 text-[8px] font-mono uppercase tracking-widest text-neutral-400">
              RADAR
            </div>
          </div>
        </div>
      )}

      {/* --- PROXIMITY INTERACTION NOTIFICATION --- */}
      <AnimatePresence>
        {nearbyStation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mx-auto max-w-md w-full"
          >
            <button
              onClick={() => {
                sfx.playInteract();
                onInspectStation(nearbyStation);
              }}
              className="group w-full flex items-center justify-between p-3.5 sm:p-4 bg-neutral-950/90 backdrop-blur-2xl border border-orange-500/40 hover:border-orange-500 rounded-2xl shadow-2xl shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${nearbyStation.color}25` }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: nearbyStation.color }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                    Station Proximity Detected
                  </div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-orange-300 transition-colors">
                    {nearbyStation.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white text-black font-mono font-bold text-xs rounded-xl shadow">
                <span>[ E ] INSPECT</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTEXTUAL INTERACTIVE ACTION PROMPT (ROVER / PICK UP / THROW) --- */}
      <AnimatePresence>
        {actionPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto mx-auto max-w-sm w-full mb-1"
          >
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                if (actionPrompt.type === 'enter_rover' || actionPrompt.type === 'exit_rover') {
                  onToggleRover?.();
                } else {
                  onTogglePickThrow?.();
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-neutral-950/90 backdrop-blur-2xl border border-amber-500/50 hover:border-amber-400 rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  {actionPrompt.type === 'enter_rover' && <Car className="w-4 h-4 animate-pulse" />}
                  {actionPrompt.type === 'exit_rover' && <LogOut className="w-4 h-4" />}
                  {actionPrompt.type === 'pickup' && <Package className="w-4 h-4" />}
                  {actionPrompt.type === 'throw' && <Flame className="w-4 h-4 text-amber-300" />}
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-neutral-400">
                    Interactive Action Ready
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                    {actionPrompt.label}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-mono font-bold text-xs rounded-xl shadow-md">
                <span>[ {actionPrompt.key} ] ACTIVATE</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM SECTION (DOCK & CONTROLS) --- */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col items-center gap-3">
        {/* Teleport Quick Dock */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto max-w-full scrollbar-none">
          <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 px-2.5 hidden sm:inline">
            Teleport:
          </span>
          {[
            { id: 'spawn', label: 'Core', icon: Compass },
            { id: 'projects', label: 'Projects', icon: FolderGit2 },
            { id: 'tech', label: 'Skills', icon: Cpu },
            { id: 'experience', label: 'Career', icon: Award },
            { id: 'contact', label: 'Comms', icon: Radio },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={(e) => {
                  e.currentTarget.blur();
                  sfx.playInteract();
                  onTeleport(item.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block" />

          {/* Drive Rover / Exit Button in Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleRover?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md ${
              isDriving
                ? 'bg-orange-500/30 border border-orange-400 text-orange-200 shadow-orange-500/30 animate-pulse'
                : 'bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white'
            }`}
            title="Enter or Exit Cyber Rover [R]"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            title="Pick Up or Throw Interactive Object [G]"
          >
            <Package className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] hidden sm:inline">Grab/Throw [G]</span>
          </button>

          {/* Jump Action Trigger in Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              sfx.playBoost();
              onBoostToggle(true);
              setTimeout(() => onBoostToggle(false), 350);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20"
            title="Jet Jump / Sprint [Space]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Jump [Space]</span>
          </button>

          {/* Sonic Pulse Trigger in Dock */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              onTriggerShockwave();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            title="Emit Sonic Shockwave to push interactive props"
          >
            <Waves className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px] hidden sm:inline">Shockwave [F]</span>
          </button>
        </div>

        {/* Desktop Controls Indicator & Speedometer */}
        <div className="hidden sm:flex items-center justify-between w-full text-[11px] text-neutral-500 font-mono px-2 select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">W A S D</span> / <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">Arrows</span> to Drive / Move
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleRover?.();
              }}
              className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Enter or Exit Cyber Rover [R]"
            >
              <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">R</span> Drive Rover
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onTogglePickThrow?.();
              }}
              className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Pick Up or Throw Props [G]"
            >
              <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">G</span> Pick/Throw
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                sfx.playBoost();
                onBoostToggle(true);
                setTimeout(() => onBoostToggle(false), 350);
              }}
              className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Click or press Space to Jump / Turbo"
            >
              <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">Space</span> Boost / Jump
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onTriggerShockwave();
              }}
              className="pointer-events-auto flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Click or press F to Blast"
            >
              <span className="px-1.5 py-0.5 bg-white/10 text-white rounded text-[10px]">F</span> Shockwave
            </button>
            <span className="flex items-center gap-1.5">
              <MousePointer className="w-3 h-3 text-neutral-400" /> Click Ground to Move
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-400">
              {isDriving ? 'ROVER' : 'PACE'}: <span className="text-white font-bold">{speed}</span> KM/H
            </span>
          </div>
        </div>

        {/* --- MOBILE TOUCH ON-SCREEN CONTROLS --- */}
        {touchActive && (
          <div className="pointer-events-auto flex items-center justify-between w-full mt-2 px-2 sm:hidden">
            {/* Virtual Joystick */}
            <div
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
              className="relative w-24 h-24 rounded-full bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center touch-none"
            >
              <div
                className="w-10 h-10 rounded-full bg-orange-500/80 shadow-lg shadow-orange-500/50"
                style={{
                  transform: `translate(${joystickThumbPos.x}px, ${joystickThumbPos.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              />
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onTogglePickThrow?.();
                }}
                onTouchStart={() => onTogglePickThrow?.()}
                className="w-13 h-13 rounded-full bg-orange-500/20 active:bg-orange-500/60 border border-orange-400/50 flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-orange-500/20"
                title="Pick Up or Throw"
              >
                <Package className="w-4 h-4 text-orange-300" />
                <span className="text-[7px] font-mono uppercase font-bold tracking-wider">GRAB</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleRover?.();
                }}
                onTouchStart={() => onToggleRover?.()}
                className={`w-13 h-13 rounded-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg ${
                  isDriving
                    ? 'bg-red-500/30 border border-red-400 text-red-200'
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
                onClick={(e) => {
                  e.currentTarget.blur();
                  onTriggerShockwave();
                }}
                onTouchStart={onTriggerShockwave}
                className="w-13 h-13 rounded-full bg-amber-500/20 active:bg-amber-500/60 border border-amber-400/50 flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-amber-500/25"
                title="Shockwave"
              >
                <Waves className="w-4 h-4 text-amber-300" />
                <span className="text-[7px] font-mono uppercase font-bold tracking-wider">PULSE</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  sfx.playBoost();
                  onBoostToggle(true);
                  setTimeout(() => onBoostToggle(false), 350);
                }}
                onTouchStart={() => {
                  sfx.playBoost();
                  onBoostToggle(true);
                }}
                onTouchEnd={() => onBoostToggle(false)}
                className="w-14 h-14 rounded-full bg-orange-500/20 active:bg-orange-500/60 border border-orange-400/50 flex flex-col items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-orange-500/25"
              >
                <Zap className="w-5 h-5 text-orange-300" />
                <span className="text-[8px] font-mono uppercase font-bold tracking-wider">BOOST</span>
              </button>
            </div>
          </div>
        )}
      </footer>

      {/* --- HELP / CONTROLS MODAL OVERLAY --- */}
      <AnimatePresence>
        {showHelp && (
          <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold">3D World Navigation Guide</h3>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1.5 text-neutral-400 hover:text-white bg-white/5 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Move / Drive</span>
                  <span className="font-mono font-bold text-white">W A S D or Arrow Keys</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Drive / Exit Cyber Rover</span>
                  <span className="font-mono font-bold text-amber-300">Press [ R ] or Tap Prompt</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Pick Up & Throw Objects</span>
                  <span className="font-mono font-bold text-orange-400">Press [ G ] (Carry & Throw)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Turbo Boost / Jet Jump</span>
                  <span className="font-mono font-bold text-white">Spacebar</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Gauntlet Shockwave</span>
                  <span className="font-mono font-bold text-orange-300">Press [ F ] or [ H ]</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Interactive Props</span>
                  <span className="font-mono font-bold text-white">Cubes, Plasma Orbs, Pyramids, Cylinders</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Booster Launch Pads</span>
                  <span className="font-mono font-bold text-white">Step onto runway pads</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Click to Navigate</span>
                  <span className="font-mono font-bold text-white">Left Click ground</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Inspect Station</span>
                  <span className="font-mono font-bold text-white">[ E ] Key or Tap Prompt</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white/[0.04] rounded-xl">
                  <span className="text-neutral-400">Quantum Teleport</span>
                  <span className="font-mono font-bold text-white">Dock or Radar blips</span>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Got It, Let’s Explore
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
