import { ArrowLeft, ArrowUpRight, Github, Newspaper, PanelsTopLeft } from "lucide-react";
import { motion } from "motion/react";
import styles from "./ElsewhereScreen.module.css";

type ElsewhereScreenProps = {
  onReturnToRoom: () => void;
};

const links = [
  {
    label: "GITHUB",
    title: "Source code",
    description: "個人開発や検証用リポジトリをまとめています。",
    href: "https://github.com/yoosaa",
    icon: Github,
  },
  {
    label: "QIITA",
    title: "Technical articles",
    description: "Reactやフロントエンド設計について、学んだ内容を言葉にしています。",
    href: "https://qiita.com/ji_san",
    icon: Newspaper,
  },
  {
    label: "THIS PORTFOLIO",
    title: "Portfolio repository",
    description: "この3Dポートフォリオ自体のソースコードです。",
    href: "https://github.com/yoosaa/portfolio",
    icon: PanelsTopLeft,
  },
] as const;

export function ElsewhereScreen({ onReturnToRoom }: ElsewhereScreenProps) {
  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.topbar}>
        <button type="button" className={styles.backButton} onClick={onReturnToRoom}>
          <ArrowLeft size={16} />
          部屋全体へ
        </button>
        <span>ELSEWHERE</span>
      </div>

      <div className={styles.content}>
        <motion.header
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
        >
          <p>OUTSIDE THE STUDIO</p>
          <h1>この部屋の外で、<br />続いていること。</h1>
          <span>コード、記事、制作の記録へ。</span>
        </motion.header>

        <div className={styles.links}>
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                className={styles.linkCard}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + index * 0.07 }}
              >
                <span className={styles.icon}><Icon size={21} /></span>
                <div>
                  <p>{link.label}</p>
                  <h2>{link.title}</h2>
                  <span>{link.description}</span>
                </div>
                <ArrowUpRight className={styles.externalIcon} size={20} />
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
