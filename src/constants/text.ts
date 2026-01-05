export const TEXT = {
  header: {
    brand: "Portfolio",
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
  },
  hero: {
    greeting: "HELLO！",
    title: "Visitor！",
    descriptionLines: [
      "日々学び、成長を目指すエンジニアです。",
    ],
    contactCta: "お問い合わせ",
  },
  about: {
    heading: "About Me",
    subheading: "私について",
    badgeEmoji: "👨‍💻",
    badgeLine1: "絶賛勉強中の",
    badgeLine2: "エンジニア",
    paragraphs: [
      "30代からプログラミングを始め、日々学習を続けている駆け出しエンジニアです。",
      "まだまだ学ぶことは多いですが、一歩ずつ着実に成長していきたいと思っています。",
    ],
    features: {
      codingTitle: "コーディング",
      codingDescription: "FEを中心とした技術を学習中です",
      problemTitle: "問題解決",
      problemDescription: "AI等も駆使し課題に取り組みます",
      growthTitle: "成長意欲",
      growthDescription: "マイペースに、しかし着実に成長していきたいと思っています",
    },
  },
  contact: {
    heading: "Contact",
    subheading: "お気軽にご連絡ください",
    messageLines: [
      "ご質問やご相談がございましたら、",
      "お気軽にお問い合わせください！",
    ],
    madeWith: "Made with",
    byline: "by Yoshitaka Sano",
    copyright: "© 2025 All rights reserved",
    socialLinks: [
      {
        label: "GitHub",
        href: "https://github.com/yoosaa",
        color: "from-gray-600 to-gray-800",
        particleColor: "#6b7280",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/%E6%81%B5%E9%9A%86-%E4%BD%90%E9%87%8E-41a05b350/",
        color: "from-blue-500 to-blue-700",
        particleColor: "#3b82f6",
      },
      {
        label: "Wantedly",
        href: "https://www.wantedly.com/id/yoshitaka_sano_prof",
        color: "from-sky-400 to-blue-500",
        particleColor: "#38bdf8",
      },
      {
        label: "YOUTRUST",
        href: "https://youtrust.jp/users/y-sano",
        color: "from-red-500 to-pink-500",
        particleColor: "#ef4444",
      },
    ],
  },
  skillOrb: {
    skills: [
      {
        name: "React",
        color: "#61dafb",
        gradient: "from-cyan-400 to-blue-500",
      },
      {
        name: "TypeScript",
        color: "#3178c6",
        gradient: "from-blue-500 to-blue-700",
      },
      {
        name: "Node.js",
        color: "#68a063",
        gradient: "from-green-400 to-green-600",
      },
      {
        name: "Three.js",
        color: "#000000",
        gradient: "from-gray-700 to-black",
      },
      {
        name: "Tailwind",
        color: "#06b6d4",
        gradient: "from-cyan-400 to-cyan-600",
      },
    ],
  },
  showcase: {
    heading: "3D Interactive Elements",
    description:
      "CSS 3DトランスフォームとMotionを使った3パターンのインタラクティブな要素",
    tabs: {
      geometry: {
        title: "パターン1",
        subtitle: "浮遊する幾何学形状",
      },
      orb: {
        title: "パターン2",
        subtitle: "3Dスキルオーブ",
      },
      wave: {
        title: "パターン3",
        subtitle: "パーティクルウェーブ",
      },
    },
    sections: {
      geometry: {
        title: "🎨 浮遊する幾何学形状",
        description:
          "CSS 3Dトランスフォームを使用した複数の図形が回転しながら浮遊します。ホバーすると拡大するインタラクションも実装されています。",
        bullets: [
          "✓ CSS 3D Transform アニメーション",
          "✓ ホバーでスケールアップ",
          "✓ グラデーション背景",
        ],
      },
      orb: {
        title: "💎 3Dスキルオーブ",
        description:
          "各スキルを表現する球体オーブ。ホバーすると拡大し、パーティクルエフェクトが発生します。常に浮遊・回転するアニメーションが特徴です。",
        bullets: [
          "✓ ホバーでパーティクルエフェクト",
          "✓ 連続的な浮遊・回転アニメーション",
          "✓ 各スキルに異なるグラデーション",
        ],
      },
      wave: {
        title: "🌊 パーティクルウェーブ",
        description:
          "1000個のパーティクルがマウスカーソルに反応して波のように動きます。カラフルなグラデーションと滑らかなアニメーションが特徴です。",
        bullets: [
          "✓ マウスカーソルに追従",
          "✓ 1000個のパーティクルアニメーション",
          "✓ グラデーションカラー",
        ],
      },
    },
    tipsHeading: "実装のヒント",
    tips: [
      {
        label: "パターン1 (FloatingGeometry):",
        text: "Heroセクションの背景として配置。CSS 3D Transformsで軽量に実装。",
      },
      {
        label: "パターン2 (SkillOrb):",
        text: "Skillsセクション内で既存のスキルリストの代わりに使用。ホバーエフェクトが魅力的。",
      },
      {
        label: "パターン3 (ParticleWave):",
        text: "セクション間の区切りや、ページ下部の装飾として使用。マウス追従が楽しい。",
      },
    ],
  },
  ui: {
    breadcrumb: {
      ariaLabel: "breadcrumb",
      moreLabel: "More",
    },
    pagination: {
      ariaLabel: "pagination",
      prevAriaLabel: "Go to previous page",
      nextAriaLabel: "Go to next page",
      prevLabel: "Previous",
      nextLabel: "Next",
      moreLabel: "More pages",
    },
    carousel: {
      prevLabel: "Previous slide",
      nextLabel: "Next slide",
    },
    sheet: {
      closeLabel: "Close",
    },
    dialog: {
      closeLabel: "Close",
    },
    sidebar: {
      title: "Sidebar",
      description: "Displays the mobile sidebar.",
      toggleLabel: "Toggle Sidebar",
    },
    command: {
      title: "Command Palette",
      description: "Search for a command to run...",
    },
  },
};
