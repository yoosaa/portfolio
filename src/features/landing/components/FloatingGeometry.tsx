"use client";

import { motion } from 'motion/react';

// CSS 3Dトランスフォームを使った浮遊する図形
export function FloatingGeometry() {
  const shapes = [
    { 
      id: 1, 
      type: 'cube',
      color: 'from-blue-500 to-blue-600',
      delay: 0,
      x: -20,
      y: 10
    },
    { 
      id: 2, 
      type: 'sphere',
      color: 'from-purple-500 to-purple-600',
      delay: 0.5,
      x: 20,
      y: -10
    },
    { 
      id: 3, 
      type: 'pyramid',
      color: 'from-pink-500 to-pink-600',
      delay: 1,
      x: 0,
      y: 0
    },
    { 
      id: 4, 
      type: 'cube',
      color: 'from-cyan-500 to-cyan-600',
      delay: 1.5,
      x: -30,
      y: -20
    },
    { 
      id: 5, 
      type: 'sphere',
      color: 'from-green-500 to-green-600',
      delay: 2,
      x: 30,
      y: 20
    },
  ];

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              left: `calc(50% + ${shape.x}%)`,
              top: `calc(50% + ${shape.y}%)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotateX: [0, 360],
              rotateY: [0, 360],
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 20,
              delay: shape.delay,
              repeat: Infinity,
              ease: "linear",
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
          >
            <div 
              className={`w-24 h-24 bg-gradient-to-br ${shape.color} rounded-lg shadow-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer hover:scale-110`}
              style={{
                transform: shape.type === 'sphere' ? 'rotateZ(45deg)' : 'none',
                borderRadius: shape.type === 'sphere' ? '50%' : '0.5rem',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* グリッド背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
    </div>
  );
}
