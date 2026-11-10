import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { ThreeEngine, type ActionPrompt } from './ThreeEngine';
import GameHUD from './GameHUD';
import StationModal from './StationModal';
import { DATA_CORES, type StationData } from '../../data/stationsData';
import { sfx } from '../../utils/audio';

interface GameWorldProps {
  onOpenAI?: () => void;
}

export default function GameWorld({ onOpenAI }: GameWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);

  const [nearbyStation, setNearbyStation] = useState<StationData | null>(null);
  const [activeModalStation, setActiveModalStation] = useState<StationData | null>(null);
  const [coresCollected, setCoresCollected] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 6, rotation: 0 });
  const [showOverdriveToast, setShowOverdriveToast] = useState(false);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [actionPrompt, setActionPrompt] = useState<ActionPrompt | null>(null);
  const [isDriving, setIsDriving] = useState(false);

  const totalCores = DATA_CORES.length;

  // Initialize Three.js Engine
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new ThreeEngine(containerRef.current, {
      onNearbyStation: (station) => {
        setNearbyStation(station);
      },
      onCollectCore: (_coreId, total) => {
        setCoresCollected(total);
        sfx.playCollect();

        if (total >= totalCores) {
          setShowOverdriveToast(true);
          sfx.playOverdrive();
          engine.setOverdrive(true);
          setTimeout(() => setShowOverdriveToast(false), 5000);
        }
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
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [totalCores]);

  const handleTeleport = useCallback((stationId: string) => {
    engineRef.current?.teleportToStation(stationId);
  }, []);

  const handleJoystickMove = useCallback((x: number, y: number) => {
    engineRef.current?.setJoystickVector(x, y);
  }, []);

  const handleBoostToggle = useCallback((boosting: boolean) => {
    engineRef.current?.setBoost(boosting);
  }, []);

  const handleTriggerShockwave = useCallback(() => {
    engineRef.current?.triggerShockwave();
  }, []);

  const handleTogglePickThrow = useCallback(() => {
    engineRef.current?.togglePickThrow();
  }, []);

  const handleToggleRover = useCallback(() => {
    engineRef.current?.toggleRoverDrive();
  }, []);

  const handleInspectStation = useCallback((station: StationData) => {
    setActiveModalStation(station);
    sfx.playInteract();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070605] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Game HUD with Tactical Radar & Controls */}
      <GameHUD
        nearbyStation={nearbyStation}
        onInspectStation={handleInspectStation}
        onTeleport={handleTeleport}
        coresCollected={coresCollected}
        totalCores={totalCores}
        speed={speed}
        playerPos={playerPos}
        onJoystickMove={handleJoystickMove}
        onBoostToggle={handleBoostToggle}
        onTriggerShockwave={handleTriggerShockwave}
        isTeleporting={isTeleporting}
        actionPrompt={actionPrompt}
        isDriving={isDriving}
        onTogglePickThrow={handleTogglePickThrow}
        onToggleRover={handleToggleRover}
      />

      {/* Station Details Inspection Modal */}
      <StationModal
        station={activeModalStation}
        onClose={() => setActiveModalStation(null)}
        onOpenAI={onOpenAI}
      />

      {/* Overdrive Unlocked Toast */}
      <AnimatePresence>
        {showOverdriveToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 bg-orange-950/90 border border-orange-500 rounded-2xl shadow-2xl shadow-orange-500/40 text-white backdrop-blur-xl pointer-events-none"
          >
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Trophy className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                Achievement Unlocked!
              </div>
              <div className="text-sm font-black text-white">
                All 5 PRD Cores Collected • Overdrive Mode Activated ⚡
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-orange-300 animate-pulse ml-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
