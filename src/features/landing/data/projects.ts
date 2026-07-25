export type Project = {
  title: string;
  summary: string;
  tags: readonly string[];
  accent: string;
  demo: string | null;
};

export const projects = [
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
] as const satisfies readonly Project[];
