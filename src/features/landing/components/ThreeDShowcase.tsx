"use client";

import { useState } from 'react';
import { FloatingGeometry } from './FloatingGeometry';
import { SkillOrb } from './SkillOrb';
import { ParticleWave } from './ParticleWave';
import { TEXT } from "../../../constants/text";

export function ThreeDShowcase() {
  const [activeDemo, setActiveDemo] = useState<'geometry' | 'orb' | 'wave'>('geometry');

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">{TEXT.showcase.heading}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {TEXT.showcase.description}
          </p>
          
          {/* タブボタン */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveDemo('geometry')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeDemo === 'geometry'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
              }`}
            >
              <span className="block font-semibold">{TEXT.showcase.tabs.geometry.title}</span>
              <span className="block text-sm opacity-80">{TEXT.showcase.tabs.geometry.subtitle}</span>
            </button>
            
            <button
              onClick={() => setActiveDemo('orb')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeDemo === 'orb'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
              }`}
            >
              <span className="block font-semibold">{TEXT.showcase.tabs.orb.title}</span>
              <span className="block text-sm opacity-80">{TEXT.showcase.tabs.orb.subtitle}</span>
            </button>
            
            <button
              onClick={() => setActiveDemo('wave')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeDemo === 'wave'
                  ? 'bg-cyan-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
              }`}
            >
              <span className="block font-semibold">{TEXT.showcase.tabs.wave.title}</span>
              <span className="block text-sm opacity-80">{TEXT.showcase.tabs.wave.subtitle}</span>
            </button>
          </div>
        </div>

        {/* デモコンテンツ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* 説明 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            {activeDemo === 'geometry' && (
              <div>
                <h3 className="mb-2">{TEXT.showcase.sections.geometry.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {TEXT.showcase.sections.geometry.description}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {TEXT.showcase.sections.geometry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeDemo === 'orb' && (
              <div>
                <h3 className="mb-2">{TEXT.showcase.sections.orb.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {TEXT.showcase.sections.orb.description}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {TEXT.showcase.sections.orb.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeDemo === 'wave' && (
              <div>
                <h3 className="mb-2">{TEXT.showcase.sections.wave.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {TEXT.showcase.sections.wave.description}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {TEXT.showcase.sections.wave.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 3Dエフェクト */}
          <div className="relative">
            {activeDemo === 'geometry' && <FloatingGeometry />}
            {activeDemo === 'orb' && <SkillOrb />}
            {activeDemo === 'wave' && <ParticleWave />}
          </div>
        </div>

        {/* 実装のヒント */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h4 className="mb-3 text-blue-900 dark:text-blue-300">{TEXT.showcase.tipsHeading}</h4>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            {TEXT.showcase.tips.map((tip) => (
              <p key={tip.label}>
                <strong>{tip.label}</strong> {tip.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
