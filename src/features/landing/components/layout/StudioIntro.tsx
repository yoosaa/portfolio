import { ArrowRight } from "lucide-react";
import styles from "./StudioIntro.module.css";

type StudioIntroProps = {
  onOpenProjects: () => void;
};

export function StudioIntro({ onOpenProjects }: StudioIntroProps) {
  return (
    <div className={`studio-intro ${styles.intro}`}>
      <h1>
        <em>WELCOME</em> TO MY SMALL STUDIO
      </h1>
      <p className="studio-lead">
        右の小さな開発室から、色々のぞいてみてください。
      </p>
      <button className="studio-project-cta" type="button" onClick={onOpenProjects}>
        デスクをのぞく
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
