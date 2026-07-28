import { Rotate3D } from "lucide-react";

export function StudioHint() {
  return (
    <div className="studio-hint">
      <Rotate3D size={18} />
      <span>ドラッグして部屋を見る</span>
      <span className="studio-hint-divider" />
      <span>気になる場所をクリック</span>
    </div>
  );
}
