import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import styles from "./AboutScreen.module.css";

type AboutScreenProps = {
  onReturnToRoom: () => void;
};

const experienceItems = [
  "SaaS・業務システムの開発",
  "React / Svelte / SvelteKit",
  "BFF・API連携",
  "単体テスト・E2E・Storybook",
  "既存システムの移行・改善",
] as const;

const profileTags = ["React", "SvelteKit", "TypeScript"] as const;

const cardAnimation = {
  initial: { opacity: 0, y: 22, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

export function AboutScreen({ onReturnToRoom }: AboutScreenProps) {
  return (
    <motion.section
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className={styles.topbar}>
        <button
          className={styles.backButton}
          type="button"
          onClick={onReturnToRoom}
        >
          <ArrowLeft size={16} />
          部屋全体へ
        </button>
        <span>ABOUT ME</span>
      </div>

      <div className={styles.board}>
        <motion.article
          className={`${styles.card} ${styles.profileCard}`}
          {...cardAnimation}
          transition={{ duration: 0.4, delay: 0.04 }}
        >
          <p className={styles.cardLabel}>PROFILE</p>
          <h1>Yoshitaka Sano</h1>
          <p className={styles.role}>Frontend Engineer</p>
          <p className={styles.bodyText}>
            React・SvelteKit・TypeScriptを中心に、Webアプリケーションの設計と開発に取り組んでいます。
          </p>
          <ul className={styles.tags} aria-label="プロフィール概要">
            {profileTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className={`${styles.card} ${styles.experienceCard}`}
          {...cardAnimation}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className={styles.cardLabel}>EXPERIENCE</p>
          <h2>つくってきたもの</h2>
          <ul className={styles.experienceList}>
            {experienceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className={`${styles.card} ${styles.workCard}`}
          {...cardAnimation}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <p className={styles.cardLabel}>HOW I WORK</p>
          <h2>整理して、少しずつ良くする</h2>
          <p className={styles.bodyText}>
            既存の仕様やコードを読み解き、複雑になっている部分を少しずつ整理します。
          </p>
          <p className={styles.bodyText}>
            設計だけ、実装だけに閉じず、API・テスト・ドキュメントまで含めてプロダクト全体を見ながら改善します。
          </p>
          <p className={styles.smallNote}>
            チーム内で認識を合わせながら、無理のない形で前へ進めることを大切にしています。
          </p>
        </motion.article>

        <motion.article
          className={`${styles.card} ${styles.nextCard}`}
          {...cardAnimation}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <p className={styles.cardLabel}>NEXT</p>
          <h2>これから</h2>
          <p className={styles.bodyText}>
            フロントエンドを軸に、バックエンドや設計領域にも関わりながら、長期的にはマネジメント経験も積みたいと考えています。
          </p>
        </motion.article>
      </div>
    </motion.section>
  );
}
