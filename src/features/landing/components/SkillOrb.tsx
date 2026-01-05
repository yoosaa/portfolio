"use client";

import { motion } from 'motion/react';
import { useState } from 'react';
import { TEXT } from "../../../constants/text";

interface Skill {
  name: string;
  color: string;
  gradient: string;
}

export function SkillOrb() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const skills: Skill[] = TEXT.skillOrb.skills;

  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-gray-900 to-black overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 md:gap-16">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="relative flex items-center justify-center"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* オーブ本体 */}
              <motion.div
                className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${skill.gradient} shadow-2xl cursor-pointer`}
                animate={{
                  scale: hoveredIndex === index ? 1.3 : 1,
                  y: [0, -10, 0],
                  rotateY: [0, 180, 360],
                }}
                transition={{
                  scale: { duration: 0.3 },
                  y: { 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  },
                  rotateY: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }
                }}
              >
                {/* 輝きエフェクト */}
                <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-xl" />
                
                {/* スキル名 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm px-2 text-center backdrop-blur-sm bg-black/30 rounded-lg py-1">
                    {skill.name}
                  </span>
                </div>
              </motion.div>

              {/* パーティクルエフェクト */}
              {hoveredIndex === index && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${skill.gradient}`}
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 0,
                        scale: 0 
                      }}
                      animate={{
                        x: Math.cos((i * Math.PI * 2) / 8) * 80,
                        y: Math.sin((i * Math.PI * 2) / 8) * 80,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 背景グリッド */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>
    </div>
  );
}
