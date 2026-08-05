"use client";

import { ContactShadows, PresentationControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { ROOM_CAMERA_POSITION, ROOM_FOV } from "../model/scene-config";
import type { StudioSceneProps } from "../model/studio-scene";
import { CameraRig } from "./studio/CameraRig";
import { CanvasResizeSync } from "./studio/CanvasResizeSync";
import { Room } from "./studio/Room";

export function StudioScene({
  phase,
  cameraPhase,
  accent,
  projectIndex,
  onOpenProjects,
  onOpenBookshelf,
  onOpenCorkboard,
  onOpenWindow,
  onDisplayReached,
  onBookshelfReached,
  onCorkboardReached,
  onWindowReached,
  onRoomRestored,
}: StudioSceneProps) {
  const roomIsInteractive = phase === "room";
  const viewRef = useRef<HTMLDivElement>(null!);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  const shadowMapSize = isMobile ? 512 : 1024;
  const contactShadowResolution = isMobile ? 256 : 512;
  const room = (
    <Room
      phase={phase}
      accent={accent}
      projectIndex={projectIndex}
      onOpenProjects={onOpenProjects}
      onOpenBookshelf={onOpenBookshelf}
      onOpenCorkboard={onOpenCorkboard}
      onOpenWindow={onOpenWindow}
    />
  );

  return (
    <div
      className="studio-canvas"
      aria-hidden="true"
      data-camera-phase={cameraPhase}
      style={{ pointerEvents: "none" }}
    >
      <div
        ref={viewRef}
        className="studio-view"
        style={{
          pointerEvents: roomIsInteractive ? "auto" : "none",
          ...(isMobile
            ? {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderColor: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                transition: "none",
              }
            : {}),
        }}
      >
        <Canvas
          shadows
          dpr={isMobile ? 1 : [1, 1.6]}
          camera={{
            position: ROOM_CAMERA_POSITION.toArray(),
            fov: ROOM_FOV,
            near: 0.1,
            far: 100,
          }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <fog attach="fog" args={["#e8e3d5", 18, 31]} />
          <hemisphereLight args={["#f7f0dd", "#aaa48f", 1.02]} />
          <ambientLight intensity={1.1} color="#f5ecd8" />
          <directionalLight
            position={[5, 9, 6]}
            intensity={2}
            color="#fff0cf"
            castShadow
            shadow-mapSize={[shadowMapSize, shadowMapSize]}
            shadow-camera-far={25}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />
          <ContactShadows
            position={[0, -0.02, 0]}
            opacity={0.31}
            scale={11}
            blur={2.5}
            far={5.5}
            resolution={contactShadowResolution}
            frames={1}
          />
          <CanvasResizeSync viewRef={viewRef} />
          <CameraRig
            phase={cameraPhase}
            onDisplayReached={onDisplayReached}
            onBookshelfReached={onBookshelfReached}
            onCorkboardReached={onCorkboardReached}
            onWindowReached={onWindowReached}
            onRoomRestored={onRoomRestored}
          />
          {isMobile ? (
            <group rotation={[0, -0.08, 0]}>{room}</group>
          ) : (
            <PresentationControls
              global
              enabled={roomIsInteractive}
              cursor
              snap
              speed={0.9}
              zoom={0.82}
              rotation={[0, -0.08, 0]}
              polar={[-0.08, 0.18]}
              azimuth={[-0.4, 0.35]}
            >
              {room}
            </PresentationControls>
          )}
        </Canvas>
      </div>
    </div>
  );
}
