import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    life: number;
    maxLife: number;
    velocityX: number;
    velocityY: number;
}

const CustomCursor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const lastParticleTimeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to window size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Monochromatic palette for particles (shades of white and gray)
        const colors = [
            'rgba(255, 255, 255, 0.8)',   // Pure White
            'rgba(212, 212, 212, 0.8)',   // Light Gray
            'rgba(163, 163, 163, 0.8)',   // Gray
            'rgba(115, 115, 115, 0.8)',   // Medium Gray
            'rgba(82, 82, 82, 0.8)',      // Dark Gray
        ];

        // Track mouse position
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            const now = Date.now();
            // Create particles at a controlled rate
            if (now - lastParticleTimeRef.current > 30) { // Create particle every 30ms
                lastParticleTimeRef.current = now;

                // Create 1-2 particles per movement
                const particleCount = Math.random() > 0.5 ? 2 : 1;
                for (let i = 0; i < particleCount; i++) {
                    particlesRef.current.push({
                        x: e.clientX + (Math.random() - 0.5) * 10,
                        y: e.clientY + (Math.random() - 0.5) * 10,
                        size: Math.random() * 3 + 2, // 2-5px
                        color: colors[Math.floor(Math.random() * colors.length)],
                        life: 1,
                        maxLife: 1,
                        velocityX: (Math.random() - 0.5) * 0.5,
                        velocityY: (Math.random() - 0.5) * 0.5,
                    });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter((particle) => {
                // Update particle
                particle.life -= 0.01; // Faster fade out
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                particle.velocityY += 0.02; // Slight gravity effect

                if (particle.life <= 0) return false;

                // Draw particle
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                return true;
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-9998"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default CustomCursor;
