import { useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  onClick?: () => void;
}

export default function SpotlightCard({
  children,
  className = '',
  contentClassName = '',
  spotlightColor = 'rgba(139, 92, 246, 0.16)',
  spotlightSize = 340,
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11]/85 backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-950/20 ${className}`}
    >
      {/* Border Glow Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize * 0.7}px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.45), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Surface Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className={`relative z-10 h-full w-full ${contentClassName}`}>{children}</div>
    </div>
  );
}

