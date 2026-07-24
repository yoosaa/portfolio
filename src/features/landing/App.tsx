"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink, Rotate3D } from "lucide-react";
import dynamic from "next/dynamic";
import { useReducer } from "react";

const StudioScene = dynamic(
  () => import("./components/StudioScene").then((module) => module.StudioScene),
  {
    ssr: false,
    loading: () => <div className="studio-canvas studio-canvas-loading" />,
  }
);

const projects = [
  {
    title: "Clientnote",
    summary:
      "顧客との接点を、あとから振り返れる形で残す業務ログ。フロントとAPIを分け、設計・テスト・公開まで一通り組み立てました。",
    tags: ["SvelteKit", "Hono", "Cloudflare D1", "Playwright"],
    accent: "#78998b",
    demo: null,
  },
  {
    title: "Restocknote",
    summary:
      "小規模店舗の入荷・補充を迷わず共有するメモツール。Svelte 5とStorybookで、日常業務に馴染むUIを検証しました。",
    tags: ["Svelte 5", "Storybook", "Playwright", "Vercel"],
    accent: "#bd8f67",
    demo: null,
  },
  {
    title: "Decision note",
    summary:
      "複数の選択肢を落ち着いて比較するための意思決定メモ。小さく作り、テストとCIを通して公開する一連の流れを実践しました。",
    tags: ["Next.js", "TypeScript", "Vitest", "GitHub Actions"],
    accent: "#879bb0",
    demo: null,
  },
] as const;

type StudioPhase =
  | "room"
  | "zooming-to-display"
  | "projects"
  | "returning-to-room";

type StudioState = {
  phase: StudioPhase;
  projectIndex: number;
  isProjectScreenClosed: boolean;
};

type StudioEvent =
  | { type: "REQUEST_PROJECTS" }
  | { type: "DISPLAY_REACHED" }
  | { type: "RETURN_TO_ROOM" }
  | { type: "PROJECTS_CLOSED" }
  | { type: "ROOM_RESTORED" }
  | { type: "NEXT_PROJECT" }
  | { type: "PREVIOUS_PROJECT" };

function reducer(state: StudioState, event: StudioEvent): StudioState {
  switch (event.type) {
    case "REQUEST_PROJECTS":
      return state.phase === "room"
        ? { ...state, phase: "zooming-to-display" }
        : state;
    case "DISPLAY_REACHED":
      return state.phase === "zooming-to-display"
        ? { ...state, phase: "projects", isProjectScreenClosed: false }
        : state;
    case "RETURN_TO_ROOM":
      return state.phase === "projects"
        ? { ...state, phase: "returning-to-room", isProjectScreenClosed: false }
        : state;
    case "PROJECTS_CLOSED":
      return state.phase === "returning-to-room"
        ? { ...state, isProjectScreenClosed: true }
        : state;
    case "ROOM_RESTORED":
      return state.phase === "returning-to-room"
        ? { ...state, phase: "room", isProjectScreenClosed: false }
        : state;
    case "NEXT_PROJECT":
      return state.phase === "projects"
        ? {
            ...state,
            projectIndex: (state.projectIndex + 1) % projects.length,
          }
        : state;
    case "PREVIOUS_PROJECT":
      return state.phase === "projects"
        ? {
            ...state,
            projectIndex:
              (state.projectIndex - 1 + projects.length) % projects.length,
          }
        : state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    phase: "room",
    projectIndex: 0,
    isProjectScreenClosed: false,
  });
  const project = projects[state.projectIndex];
  const isProjects = state.phase === "projects";

  return (
    <main className="studio-shell" data-studio-phase={state.phase}>
      <div className="studio-grain" aria-hidden="true" />

      <header className="studio-header">
        <a className="studio-brand" href="#" aria-label="トップへ">
          <span className="studio-brand-mark">YS</span>
          <span>
            <strong>Yoshitaka Sano</strong>
            <small>Frontend Engineer</small>
          </span>
        </a>

        <div className="studio-status">
          <span className="studio-status-dot" />
          Open to new opportunities
        </div>
      </header>

      <section className="studio-stage" aria-label="3D portfolio studio">
        <StudioScene
          phase={state.phase}
          cameraPhase={
            state.phase === "returning-to-room" &&
            !state.isProjectScreenClosed
              ? "projects"
              : state.phase
          }
          accent={project.accent}
          projectIndex={state.projectIndex}
          onOpenProjects={() => dispatch({ type: "REQUEST_PROJECTS" })}
          onDisplayReached={() => dispatch({ type: "DISPLAY_REACHED" })}
          onRoomRestored={() => dispatch({ type: "ROOM_RESTORED" })}
        />

        <AnimatePresence
          mode="wait"
          onExitComplete={() => dispatch({ type: "PROJECTS_CLOSED" })}
        >
          {state.phase === "room" ? (
            <motion.div
              key="intro"
              className="studio-intro"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <p className="studio-eyebrow">WELCOME TO MY SMALL STUDIO</p>
              <h1>
                小さくつくり、
                <br />
                <em>ていねいに育てる。</em>
              </h1>
              <p className="studio-lead">
                フロントエンドを軸に、設計・API・テストまで。
                <br />
                右の小さな開発室から、これまでの仕事をのぞいてみてください。
              </p>
              <p className="studio-invitation">
                <span aria-hidden="true">↗</span>
                光っているPCをクリック
              </p>
              <button
                className="studio-project-cta"
                type="button"
                onClick={() => dispatch({ type: "REQUEST_PROJECTS" })}
              >
                デスクのProjectsを見る
                <ArrowRight size={15} />
              </button>
            </motion.div>
          ) : isProjects ? (
            <motion.section
              key="projects"
              className="projects-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="projects-screen-topbar">
                <button
                  className="project-back"
                  type="button"
                  onClick={() => dispatch({ type: "RETURN_TO_ROOM" })}
                >
                  <ArrowLeft size={16} />
                  部屋全体へ
                </button>
                <span>SELECTED PROJECTS</span>
              </div>
              <motion.article
                key={project.title}
                className="projects-screen-content"
                style={
                  { "--project-accent": project.accent } as React.CSSProperties
                }
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                aria-live="polite"
              >

              <p className="studio-eyebrow">
                PROJECT {String(state.projectIndex + 1).padStart(2, "0")}
              </p>
              <h2>{project.title}</h2>
              <p className="project-summary">{project.summary}</p>

              <ul className="project-tags" aria-label="使用技術">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <div className="project-actions">
                <button
                  type="button"
                  aria-label="前のプロジェクト"
                  onClick={() => dispatch({ type: "PREVIOUS_PROJECT" })}
                >
                  <ArrowLeft size={18} />
                </button>
                <span>
                  {state.projectIndex + 1} / {projects.length}
                </span>
                <button
                  type="button"
                  aria-label="次のプロジェクト"
                  onClick={() => dispatch({ type: "NEXT_PROJECT" })}
                >
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
          ) : null}
        </AnimatePresence>

        {state.phase === "room" ? (
          <div className="studio-hint">
            <Rotate3D size={18} />
            <span>ドラッグして部屋を見る</span>
            <span className="studio-hint-divider" />
            <span>光っているPCを選ぶ</span>
          </div>
        ) : null}
      </section>

      <footer className="studio-footer">
        <span>YOMIURILAND-MAE · KANAGAWA</span>
        <span>DESIGNED &amp; BUILT WITH CARE</span>
      </footer>
    </main>
  );
}
