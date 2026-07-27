"use client";

import {
  ContactShadows,
  Float,
  PresentationControls,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { ROOM_CAMERA_POSITION, ROOM_FOV } from "../model/scene-config";
import type { StudioSceneProps } from "../model/studio-scene";
import { CameraRig } from "./studio/CameraRig";
import { CanvasResizeSync } from "./studio/CanvasResizeSync";

type BoxProps = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  radius?: number;
};

function Box({ position, scale, color, rotation, radius = 0.06 }: BoxProps) {
  return (
    <RoundedBox
      position={position}
      scale={scale}
      rotation={rotation}
      radius={radius}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.93} metalness={0.01} />
    </RoundedBox>
  );
}

function SolidBox({ position, scale, color, rotation }: BoxProps) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.93} metalness={0.01} />
    </mesh>
  );
}

function MiniStairs({
  position,
  rotation = [0, 0, 0],
  bottomStepOffsetX = 0,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  bottomStepOffsetX?: number;
}) {
  const steps: Array<{
    position: [number, number, number];
    scale: [number, number, number];
  }> = [
    { position: [bottomStepOffsetX, 0.075, 0.54], scale: [1.18, 0.15, 0.48] },
    { position: [0, 0.2, 0.18], scale: [1.18, 0.15, 0.48] },
    { position: [0, 0.325, -0.18], scale: [1.18, 0.15, 0.48] },
    { position: [0, 0.45, -0.54], scale: [1.18, 0.15, 0.48] },
  ];

  return (
    <group position={position} rotation={rotation}>
      {steps.map((step, index) => (
        <SolidBox
          key={index}
          position={step.position}
          scale={step.scale}
          color="#d7c2a2"
        />
      ))}
    </group>
  );
}

function DeskChair() {
  const casters: Array<[number, number, number]> = [
    [-0.42, 0.08, 0],
    [0.42, 0.08, 0],
    [0, 0.08, -0.38],
    [0, 0.08, 0.38],
  ];

  return (
    <group position={[1.4, 0.1, 1.78]} rotation={[0, 0.03, 0]}>
      <Box
        position={[0, 0.64, 0]}
        scale={[0.9, 0.2, 0.76]}
        color="#344267"
        radius={0.14}
      />
      <Box
        position={[0, 1.1, 0.31]}
        scale={[0.8, 0.74, 0.2]}
        rotation={[-0.08, 0, 0]}
        color="#40517c"
        radius={0.14}
      />
      <Box
        position={[0, 0.35, 0]}
        scale={[0.12, 0.52, 0.12]}
        color="#74757b"
        radius={0.04}
      />
      <Box
        position={[0, 0.16, 0]}
        scale={[0.84, 0.08, 0.1]}
        color="#74757b"
        radius={0.025}
      />
      <Box
        position={[0, 0.16, 0]}
        scale={[0.1, 0.08, 0.76]}
        color="#74757b"
        radius={0.025}
      />
      {casters.map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#555760" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Desk({
  accent,
  active,
  onOpen,
}: {
  accent: string;
  active: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (screenMaterial.current) {
      const glow = active || hovered ? 2.5 : 1.35;
      screenMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        screenMaterial.current.emissiveIntensity,
        glow,
        7,
        delta
      );
    }
  });

  const handlePointer = (event: ThreeEvent<PointerEvent>, value: boolean) => {
    event.stopPropagation();
    setHovered(value);
    document.body.style.cursor = value ? "pointer" : "default";
  };

  return (
    <group position={[1.25, 0, 0.45]}>
      <Box
        position={[0, 1.22, 0]}
        scale={[3.42, 0.3, 1.58]}
        color="#6176bd"
        radius={0.12}
      />
      <Box
        position={[-1.4, 0.55, 0]}
        scale={[0.25, 1.35, 1.2]}
        color="#4f5f86"
        radius={0.06}
      />
      <Box
        position={[1.34, 0.59, 0]}
        scale={[0.66, 1.16, 1.22]}
        color="#53668f"
        radius={0.08}
      />
      <Box
        position={[1.34, 0.75, 0.62]}
        scale={[0.48, 0.1, 0.05]}
        color="#7e8cb1"
        radius={0.015}
      />
      <Box
        position={[1.34, 0.39, 0.62]}
        scale={[0.48, 0.1, 0.05]}
        color="#7e8cb1"
        radius={0.015}
      />

      <group
        position={[0.15, 2.08, -0.25]}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        onPointerOver={(event) => handlePointer(event, true)}
        onPointerOut={(event) => handlePointer(event, false)}
      >
        <Box
          position={[0, 0, 0]}
          scale={[1.82, 1.1, 0.16]}
          color="#607069"
          radius={0.055}
        />
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[1.56, 0.84]} />
          <meshStandardMaterial
            ref={screenMaterial}
            color="#d9e2d3"
            emissive={accent}
            emissiveIntensity={1.35}
            toneMapped={false}
          />
        </mesh>
        <Box
          position={[0, -0.52, 0.08]}
          scale={[1.62, 0.09, 0.07]}
          color="#536159"
          radius={0.018}
        />
        <Box
          position={[0, -0.67, -0.01]}
          scale={[0.18, 0.3, 0.16]}
          color="#77837c"
          radius={0.03}
        />
        <Box
          position={[0, -0.82, 0.1]}
          scale={[0.88, 0.1, 0.5]}
          color="#77837c"
          radius={0.03}
        />
      </group>

      <group position={[0.08, 1.43, 0.45]} rotation={[-0.035, 0, 0]}>
        <Box
          position={[0, 0, 0]}
          scale={[1.28, 0.1, 0.52]}
          color="#d4d0c3"
          radius={0.035}
        />
        {[-0.42, -0.21, 0, 0.21, 0.42].map((x) => (
          <Box
            key={x}
            position={[x, 0.06, -0.04]}
            scale={[0.14, 0.03, 0.29]}
            color="#eee9dc"
            radius={0.008}
          />
        ))}
      </group>

      <group position={[1.32, 1.55, 0.53]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.21, 0.19, 0.4, 20]} />
          <meshStandardMaterial color="#dfd3b8" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.015, 0]}>
          <torusGeometry args={[0.14, 0.032, 10, 20]} />
          <meshStandardMaterial color="#dfd3b8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.205, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.165, 20]} />
          <meshStandardMaterial color="#765441" roughness={0.95} />
        </mesh>
      </group>

      <group position={[-0.95, 1.43, 0.38]} rotation={[0, -0.15, 0]}>
        <Box
          position={[0, 0, 0]}
          scale={[0.7, 0.09, 0.52]}
          color="#d8c6a5"
          radius={0.03}
        />
        <Box
          position={[-0.29, 0.05, 0]}
          scale={[0.04, 0.03, 0.45]}
          color="#a66f5e"
          radius={0.008}
        />
        <mesh position={[0.09, 0.08, 0.03]} rotation={[0, -0.35, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.54, 10]} />
          <meshStandardMaterial color="#6d7f78" roughness={0.82} />
        </mesh>
      </group>
    </group>
  );
}

