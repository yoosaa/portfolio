import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Project } from "../../data/projects";

type ProjectsScreenProps = {
  project: Project;
  projectIndex: number;
  projectCount: number;
  onReturnToRoom: () => void;
  onPreviousProject: () => void;
  onNextProject: () => void;
};

export function ProjectsScreen({
  project,
  projectIndex,
  projectCount,
  onReturnToRoom,
  onPreviousProject,
  onNextProject,
}: ProjectsScreenProps) {
  return (
    <motion.section
      className="projects-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="projects-screen-topbar">
        <button className="project-back" type="button" onClick={onReturnToRoom}>
          <ArrowLeft size={16} />
          部屋全体へ
        </button>
        <span>SELECTED PROJECTS</span>
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
          PROJECT {String(projectIndex + 1).padStart(2, "0")}
        </p>
        <h2>{project.title}</h2>
        <p className="project-summary">{project.summary}</p>

        <ul className="project-tags" aria-label="使用技術">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="project-actions">
          <button type="button" aria-label="前のプロジェクト" onClick={onPreviousProject}>
            <ArrowLeft size={18} />
          </button>
          <span>
            {projectIndex + 1} / {projectCount}
          </span>
          <button type="button" aria-label="次のプロジェクト" onClick={onNextProject}>
            <ArrowRight size={18} />
          </button>
        </div>

        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noreferrer">
            View project
            <ExternalLink size={16} />
          </a>
        ) : (
          <p className="project-note">
            作品リンクと詳しい設計意図は次の工程で接続します。
          </p>
        )}
      </motion.article>
    </motion.section>
  );
}
