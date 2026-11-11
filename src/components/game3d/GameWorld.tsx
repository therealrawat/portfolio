import { useEffect, useRef, useState, useCallback } from 'react';
import { ThreeEngine, type ActionPrompt } from './ThreeEngine';
import { type AvatarEmoteName } from './AvatarController';
import GameHUD from './GameHUD';
import StationModal from './StationModal';
import { type StationData } from '../../data/stationsData';
import { sfx } from '../../utils/audio';

interface GameWorldProps {
  onOpenAI?: () => void;
}

export default function GameWorld({ onOpenAI }: GameWorldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);

  const [nearbyStation, setNearbyStation] = useState<StationData | null>(null);
  const [activeModalStation, setActiveModalStation] = useState<StationData | null>(null);
  const [speed, setSpeed] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 6, rotation: 0 });
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [actionPrompt, setActionPrompt] = useState<ActionPrompt | null>(null);
  const [isDriving, setIsDriving] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [activeEmote, setActiveEmote] = useState<AvatarEmoteName | null>(null);

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

  const handleTriggerEmote = useCallback((emote: AvatarEmoteName) => {
    engineRef.current?.triggerAvatarEmote(emote);
  }, []);

  const handleInspectStation = useCallback((station: StationData) => {
    setActiveModalStation(station);
    sfx.playInteract();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070605] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Game HUD with Executive Office Map & Controls */}
      <GameHUD
        nearbyStation={nearbyStation}
        onInspectStation={handleInspectStation}
        onTeleport={handleTeleport}
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
        avatarLoaded={avatarLoaded}
        activeEmote={activeEmote}
        onTriggerEmote={handleTriggerEmote}
      />

      {/* Station Details Inspection Modal */}
      <StationModal
        station={activeModalStation}
        onClose={() => setActiveModalStation(null)}
        onOpenAI={onOpenAI}
      />
    </div>
  );
}
