import { type ReactNode } from 'react';
import './LogoLoop.css';

export interface LogoItem {
  name: string;
  category?: string;
  icon?: ReactNode;
  highlight?: boolean;
}

interface LogoLoopProps {
  items: LogoItem[];
  speed?: number; // duration in seconds
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  className?: string;
  onItemClick?: (item: LogoItem) => void;
  activeItem?: string | null;
}

export default function LogoLoop({
  items,
  speed = 35,
  direction = 'left',
  pauseOnHover = true,
  fadeOut = true,
  className = '',
  onItemClick,
  activeItem,
}: LogoLoopProps) {
  // Duplicate list so the loop repeats seamlessly
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className={`logo-loop-container relative overflow-hidden w-full ${
        fadeOut ? 'logo-loop-fade' : ''
      } ${className}`}
    >
      <div
        className={`logo-loop-track flex items-center gap-3 w-max py-2 ${
          direction === 'right' ? 'animate-logo-loop-right' : 'animate-logo-loop-left'
        } ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedItems.map((item, index) => {
          const isActive = activeItem === item.name;
          return (
            <button
              key={`${item.name}-${index}`}
              type="button"
              onClick={() => onItemClick?.(item)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 select-none whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-violet-400 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : item.highlight
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-200 hover:border-violet-400 hover:text-white'
                  : 'border-white/10 bg-[#0c0c14]/80 text-neutral-300 hover:border-violet-500/40 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {item.icon && <span className="text-violet-400 shrink-0">{item.icon}</span>}
              <span className="font-semibold">{item.name}</span>
              {item.category && (
                <span className="text-[10px] text-neutral-400 font-normal">
                  • {item.category}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

