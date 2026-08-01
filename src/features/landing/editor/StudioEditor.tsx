"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Room } from "../components/studio/Room";
import { roomCamera, type StudioCameraConfig } from "../model/studio-camera";
import {
  studioLayout,
  type StudioLayout,
  type StudioVector3,
} from "../model/studio-layout";

const noop = () => undefined;

type ObjectKey = keyof StudioLayout;
type TransformKey = "position" | "rotation" | "scale";

type DirtyState = {
  layout: boolean;
  camera: boolean;
};

function CameraSync({ config }: { config: StudioCameraConfig }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...config.position);
    camera.lookAt(...config.target);
    if ("fov" in camera) {
      camera.fov = config.fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, config]);

  return null;
}

function VectorEditor({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: StudioVector3;
  step: number;
  onChange: (value: StudioVector3) => void;
}) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend style={{ marginBottom: 8, fontWeight: 700 }}>{label}</legend>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {(["X", "Y", "Z"] as const).map((axis, index) => (
          <label key={axis} style={{ display: "grid", gap: 4, fontSize: 12 }}>
            {axis}
            <input
              type="number"
              value={value[index]}
              step={step}
              onChange={(event) => {
                const next = [...value] as StudioVector3;
                next[index] = Number(event.target.value);
                onChange(next);
              }}
              style={{ width: "100%", padding: 7 }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function StudioEditor() {
  const [layout, setLayout] = useState<StudioLayout>(() => structuredClone(studioLayout));
  const [camera, setCamera] = useState<StudioCameraConfig>(() => structuredClone(roomCamera));
  const [selected, setSelected] = useState<ObjectKey>("bookshelf");
  const [message, setMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [dirty, setDirty] = useState<DirtyState>({ layout: false, camera: false });

  const output = useMemo(
    () => JSON.stringify({ layout, camera, changed: dirty }, null, 2),
    [layout, camera, dirty],
  );

  const updateTransform = (key: TransformKey, value: StudioVector3) => {
    setLayout((current) => ({
      ...current,
      [selected]: { ...current[selected], [key]: value },
    }));
    setDirty((current) => ({ ...current, layout: true }));
  };

  const updateCamera = (next: Partial<StudioCameraConfig>) => {
    setCamera((current) => ({ ...current, ...next }));
    setDirty((current) => ({ ...current, camera: true }));
  };

  const applyToWorktree = async () => {
    if (!dirty.layout && !dirty.camera) {
      setMessage("変更された設定はありません");
      return;
    }

    setIsApplying(true);
    setMessage("対象worktreeへ反映中です…");

    try {
      const response = await fetch("/api/dev/studio/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: output,
      });
      const result = (await response.json()) as { message?: string; files?: string[] };

      if (!response.ok) {
        throw new Error(result.message ?? "反映に失敗しました");
      }

      setDirty({ layout: false, camera: false });
      setMessage(`反映しました: ${(result.files ?? []).join(", ")}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "反映に失敗しました");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <main style={{ height: "100dvh", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", background: "#dfe8df" }}>
      <section style={{ minWidth: 0 }}>
        <Canvas shadows camera={{ position: camera.position, fov: camera.fov }}>
          <color attach="background" args={["#dfe8df"]} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 9, 6]} intensity={2} castShadow />
          <gridHelper args={[12, 24]} position={[0, 0.01, 0]} />
          <axesHelper args={[2]} />
          <CameraSync config={camera} />
          <Room
            layout={layout}
            phase="room"
            accent="#d78d6d"
            projectIndex={0}
            onOpenProjects={noop}
            onOpenBookshelf={noop}
            onOpenCorkboard={noop}
            onOpenWindow={noop}
          />
          <OrbitControls target={camera.target} enableDamping={false} />
        </Canvas>
      </section>

      <aside style={{ overflow: "auto", padding: 20, background: "#f7f4ec", borderLeft: "1px solid #bbb", display: "grid", alignContent: "start", gap: 20 }}>
        <header>
          <h1 style={{ margin: 0, fontSize: 22 }}>Studio Editor</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13 }}>数値を変更するとリアルタイムで反映されます。</p>
          <p style={{ margin: "6px 0 0", fontSize: 12 }}>
            未保存: {[dirty.layout && "layout", dirty.camera && "camera"].filter(Boolean).join(", ") || "なし"}
          </p>
        </header>

        <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
          編集対象
          <select value={selected} onChange={(event) => setSelected(event.target.value as ObjectKey)} style={{ padding: 8 }}>
            <option value="bookshelf">Bookshelf</option>
            <option value="deskArea">Desk area</option>
          </select>
        </label>

        <VectorEditor label="Position" value={layout[selected].position} step={0.01} onChange={(value) => updateTransform("position", value)} />
        <VectorEditor label="Rotation" value={layout[selected].rotation} step={0.01} onChange={(value) => updateTransform("rotation", value)} />
        <VectorEditor label="Scale" value={layout[selected].scale} step={0.01} onChange={(value) => updateTransform("scale", value)} />
        <VectorEditor label="Camera position" value={camera.position} step={0.05} onChange={(position) => updateCamera({ position })} />
        <VectorEditor label="Camera target" value={camera.target} step={0.05} onChange={(target) => updateCamera({ target })} />

        <label style={{ display: "grid", gap: 4, fontWeight: 700 }}>
          FOV
          <input type="number" value={camera.fov} step={1} onChange={(event) => updateCamera({ fov: Number(event.target.value) })} style={{ padding: 7 }} />
        </label>

        <div style={{ display: "grid", gap: 8 }}>
          <button type="button" onClick={applyToWorktree} disabled={isApplying || (!dirty.layout && !dirty.camera)} style={{ padding: 10, fontWeight: 700 }}>
            {isApplying ? "反映中…" : "対象worktreeへ反映"}
          </button>
          <button type="button" onClick={async () => { await navigator.clipboard.writeText(output); setMessage("JSONをコピーしました"); }} style={{ padding: 10 }}>JSONをコピー</button>
          <button type="button" onClick={() => { setLayout(structuredClone(studioLayout)); setCamera(structuredClone(roomCamera)); setDirty({ layout: false, camera: false }); setMessage("初期値へ戻しました"); }} style={{ padding: 10 }}>初期値へ戻す</button>
        </div>

        {message ? <p role="status" style={{ margin: 0, fontSize: 13 }}>{message}</p> : null}
        <textarea readOnly value={output} rows={16} style={{ width: "100%", fontFamily: "monospace", fontSize: 11 }} />
      </aside>
    </main>
  );
}
