export type Project = {
  title: string;
  summary: string;
  tags: readonly string[];
  accent: string;
  demo: string | null;
  source?: string | null;
};

export const deskProjects = [
  {
    title: "Clientnote",
    summary:
      "顧客との接点を、あとから振り返れる形で残す業務ログ。フロントとAPIを分け、設計・テスト・公開まで一通り組み立てました。",
    tags: ["SvelteKit", "Hono", "Cloudflare D1", "Playwright"],
    accent: "#78998b",
    demo: "https://clientnote.pages.dev",
    source: null,
  },
  {
    title: "Restocknote",
    summary:
      "小規模店舗の入荷・補充を迷わず共有するメモツール。Svelte 5とStorybookで、日常業務に馴染むUIを検証しました。",
    tags: ["Svelte 5", "Storybook", "Playwright", "Vercel"],
    accent: "#bd8f67",
    demo: "https://restocknote.vercel.app",
    source: "https://github.com/yoosaa/restocknote",
  },
  {
    title: "Decision note",
    summary:
      "複数の選択肢を落ち着いて比較するための意思決定メモ。小さく作り、テストとCIを通して公開する一連の流れを実践しました。",
    tags: ["Next.js", "TypeScript", "Vitest", "GitHub Actions"],
    accent: "#879bb0",
    demo: "https://decision-note-eight.vercel.app",
    source: "https://github.com/yoosaa/decision-note",
  },
] as const satisfies readonly Project[];

export const bookshelfProjects = [
  {
    title: "Reading shelf",
    summary:
      "調べたことをあとから辿れるように整える、個人向けのリーディングログ。小さな分類と検索を中心に、静かな閲覧体験を設計しました。",
    tags: ["Next.js", "MDX", "TypeScript", "Vercel"],
    accent: "#a78762",
    demo: null,
  },
  {
    title: "Pattern shelf",
    summary:
      "繰り返し使うUIのパターンを、用途ごとに並べて検証するための小さなカタログ。余白と状態変化を実装と並べて記録しています。",
    tags: ["React", "Storybook", "CSS", "Vitest"],
    accent: "#8b9d83",
    demo: null,
  },
  {
    title: "Archive note",
    summary:
      "制作の途中で生まれた資料や判断を、プロジェクトをまたいで残すアーカイブ。読み返しやすい構造と軽い入力体験を両立しました。",
    tags: ["Astro", "Content Collections", "Cloudflare", "Playwright"],
    accent: "#9b9aae",
    demo: null,
  },
] as const satisfies readonly Project[];

export const corkboardProjects = [
  {
    title: "Research wall",
    summary:
      "リサーチの断片を並べ、気づきのつながりを見つけるためのボード。メモの粒度と並び替えの手触りを丁寧に調整しました。",
    tags: ["React", "dnd-kit", "TypeScript", "Supabase"],
    accent: "#bf9d6f",
    demo: null,
  },
  {
    title: "Idea threads",
    summary:
      "散らばった着想を、会話のように育てていくアイデアメモ。関連する断片をゆるく結び、次の一手を見つけやすくしています。",
    tags: ["Svelte", "SQLite", "Motion", "Vitest"],
    accent: "#b68172",
    demo: null,
  },
  {
    title: "Launch board",
    summary:
      "公開前の確認事項をチームで共有するための進行ボード。状況が一目で分かる表示と、抜け漏れを減らす小さな導線を組み立てました。",
    tags: ["Next.js", "Prisma", "PostgreSQL", "GitHub Actions"],
    accent: "#879f88",
    demo: null,
  },
] as const satisfies readonly Project[];

export const windowProjects = [
  {
    title: "Daylight journal",
    summary:
      "日々の光や気分を短く残す、余白のあるジャーナル。時刻や天気の情報を背景に、書くことへ自然に意識を向けられる画面を目指しました。",
    tags: ["Next.js", "Open-Meteo", "TypeScript", "Vercel"],
    accent: "#92aa9a",
    demo: null,
  },
  {
    title: "Weather window",
    summary:
      "地域の天気を窓辺のように眺めるミニダッシュボード。必要な情報だけを柔らかく並べ、毎朝開きたくなる密度に整えました。",
    tags: ["React", "TanStack Query", "CSS", "Playwright"],
    accent: "#8ea7b2",
    demo: null,
  },
  {
    title: "City pulse",
    summary:
      "街のイベントや混雑の変化を、時間帯ごとに眺める探索画面。地図に頼りすぎず、軽い視覚表現で流れを伝えることを試しました。",
    tags: ["MapLibre", "Hono", "Cloudflare D1", "Vitest"],
    accent: "#a8a17e",
    demo: null,
  },
] as const satisfies readonly Project[];

export const projects = deskProjects;

export function getProjectsForPhase(phase: string): readonly Project[] {
  switch (phase) {
    case "zooming-to-bookshelf":
    case "bookshelf-projects":
    case "returning-from-bookshelf":
      return bookshelfProjects;
    case "zooming-to-corkboard":
    case "corkboard-projects":
    case "returning-from-corkboard":
      return corkboardProjects;
    case "zooming-to-window":
    case "window-projects":
    case "returning-from-window":
      return windowProjects;
    default:
      return deskProjects;
  }
}
