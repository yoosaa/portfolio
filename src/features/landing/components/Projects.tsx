"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import {
  getProjectsData,
  type Project,
  type ProjectsData,
} from "../../../lib/data";
import { createRng, hashStringToSeed } from "../../../lib/random";
import useSWR from "swr";

function ProjectCard({
  project,
  index,
  codeLabel,
  demoLabel,
}: {
  project: Project;
  index: number;
  codeLabel: string;
  demoLabel: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const seedId = useId();
  const particlePositions = useMemo(() => {
    const rng = createRng(hashStringToSeed(seedId));
    return Array.from({ length: 20 }, () => ({
      left: rng() * 100,
      top: rng() * 100,
    }));
  }, [seedId]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl overflow-hidden"
    >
      {/* パーティクルエフェクト */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                backgroundColor: project.particleColor,
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -50],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      )}

      {/* グラデーションボーダー */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{ padding: '2px', borderRadius: '1rem' }}
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 h-full rounded-2xl" />
      </motion.div>

      <div className="relative z-10">
        <motion.div 
          className="text-6xl mb-4"
          animate={isHovered ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {project.image}
        </motion.div>
        
        <h3 className="text-xl font-bold mb-2 text-white">
          {project.title}
        </h3>
        
        <p className="text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-white/10 backdrop-blur-sm text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${project.gradient} text-white hover:shadow-lg hover:shadow-${project.particleColor}/50 transition-all`}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">{demoLabel}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
	const { data } = useSWR("/data/projects.json", getProjectsData);

  const projects = data?.items;

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center py-20 bg-gradient-to-br from-black via-gray-900 to-black"
    >
			{!data ? (
				<p>Loading...</p>
			) : (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {data.heading}
          </h2>
          <p className="text-xl text-gray-300">
            {data.subheading}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              codeLabel={data.codeLabel}
              demoLabel={data.demoLabel}
            />
          ))}
        </div>
      </div>
			)}
    </section>
  );
}
