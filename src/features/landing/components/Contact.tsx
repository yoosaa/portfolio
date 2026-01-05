"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useId, useMemo, useRef } from "react";
import { Mail, Github, Linkedin, Twitter, Heart } from "lucide-react";
import { ParticleBackground } from "./ParticleBackground";
import { TEXT } from "../../../constants/text";
import { createRng, hashStringToSeed } from "../../../lib/random";

const socialLinks = [
  {
    icon: Github,
    label: TEXT.contact.socialLinks[0].label,
    href: TEXT.contact.socialLinks[0].href,
    color: TEXT.contact.socialLinks[0].color,
    particleColor: TEXT.contact.socialLinks[0].particleColor,
  },
  {
    icon: Linkedin,
    label: TEXT.contact.socialLinks[1].label,
    href: TEXT.contact.socialLinks[1].href,
    color: TEXT.contact.socialLinks[1].color,
    particleColor: TEXT.contact.socialLinks[1].particleColor,
  },
  {
    icon: Twitter,
    label: TEXT.contact.socialLinks[2].label,
    href: TEXT.contact.socialLinks[2].href,
    color: TEXT.contact.socialLinks[2].color,
    particleColor: TEXT.contact.socialLinks[2].particleColor,
  },
  {
    icon: Mail,
    label: TEXT.contact.socialLinks[3].label,
    href: TEXT.contact.socialLinks[3].href,
    color: TEXT.contact.socialLinks[3].color,
    particleColor: TEXT.contact.socialLinks[3].particleColor,
  },
];

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const seedId = useId();
  const socialParticlePositions = useMemo(
    () =>
      socialLinks.map((_, socialIndex) => {
        const rng = createRng(hashStringToSeed(`${seedId}-${socialIndex}`));
        return Array.from({ length: 10 }, () => ({
          left: rng() * 100,
          top: rng() * 100,
        }));
      }),
    [seedId],
  );

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen flex items-center py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black"
    >
      {/* 背景パーティクル */}
      <ParticleBackground 
        density={60}
        colors={['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']}
        speed={3}
        interactive={true}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {TEXT.contact.heading}
          </h2>
          <p className="text-xl text-gray-300">
            {TEXT.contact.subheading}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block text-6xl mb-4"
            >
              👋
            </motion.div>
            <p className="text-lg text-gray-300">
              {TEXT.contact.messageLines[0]}
              <br />
              {TEXT.contact.messageLines[1]}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden"
                >
                  {/* ホバー時のパーティクル */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {socialParticlePositions[index]?.map((position, i) => (
                      <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: social.particleColor,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0],
                        y: [0, -30],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                    />
                    ))}
                  </div>

                  {/* グラデーション背景 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors relative z-10">
                    {social.label}
                  </span>
                </motion.a>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center pt-8 border-t border-white/10"
          >
            <p className="text-gray-400 flex items-center justify-center gap-2">
              {TEXT.contact.madeWith}{" "}
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </motion.span>
              {" "}{TEXT.contact.byline}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {TEXT.contact.copyright}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
