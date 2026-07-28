import { ArrowLeft, ArrowUpRight, BookOpen, Code2, FlaskConical, Layers3 } from "lucide-react";
import { motion } from "motion/react";
import styles from "./LibraryScreen.module.css";

type LibraryScreenProps = {
  onReturnToRoom: () => void;
};

const shelves = [
  {
    label: "FRONTEND",
    title: "画面をつくる技術",
    description: "実務と個人開発の両方で使ってきた、フロントエンドの中心技術です。",
    icon: Code2,
    items: ["TypeScript", "React / Next.js", "Svelte / SvelteKit", "Vue", "Tailwind CSS"],
  },
  {
    label: "ARCHITECTURE",
    title: "構造を整える考え方",
    description: "変更しやすく、意図を説明しやすいコードを目指して試してきた設計手法です。",
    icon: Layers3,
    items: ["Feature-based", "FSD", "Frontend DDD", "State Machine", "BFF"],
  },
  {
    label: "QUALITY",
    title: "安心して変えるために",
    description: "実装だけで終わらせず、確認と共有の仕組みまで含めて整えます。",
    icon: FlaskConical,
    items: ["Vitest", "Playwright", "Storybook", "GitHub Actions", "Documentation"],
  },
] as const;

export function LibraryScreen({ onReturnToRoom }: LibraryScreenProps) {
  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className={styles.topbar}>
        <button type="button" className={styles.backButton} onClick={onReturnToRoom}>
          <ArrowLeft size={16} />
          部屋全体へ
        </button>
        <span>MY LIBRARY</span>
      </div>

      <div className={styles.content}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>TECHNOLOGY & WRITING</p>
          <h1>学んだことを、<br />使える形で残す。</h1>
          <p>
            技術名を並べるだけではなく、どんな場面で使い、何を考えてきたかを小さな棚にまとめています。
          </p>
        </header>

        <div className={styles.shelves}>
          {shelves.map((shelf, index) => {
            const Icon = shelf.icon;
            return (
              <motion.article
                key={shelf.label}
                className={styles.shelf}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.38, delay: 0.06 * index }}
              >
                <div className={styles.shelfHeading}>
                  <span className={styles.icon}><Icon size={17} /></span>
                  <div>
                    <p>{shelf.label}</p>
                    <h2>{shelf.title}</h2>
                  </div>
                </div>
                <p className={styles.description}>{shelf.description}</p>
                <ul>
                  {shelf.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <motion.a
          className={styles.articleCard}
          href="https://qiita.com/ji_san/items/27c82faff2b887e222f2"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span className={styles.articleIcon}><BookOpen size={19} /></span>
          <div>
            <p>RECENT ARTICLE</p>
            <h2>Reactのレンダリングを、処理の流れから整理する</h2>
            <span>React / Rendering / React Compiler</span>
          </div>
          <ArrowUpRight className={styles.externalIcon} size={20} />
        </motion.a>
      </div>
    </motion.section>
  );
}
