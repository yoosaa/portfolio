"use client";

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function ParticleWave() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const viewportWidth = typeof window === "undefined" ? 1000 : window.innerWidth;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('particle-wave')?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // パーティクルのグリッド生成
  const particles = [];
  const rows = 20;
  const cols = 50;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j / cols) * 100;
      const y = (i / rows) * 100;
      
      // マウスとの距離を計算
      const distance = Math.sqrt(
        Math.pow(x - mousePosition.x, 2) + 
        Math.pow(y - mousePosition.y, 2)
      );
      
      // 距離に基づいて高さを計算
      const maxDistance = 50;
      const height = Math.max(0, maxDistance - distance) / maxDistance;

      particles.push({
        id: `${i}-${j}`,
        x,
        y,
        height,
        delay: (i + j) * 0.01,
        color: `hsl(${200 + (i / rows) * 60}, 70%, ${50 + height * 30}%)`,
      });
    }
  }

  return (
    <div 
      id="particle-wave"
      className="w-full h-[400px] bg-gradient-to-b from-gray-900 to-black overflow-hidden relative cursor-pointer"
    >
      <div className="absolute inset-0 flex items-end justify-center pb-8">
        <div className="relative w-full h-full">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                bottom: `${particle.y}%`,
                width: '4px',
                height: '4px',
                backgroundColor: particle.color,
              }}
              animate={{
                y: [0, -particle.height * 100, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1 + particle.height, 1],
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      {/* 波のライン */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <motion.path
          d={`M 0 ${200 - mousePosition.y} Q ${mousePosition.x * 10} ${100 - mousePosition.y}, ${viewportWidth} ${200 - mousePosition.y}`}
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* ヒントテキスト */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        💡 マウスを動かしてパーティクルと遊んでみてください
      </div>
    </div>
  );
}