function Bookshelf({ onOpen }: { onOpen: () => void }) {
  const bookColors = ["#c78976", "#d3b56f", "#89a28a", "#91a5b7", "#dac79b"];
  const shelfLevels = [0.72, 1.48, 2.24];

  return (
    <group
      position={[-2.55, 0.5, -3.12]}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <Box
        position={[0, 1.55, -0.36]}
        scale={[2.02, 2.98, 0.12]}
        color="#70927f"
        radius={0.05}
      />
      <Box
        position={[-1.02, 1.55, 0]}
        scale={[0.2, 3.12, 0.84]}
        color="#5f806f"
        radius={0.05}
      />
      <Box
        position={[1.02, 1.55, 0]}
        scale={[0.2, 3.12, 0.84]}
        color="#5f806f"
        radius={0.05}
      />
      <Box
        position={[0, 3.06, 0]}
        scale={[2.22, 0.2, 0.84]}
        color="#557463"
        radius={0.05}
      />
      <Box
        position={[0, 0.08, 0]}
        scale={[2.22, 0.2, 0.84]}
        color="#557463"
        radius={0.05}
      />
      {shelfLevels.map((y) => (
        <Box
          key={y}
          position={[0, y, 0]}
          scale={[2.02, 0.14, 0.78]}
          color="#4f6c5d"
          radius={0.025}
        />
      ))}
      {Array.from({ length: 12 }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const height = 0.48 + ((index * 7) % 4) * 0.07;
        const width = 0.2 + ((index * 3) % 3) * 0.025;
        const shelfY = shelfLevels[row];

        return (
          <Box
            key={index}
            position={[-0.68 + column * 0.45, shelfY + height / 2 + 0.08, 0.04]}
            scale={[width, height, 0.46]}
            color={bookColors[index % bookColors.length]}
            rotation={[0, 0, ((index % 3) - 1) * 0.03]}
            radius={0.018}
          />
        );
      })}
      <mesh position={[0.58, 3.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.23, 0.19, 0.34, 12]} />
        <meshStandardMaterial color="#d6a073" roughness={0.94} />
      </mesh>
      <group position={[0.58, 3.5, 0]}>
        {[-0.18, 0, 0.18].map((x, index) => (
          <mesh
            key={x}
            position={[x, 0.16 + index * 0.05, 0]}
            rotation={[0, 0, (index - 1) * 0.45]}
            castShadow
          >
            <sphereGeometry args={[0.2, 8, 6]} />
            <meshStandardMaterial
              color={index === 1 ? "#759174" : "#89a187"}
              roughness={0.96}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Corkboard({ onOpen }: { onOpen: () => void }) {
  return (
    <group
      position={[2.7, 2.65, -3.78]}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <Box
        position={[0, 0, 0]}
        scale={[2.08, 1.58, 0.16]}
        color="#b96d5d"
        radius={0.08}
      />
      <Box
        position={[0, 0, 0.1]}
        scale={[1.78, 1.28, 0.09]}
        color="#d99072"
        radius={0.05}
      />
      {[
        [-0.5, 0.2, "#eee0c4", -0.08],
        [0, -0.18, "#dfe7dc", 0.04],
        [0.5, 0.18, "#d8dce6", 0.09],
      ].map(([x, y, color, rotate], index) => (
        <Float
          key={index}
          speed={1 + index * 0.15}
          floatIntensity={0.025}
          rotationIntensity={0.018}
        >
          <mesh
            position={[Number(x), Number(y), 0.17]}
            rotation={[0, 0, Number(rotate)]}
          >
            <planeGeometry args={[0.48, 0.62]} />
            <meshStandardMaterial color={String(color)} roughness={0.96} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Window({ onOpen }: { onOpen: () => void }) {
  return (
    <group
      position={[-3.98, 2.55, 0.55]}
      rotation={[0, Math.PI / 2, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <Box
        position={[0, 0, 0]}
        scale={[2.1, 1.78, 0.18]}
        color="#d5c09f"
        radius={0.05}
      />
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1.78, 1.44]} />
        <meshStandardMaterial
          color="#d5e0d4"
          emissive="#edf0d9"
          emissiveIntensity={0.12}
          roughness={0.72}
        />
      </mesh>
      <Box
        position={[0, 0, 0.15]}
        scale={[0.09, 1.52, 0.09]}
        color="#eee5ce"
        radius={0.018}
      />
      <Box
        position={[0, 0, 0.15]}
        scale={[1.84, 0.09, 0.09]}
        color="#eee5ce"
        radius={0.018}
      />
      <Box
        position={[0, -0.96, 0.05]}
        scale={[2.28, 0.2, 0.34]}
        color="#c8aa7f"
        radius={0.045}
      />
    </group>
  );
}

function Plant() {
  const [active, setActive] = useState(false);
  const leaves = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (leaves.current) {
      leaves.current.rotation.z = THREE.MathUtils.damp(
        leaves.current.rotation.z,
        active ? Math.sin(state.clock.elapsedTime * 3.5) * 0.12 : 0,
        6,
        delta
      );
      leaves.current.scale.y = THREE.MathUtils.damp(
        leaves.current.scale.y,
        active ? 1.12 : 1,
        6,
        delta
      );
    }
  });

  return (
    <group
      position={[-2.9, 0.45, 2.42]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.72, 12]} />
        <meshStandardMaterial color="#c98f62" roughness={0.94} />
      </mesh>
      <group ref={leaves}>
        {[
          [-0.26, 0.78, 0.05, -0.5],
          [0.25, 0.84, 0, 0.48],
          [-0.08, 1.06, -0.04, -0.12],
          [0.14, 1.2, 0.02, 0.2],
        ].map(([x, y, z, rotation], index) => (
          <mesh
            key={index}
            position={[x, y, z]}
            rotation={[0, 0, rotation]}
            castShadow
          >
            <sphereGeometry args={[0.31, 9, 7]} />
            <meshStandardMaterial
              color={index % 2 === 1 ? "#789878" : "#91a98b"}
              roughness={0.96}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DeskLamp() {
  const [active, setActive] = useState(false);
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (light.current) {
      light.current.intensity = THREE.MathUtils.damp(
        light.current.intensity,
        active ? 6 : 0.45,
        8,
        delta
      );
    }
    if (bulb.current) {
      bulb.current.emissiveIntensity = THREE.MathUtils.damp(
        bulb.current.emissiveIntensity,
        active ? 2.8 : 0.3,
        8,
        delta
      );
    }
  });

  return (
    <group
      position={[2.58, 1.38, 0.38]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <Box
        position={[0, 0, 0]}
        scale={[0.56, 0.1, 0.4]}
        color="#4f5f86"
        radius={0.05}
      />
      <Box
        position={[0, 0.4, 0]}
        scale={[0.09, 0.76, 0.09]}
        color="#5e72b4"
        radius={0.025}
      />
      <mesh position={[0.18, 0.75, 0]} rotation={[0, 0, -0.55]}>
        <coneGeometry args={[0.31, 0.35, 16, 1, true]} />
        <meshStandardMaterial color="#d8b477" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.18, 0.66, 0]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshStandardMaterial
          ref={bulb}
          color="#fff4ce"
          emissive="#f7d693"
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={light}
        position={[0.18, 0.58, 0.32]}
        color="#f5d9a8"
        intensity={0.45}
        distance={3.2}
      />
    </group>
  );
}

function Room({
  phase,
  accent,
  projectIndex,
  onOpenProjects,
  onOpenBookshelf,
  onOpenCorkboard,
  onOpenWindow,
}: Pick<
  StudioSceneProps,
  | "phase"
  | "accent"
  | "projectIndex"
  | "onOpenProjects"
  | "onOpenBookshelf"
  | "onOpenCorkboard"
  | "onOpenWindow"
>) {
  void projectIndex;

  return (
    <group>
      <Box
        position={[0, -0.22, -0.35]}
        scale={[8.2, 0.42, 7.15]}
        color="#d8c5a5"
        radius={0.08}
      />

      <SolidBox
        position={[1.2, 0.02, 0.5]}
        scale={[4.3, 0.14, 2.7]}
        color="#6176bd"
      />
      <Box
        position={[1.25, 0.125, 1.65]}
        scale={[2.5, 0.06, 1.5]}
        color="#c7c4bc"
        radius={0.045}
      />

      <SolidBox
        position={[-2.5, 0.2, -2.58]}
        scale={[3.2, 0.46, 2.7]}
        color="#d8c3a2"
      />
      <SolidBox
        position={[-2.5, 0.49, -2.58]}
        scale={[2.96, 0.12, 2.3]}
        color="#7da28b"
      />

      <SolidBox
        position={[2.68, 0.2, -2.58]}
        scale={[2.5, 0.46, 2.3]}
        color="#d8c3a2"
      />
      <SolidBox
        position={[2.68, 0.49, -2.58]}
        scale={[2.18, 0.12, 1.96]}
        color="#d97d68"
      />

      <SolidBox
        position={[-2.8, 0.02, 2.35]}
        scale={[2.5, 0.14, 1.8]}
        color="#d8b98d"
      />
      <SolidBox
        position={[-0.95, -0.01, -0.35]}
        scale={[1.55, 0.1, 1.5]}
        color="#dfc9a8"
      />

      <MiniStairs position={[-1.61, 0, -1.14]} />
      <MiniStairs position={[2.68, 0, -1.14]} />

      <SolidBox
        position={[-2.55, 1.89, -3.91]}
        scale={[3.2, 3.8, 0.24]}
        color="#b3bba4"
      />
      <SolidBox
        position={[0, 1.89, -3.91]}
        scale={[2, 3.8, 0.24]}
        color="#eadbc4"
      />
      <SolidBox
        position={[2.55, 1.89, -3.91]}
        scale={[3.2, 3.8, 0.24]}
        color="#d8a08c"
      />
      <SolidBox
        position={[-4.09, 1.89, -2.45]}
        scale={[0.24, 3.8, 2.96]}
        color="#aab59e"
      />
      <SolidBox
        position={[-4.09, 1.89, 1.1]}
        scale={[0.24, 3.8, 4.2]}
        color="#dbc29e"
      />

      <SolidBox
        position={[-2.55, 0.48, -3.74]}
        scale={[3.08, 0.18, 0.36]}
        color="#91a18d"
      />
      <SolidBox
        position={[2.68, 0.48, -3.74]}
        scale={[2.34, 0.18, 0.36]}
        color="#c98672"
      />

      <Desk accent={accent} active={phase === "projects"} onOpen={onOpenProjects} />
      <DeskChair />
      <Bookshelf onOpen={onOpenBookshelf} />
      <Corkboard onOpen={onOpenCorkboard} />
      <Window onOpen={onOpenWindow} />
      <Plant />
      <DeskLamp />

      <pointLight
        position={[0.4, 4.7, 3.2]}
        color="#f4dfb7"
        intensity={7.1}
        distance={10}
        decay={2}
        castShadow
      />
    </group>
  );
}

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
        style={{ pointerEvents: roomIsInteractive ? "auto" : "none" }}
      >
        <Canvas
          shadows
          dpr={[1, 1.6]}
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
            shadow-mapSize={[1024, 1024]}
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
            resolution={512}
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
            <Room
              phase={phase}
              accent={accent}
              projectIndex={projectIndex}
              onOpenProjects={onOpenProjects}
              onOpenBookshelf={onOpenBookshelf}
              onOpenCorkboard={onOpenCorkboard}
              onOpenWindow={onOpenWindow}
            />
          </PresentationControls>
        </Canvas>
      </div>
    </div>
  );
}
