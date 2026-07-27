import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
} from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Project } from "../../data/projects";
import styles from "./ProjectsScreen.module.css";

type ProjectsScreenProps = {
  projects: readonly Project[];
  projectIndex: number;
  onReturnToRoom: () => void;
  onPreviousProject: () => void;
  onNextProject: () => void;
  entry?: "fade" | "from-right" | "from-bottom" | "from-depth";
};

export function ProjectsScreen({
  projects,
  projectIndex,
  onReturnToRoom,
  onPreviousProject,
  onNextProject,
  entry = "fade",
}: ProjectsScreenProps) {
  const project = projects[projectIndex];
  const entryOffset = {
    x: entry === "from-right" ? 96 : 0,
    y: entry === "from-bottom" ? 72 : 0,
    scale: entry === "from-depth" ? 0.78 : 1,
  };
  const hasPublicLink = Boolean(project.demo || project.source);

  return (
    <motion.section
      className="projects-screen"
      initial={{ opacity: 0, ...entryOffset }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: entry === "fade" ? 0.28 : 0.48 }}
    >
      <div className="projects-screen-topbar">
        <button className="project-back" type="button" onClick={onReturnToRoom}>
          <ArrowLeft size={16} />
          部屋全体へ
        </button>
        <span>SELECTED WORKS</span>
      </div>
      <motion.article
        key={project.title}
        className="projects-screen-content"
        style={{ "--project-accent": project.accent } as CSSProperties}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        aria-live="polite"
      >
        <p className="studio-eyebrow">
          個人で設計・開発したWebアプリケーション
        </p>
        <h2>{project.title}</h2>
        <p className="project-summary">{project.summary}</p>

        <ul className="project-tags" aria-label="使用技術">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="project-actions">
          <button type="button" aria-label="前の制作物" onClick={onPreviousProject}>
            <ArrowLeft size={18} />
          </button>
          <span>
            {projectIndex + 1} / {projects.length}
          </span>
          <button type="button" aria-label="次の制作物" onClick={onNextProject}>
            <ArrowRight size={18} />
          </button>
        </div>

        {hasPublicLink ? (
          <div className={styles.projectLinks} aria-label="制作物へのリンク">
            {project.demo ? (
              <a
                className={`${styles.projectLink} ${styles.primaryLink}`}
                href={project.demo}
                target="_blank"
                rel="noreferrer"
              >
                Open app
                <ExternalLink size={15} />
              </a>
            ) : null}
            {project.source ? (
              <a
                className={`${styles.projectLink} ${styles.secondaryLink}`}
                href={project.source}
                target="_blank"
                rel="noreferrer"
              >
                View source
                <Github size={15} />
              </a>
            ) : null}
          </div>
        ) : (
          <p className="project-note">公開リンクは準備中です。</p>
        )}
      </motion.article>
    </motion.section>
  );
}
