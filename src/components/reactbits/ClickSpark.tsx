import { useRef, useEffect, useCallback, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string;
}

interface ClickSparkProps {
  sparkColor?: string | string[];
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children: ReactNode;
  className?: string;
}

export default function ClickSpark({
  sparkColor = ['#8B5CF6', '#FFFFFF', '#C4B5FD'],
  sparkSize = 10,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 450,
  children,
  className = '',
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  const getColor = useCallback(() => {
    if (Array.isArray(sparkColor)) {
      return sparkColor[Math.floor(Math.random() * sparkColor.length)];
    }
    return sparkColor;
  }, [sparkColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentDistance = easeProgress * sparkRadius;
        const currentSize = sparkSize * (1 - easeProgress);

        const x1 = spark.x + Math.cos(spark.angle) * currentDistance;
        const y1 = spark.y + Math.sin(spark.angle) * currentDistance;
        const x2 = spark.x + Math.cos(spark.angle) * (currentDistance + currentSize);
        const y2 = spark.y + Math.sin(spark.angle) * (currentDistance + currentSize);

        ctx.strokeStyle = spark.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration, sparkRadius, sparkSize]);

  const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const newSparks: Spark[] = [];
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i * (2 * Math.PI)) / sparkCount + (Math.random() - 0.5) * 0.4;
      newSparks.push({
        x,
        y,
        angle,
        startTime: now,
        color: getColor(),
      });
    }

    sparksRef.current.push(...newSparks);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      />
      {children}
    </div>
  );
}

