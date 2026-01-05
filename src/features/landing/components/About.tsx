"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Code, Lightbulb, Rocket } from "lucide-react";
import { TEXT } from "../../../constants/text";

const features = [
  {
    icon: Code,
    title: TEXT.about.features.codingTitle,
    description: TEXT.about.features.codingDescription,
  },
  {
    icon: Lightbulb,
    title: TEXT.about.features.problemTitle,
    description: TEXT.about.features.problemDescription,
  },
  {
    icon: Rocket,
    title: TEXT.about.features.growthTitle,
    description: TEXT.about.features.growthDescription,
  },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center py-20 bg-white dark:bg-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {TEXT.about.heading}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {TEXT.about.subheading}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">{TEXT.about.badgeEmoji}</div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {TEXT.about.badgeLine1}
                    <br />
                    {TEXT.about.badgeLine2}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {TEXT.about.paragraphs[0]}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {TEXT.about.paragraphs[1]}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {TEXT.about.paragraphs[2]}
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
