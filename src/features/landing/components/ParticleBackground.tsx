import { motion } from 'motion/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { createRng, hashStringToSeed } from '../../../lib/random';

const DEFAULT_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

interface ParticleBackgroundProps {
  density?: number;
  colors?: string[];
  speed?: number;
  interactive?: boolean;
}

export function ParticleBackground({ 
  density = 50, 
  colors = DEFAULT_COLORS,
  speed = 2,
  interactive = true 
}: ParticleBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const baseParticles = useMemo(() => {
    const rng = createRng(
      hashStringToSeed(`${density}:${colors.join(',')}:${speed}`),
    );

    return Array.from({ length: density }, (_, index) => ({
      id: index,
      x: rng() * 100,
      y: rng() * 100,
      color: colors[
        Math.floor((index / Math.max(density, 1)) * colors.length) %
          colors.length
      ],
      delay: index * 0.01,
      duration: speed + rng(),
      size: 2 + rng() * 3,
    }));
  }, [colors, density, speed]);

  const particles = baseParticles.map((particle) => {
    const distance = interactive
      ? Math.hypot(
          particle.x - mousePosition.x,
          particle.y - mousePosition.y,
        )
      : 50;
    const maxDistance = 30;

    return {
      ...particle,
      influence: Math.max(0, maxDistance - distance) / maxDistance,
    };
  });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, -particle.influence * 50, 0],
            opacity: [0.2, 0.6 + particle.influence * 0.4, 0.2],
            scale: [1, 1 + particle.influence * 0.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* 接続線 */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {particles.slice(0, 20).map((p1, i) => {
          const p2 = particles[(i + 1) % 20];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${p1.x}%`}
              y1={`${p1.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke={p1.color}
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
