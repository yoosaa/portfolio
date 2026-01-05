export type Skill = {
  name: string;
  years: number;
  gradient: string;
  particleColor: string;
};

export type SkillsData = {
  heading: string;
  subheading: string;
  quote: string;
  skills: Skill[];
};

type SkillRaw = {
  name: string;
  years: number;
  gradient?: string;
  particleColor?: string;
};

type SkillsDataRaw = {
  heading: string;
  subheading: string;
  quote: string;
  skills: SkillRaw[];
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  gradient: string;
  particleColor: string;
  github: string;
  demo: string;
};

export type ProjectsData = {
  heading: string;
  subheading: string;
  codeLabel: string;
  demoLabel: string;
  items: Project[];
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json() as Promise<T>;
}

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash) + value.charCodeAt(i);
  }
  return Math.abs(hash);
}

function generateSkillColors(name: string): { gradient: string; particleColor: string } {
  const hue = hashString(name) % 360;
  const hue2 = (hue + 18) % 360;
  const particleColor = `hsl(${hue}, 70%, 52%)`;
  const gradient = `linear-gradient(90deg, hsl(${hue}, 70%, 50%), hsl(${hue2}, 70%, 55%))`;
  return { gradient, particleColor };
}

export async function getSkillsData(): Promise<SkillsData> {
  const data = await fetchJson<SkillsDataRaw>("/data/skills.json");
  return {
    ...data,
    skills: data.skills.map((skill) => {
      const generated = generateSkillColors(skill.name);
      return {
        name: skill.name,
        years: skill.years,
        gradient: skill.gradient ?? generated.gradient,
        particleColor: skill.particleColor ?? generated.particleColor,
      };
    }),
  };
}

export async function getProjectsData(): Promise<ProjectsData> {
  return fetchJson<ProjectsData>("/data/projects.json");
}
