interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${disabled
        ? 'text-white'
        : 'animate-shine bg-[linear-gradient(110deg,#ffffff,45%,#8b5cf6,55%,#ffffff)] bg-[length:250%_100%]'
        } ${className}`}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}

