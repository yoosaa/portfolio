"use client"

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { ParticleBackground } from "./ParticleBackground";
import { getSkillsData } from "../../../lib/data";
import useSWR from 'swr';

// 経験年数に基づいてフォントサイズを計算
function calculateFontSize(years: number): number {
  const minSize = 18;
  const maxSize = 64;
  const minYears = 0.5;
  const maxYears = 3;
  
  const normalized = Math.min(Math.max(years, minYears), maxYears);
  return minSize + ((normalized - minYears) / (maxYears - minYears)) * (maxSize - minSize);
}

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

	const { data, isLoading } = useSWR("/data/skills.json", getSkillsData);
	const isReady = Boolean(data) && !isLoading;

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen flex items-center py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      {/* 背景パーティクル */}
      <ParticleBackground 
        density={40}
        colors={['#3b82f6', '#8b5cf6', '#ec4899']}
        speed={4}
        interactive={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {!isReady ? (
          <div className="text-center text-gray-300">Loading...</div>
        ) : (
        <>
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Skills
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            学習中のスキル
          </p>
          <p className="text-sm text-gray-400">
            ※ 文字の大きさは経験年数に比例します
          </p>
        </motion.div>

        {/* ワードクラウド */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/10"
        >
          {/* ホバー時のパーティクル背景 */}
          {hoveredSkill && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <ParticleBackground 
                density={50}
                colors={[data?.skills.find(s => s.name === hoveredSkill)?.particleColor || '#3b82f6']}
                speed={2}
                interactive={false}
              />
            </div>
          )}

          {/* Flexboxでワードクラウド風に配置 */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 relative">
            {data?.skills.map((skill, index) => {
              const fontSize = calculateFontSize(skill.years);
              
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + index * 0.05,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    zIndex: 10,
                    transition: { duration: 0.2 }
                  }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="cursor-pointer group relative"
                >
                  <motion.span
                    className="font-bold bg-clip-text text-transparent whitespace-nowrap inline-block"
                    style={{ 
                      backgroundImage: skill.gradient,
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.2,
                    }}
                    animate={hoveredSkill === skill.name ? {
                      filter: [
                        `drop-shadow(0 0 10px ${skill.particleColor})`,
                        `drop-shadow(0 0 20px ${skill.particleColor})`,
                        `drop-shadow(0 0 10px ${skill.particleColor})`,
                      ],
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {skill.name}
                  </motion.span>
                  
                  {/* ホバー時の経験年数表示 */}
                  {hoveredSkill === skill.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900/95 backdrop-blur-sm rounded-full border border-white/20 whitespace-nowrap z-20"
                    >
                      <span className="text-xs text-gray-300">
                        {skill.years}年の経験
                      </span>
                    </motion.div>
                  )}

                  {/* ホバー時のパーティクル */}
                  {hoveredSkill === skill.name && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full"
                          style={{ 
                            backgroundColor: skill.particleColor,
                            left: '50%',
                            top: '50%',
                          }}
                          initial={{ 
                            x: 0, 
                            y: 0, 
                            opacity: 0 
                          }}
                          animate={{
                            x: Math.cos((i * Math.PI * 2) / 12) * 50,
                            y: Math.sin((i * Math.PI * 2) / 12) * 50,
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.05,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-300 italic">
            「学び続けることが、最大のスキル」
          </p>
        </motion.div>
        </>
        )}
      </div>
    </section>
  );
}
