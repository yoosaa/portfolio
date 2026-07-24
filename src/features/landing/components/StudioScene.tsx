"use client";

import {
  Float,
  PresentationControls,
  RoundedBox,
  SoftShadows,
} from "@react-three/drei";
import {
  Canvas,
  type ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type StudioPhase =
  | "room"
  | "zooming-to-display"
  | "projects"
  | "returning-to-room";

type StudioSceneProps = {
  phase: StudioPhase;
  cameraPhase: StudioPhase;
  accent: string;
  projectIndex: number;
  onOpenProjects: () => void;
  onDisplayReached: () => void;
  onRoomRestored: () => void;
};

const ROOM_CAMERA_POSITION = new THREE.Vector3(10.2, 7.6, 13.2);
const ROOM_LOOK_AT = new THREE.Vector3(0, 1.35, 0);
// The display plane is centred at (1.8, 2.2, 0.365) and faces +Z.
// This places the camera directly in front of the screen instead of beside it.
const DISPLAY_CAMERA_POSITION = new THREE.Vector3(1.8, 2.2, 1.35);
const DISPLAY_LOOK_AT = new THREE.Vector3(1.8, 2.2, 0.365);
const ROOM_FOV = 38;
const DISPLAY_FOV = 48;
const CAMERA_POSITION_EPSILON = 0.025;
const CAMERA_FOV_EPSILON = 0.08;
const CAMERA_ANGLE_EPSILON = 0.006;

function CameraRig({
  phase,
  onDisplayReached,
  onRoomRestored,
}: Pick<StudioSceneProps, "phase" | "onDisplayReached" | "onRoomRestored">) {
  const { camera } = useThree();
  const targetCamera = useMemo(() => new THREE.PerspectiveCamera(), []);
  const settledPhase = useRef<StudioPhase | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    settledPhase.current = null;
  }, [phase]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // R3F camera transforms are intentionally updated inside its render loop.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((_, delta) => {
    const isDisplayView =
      phase === "zooming-to-display" || phase === "projects";
    const targetPosition = isDisplayView
      ? DISPLAY_CAMERA_POSITION
      : ROOM_CAMERA_POSITION;
    const targetLookAt = isDisplayView ? DISPLAY_LOOK_AT : ROOM_LOOK_AT;
    const targetFov = isDisplayView ? DISPLAY_FOV : ROOM_FOV;

    targetCamera.position.copy(targetPosition);
    targetCamera.lookAt(targetLookAt);

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    if (prefersReducedMotion) {
      camera.position.copy(targetPosition);
      camera.quaternion.copy(targetCamera.quaternion);
      // eslint-disable-next-line react-hooks/immutability
      perspectiveCamera.fov = targetFov;
    } else {
      camera.position.lerp(targetPosition, 1 - Math.exp(-delta * 4.2));
      camera.quaternion.slerp(
        targetCamera.quaternion,
        1 - Math.exp(-delta * 5.4)
      );
      perspectiveCamera.fov = THREE.MathUtils.damp(
        perspectiveCamera.fov,
        targetFov,
        6,
        delta
      );
    }
    perspectiveCamera.updateProjectionMatrix();

    const hasReachedTarget =
      camera.position.distanceTo(targetPosition) < CAMERA_POSITION_EPSILON &&
      Math.abs(perspectiveCamera.fov - targetFov) < CAMERA_FOV_EPSILON &&
      camera.quaternion.angleTo(targetCamera.quaternion) < CAMERA_ANGLE_EPSILON;

    if (!hasReachedTarget || settledPhase.current === phase) {
      return;
    }

    settledPhase.current = phase;
    if (phase === "zooming-to-display") {
      onDisplayReached();
    }
    if (phase === "returning-to-room") {
      onRoomRestored();
    }
  });

  return null;
}

function Box({
  position,
  scale,
  color,
  rotation,
  radius = 0.06,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  radius?: number;
}) {
  return (
    <RoundedBox
      position={position}
      scale={scale}
      rotation={rotation}
      radius={radius}
      smoothness={3}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.78} />
    </RoundedBox>
  );
}

function Desk({
  accent,
  projectIndex,
  active,
  onOpen,
}: {
  accent: string;
  projectIndex: number;
  active: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const model = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (screenMaterial.current) {
      const glow = active || hovered ? 2.5 : 1.35;
      screenMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        screenMaterial.current.emissiveIntensity,
        glow,
        7,
        delta
      );
    }
    if (model.current) {
      model.current.rotation.y = THREE.MathUtils.damp(
        model.current.rotation.y,
        projectIndex * 0.8 + state.clock.elapsedTime * 0.12,
        6,
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
    <group position={[1.55, 0, 0.45]}>
      <Box position={[0, 1.25, 0]} scale={[3.5, 0.22, 1.65]} color="#b18d6c" />
      {[-1.45, 1.45].map((x) => (
        <Box
          key={x}
          position={[x, 0.55, 0]}
          scale={[0.18, 1.45, 1.35]}
          color="#806852"
        />
      ))}

      <group
        position={[0.25, 2.2, -0.18]}
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        onPointerOver={(event) => handlePointer(event, true)}
        onPointerOut={(event) => handlePointer(event, false)}
      >
        <Box position={[0, 0, 0]} scale={[1.8, 1.15, 0.16]} color="#748678" />
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[1.55, 0.88]} />
          <meshStandardMaterial
            ref={screenMaterial}
            color="#d9e2d3"
            emissive={accent}
            emissiveIntensity={1.35}
            toneMapped={false}
          />
        </mesh>
        <Box
          position={[0, -0.78, 0]}
          scale={[0.16, 0.45, 0.16]}
          color="#879589"
        />
        <Box position={[0, -1.02, 0]} scale={[0.8, 0.1, 0.5]} color="#879589" />
      </group>

      <Box
        position={[0.28, 1.48, 0.46]}
        scale={[1.45, 0.12, 0.58]}
        color="#d6d2c2"
        rotation={[-0.04, 0, 0]}
      />

      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.18}>
        <group ref={model} position={[-0.85, 1.72, 0.28]}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.3}
              roughness={0.55}
            />
          </mesh>
          <mesh position={[0, -0.31, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 0.12, 6]} />
            <meshStandardMaterial color="#eee3cc" />
          </mesh>
        </group>
      </Float>

      <group position={[1.25, 1.55, 0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.23, 0.2, 0.42, 16]} />
          <meshStandardMaterial color="#e0d4ba" roughness={0.82} />
        </mesh>
        <mesh position={[0.22, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.035, 8, 16, Math.PI * 1.65]} />
          <meshStandardMaterial color="#e0d4ba" />
        </mesh>
      </group>

      <Box
        position={[-0.45, 1.48, 0.48]}
        scale={[0.7, 0.08, 0.48]}
        color="#e5dcc8"
        rotation={[0, -0.2, 0]}
      />
    </group>
  );
}

function Bookshelf() {
  const [active, setActive] = useState(false);
  const shelf = useRef<THREE.Group>(null);
  const books = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (shelf.current) {
      shelf.current.position.z = THREE.MathUtils.damp(
        shelf.current.position.z,
        active ? 0.34 : 0,
        6,
        delta
      );
      shelf.current.rotation.y = THREE.MathUtils.damp(
        shelf.current.rotation.y,
        active ? -0.08 : 0,
        6,
        delta
      );
    }
    if (books.current) {
      books.current.position.y = THREE.MathUtils.damp(
        books.current.position.y,
        active ? Math.sin(state.clock.elapsedTime * 3.2) * 0.045 : 0,
        8,
        delta
      );
    }
  });

  const bookColors = ["#c78976", "#d3b56f", "#89a28a", "#91a5b7", "#dac79b"];
  return (
    <group
      position={[-3.25, 0, -0.25]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <group ref={shelf}>
        <Box
          position={[0, 1.75, 0]}
          scale={[1.75, 3.55, 0.78]}
          color="#a58265"
        />
        {[0.65, 1.75, 2.85].map((y) => (
          <Box
            key={y}
            position={[0, y, 0.44]}
            scale={[1.55, 0.1, 0.65]}
            color="#765d49"
          />
        ))}
        <group ref={books}>
          {Array.from({ length: 12 }, (_, index) => {
            const row = Math.floor(index / 4);
            const column = index % 4;
            return (
              <Box
                key={index}
                position={[-0.55 + column * 0.36, 0.9 + row * 1.1, 0.42]}
                scale={[0.22, 0.72 - (index % 3) * 0.07, 0.42]}
                color={bookColors[index % bookColors.length]}
                rotation={[0, 0, ((index % 3) - 1) * 0.035]}
                radius={0.03}
              />
            );
          })}
        </group>
      </group>
    </group>
  );
}

function Corkboard() {
  const [active, setActive] = useState(false);
  const board = useRef<THREE.Group>(null);
  const notes = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (board.current) {
      board.current.position.z = THREE.MathUtils.damp(
        board.current.position.z,
        active ? 0.28 : 0,
        7,
        delta
      );
    }
    if (notes.current) {
      notes.current.rotation.z = THREE.MathUtils.damp(
        notes.current.rotation.z,
        active ? Math.sin(state.clock.elapsedTime * 4) * 0.025 : 0,
        8,
        delta
      );
    }
  });

  return (
    <group
      position={[-1.2, 2.7, -3.94]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <group ref={board}>
        <Box position={[0, 0, 0]} scale={[2.5, 1.55, 0.12]} color="#c9a575" />
        <group ref={notes}>
          {[
            [-0.72, 0.25, "#eee0c4", -0.08],
            [0.05, -0.18, "#dfe7dc", 0.04],
            [0.75, 0.2, "#d8dce6", 0.09],
          ].map(([x, y, color, rotate], index) => (
            <Float
              key={index}
              speed={1 + index * 0.15}
              floatIntensity={0.035}
              rotationIntensity={0.02}
            >
              <mesh
                position={[Number(x), Number(y), 0.09]}
                rotation={[0, 0, Number(rotate)]}
              >
                <planeGeometry args={[0.62, 0.78]} />
                <meshStandardMaterial color={String(color)} roughness={0.95} />
              </mesh>
            </Float>
          ))}
        </group>
      </group>
    </group>
  );
}

function Window() {
  const [active, setActive] = useState(false);
  const moon = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (glow.current) {
      glow.current.emissiveIntensity = THREE.MathUtils.damp(
        glow.current.emissiveIntensity,
        active ? 0.7 : 0.16,
        6,
        delta
      );
    }
    if (moon.current) {
      moon.current.position.x = THREE.MathUtils.damp(
        moon.current.position.x,
        active ? 0.48 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12 : 0.48,
        4,
        delta
      );
      moon.current.position.y = THREE.MathUtils.damp(
        moon.current.position.y,
        active ? 0.4 : 0.24,
        4,
        delta
      );
    }
  });

  return (
    <group
      position={[3.15, 2.65, -3.92]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <Box position={[0, 0, 0]} scale={[2.05, 1.72, 0.14]} color="#91a18e" />
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.76, 1.44]} />
        <meshStandardMaterial
          ref={glow}
          color="#d5e0d4"
          emissive="#edf0d9"
          emissiveIntensity={0.16}
        />
      </mesh>
      <Box position={[0, 0, 0.13]} scale={[0.08, 1.5, 0.08]} color="#eee5ce" />
      <Box position={[0, 0, 0.13]} scale={[1.82, 0.08, 0.08]} color="#eee5ce" />
      <mesh ref={moon} position={[0.48, 0.24, 0.14]}>
        <circleGeometry args={[0.16, 20]} />
        <meshStandardMaterial
          color="#f5efd5"
          emissive="#f5efd5"
          emissiveIntensity={0.45}
        />
      </mesh>
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
      position={[-3.1, 0.42, 2.8]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.32, 0.65, 12]} />
        <meshStandardMaterial color="#c98f62" roughness={0.9} />
      </mesh>
      <group ref={leaves}>
        {[
          [-0.22, 0.72, 0.05, -0.45],
          [0.2, 0.82, 0, 0.4],
          [0, 1.03, -0.04, 0],
        ].map(([x, y, z, rotation], index) => (
          <mesh
            key={index}
            position={[x, y, z]}
            rotation={[0, 0, rotation]}
            castShadow
          >
            <sphereGeometry args={[0.28, 8, 6]} />
            <meshStandardMaterial color={index === 1 ? "#789878" : "#91a98b"} />
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
        active ? 7 : 0.6,
        8,
        delta
      );
    }
    if (bulb.current) {
      bulb.current.emissiveIntensity = THREE.MathUtils.damp(
        bulb.current.emissiveIntensity,
        active ? 3 : 0.35,
        8,
        delta
      );
    }
  });

  return (
    <group
      position={[3.05, 1.65, 1.05]}
      onClick={(event) => {
        event.stopPropagation();
        setActive((value) => !value);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <Box position={[0, 0, 0]} scale={[0.52, 0.08, 0.36]} color="#8b715c" />
      <Box position={[0, 0.38, 0]} scale={[0.07, 0.72, 0.07]} color="#a18367" />
      <mesh position={[0.17, 0.7, 0]} rotation={[0, 0, -0.55]}>
        <coneGeometry args={[0.29, 0.32, 16, 1, true]} />
        <meshStandardMaterial color="#d8b477" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.17, 0.62, 0]}>
        <sphereGeometry args={[0.09, 12, 8]} />
        <meshStandardMaterial
          ref={bulb}
          color="#fff4ce"
          emissive="#f7d693"
          emissiveIntensity={0.35}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={light}
        position={[0.17, 0.55, 0.32]}
        color="#f5d9a8"
        intensity={0.6}
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
}: StudioSceneProps) {
  return (
    <group>
      <Box position={[0, -0.18, 0]} scale={[8.8, 0.3, 8.2]} color="#c8b494" />
      <Box
        position={[0, 2.25, -4.05]}
        scale={[8.8, 4.8, 0.18]}
        color="#eee7d7"
      />
      <Box
        position={[-4.3, 2.25, 0]}
        scale={[0.18, 4.8, 8.2]}
        color="#e4dfcc"
      />

      <Desk
        accent={accent}
        projectIndex={projectIndex}
        active={phase === "projects"}
        onOpen={onOpenProjects}
      />
      <Bookshelf />
      <Corkboard />
      <Window />
      <Plant />
      <DeskLamp />

      <mesh position={[0.3, 4.4, 0.5]}>
        <sphereGeometry args={[0.13, 12, 8]} />
        <meshStandardMaterial
          color="#fff2cf"
          emissive="#f8dfa9"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0.3, 4.2, 0.5]}
        color="#f7dfa9"
        intensity={16}
        distance={8}
        decay={2}
        castShadow
      />
    </group>
  );
}

export function StudioScene(props: StudioSceneProps) {
  const roomIsInteractive = props.phase === "room";

  return (
    <div
      className="studio-canvas"
      aria-hidden="true"
      data-camera-phase={props.cameraPhase}
      style={{ pointerEvents: roomIsInteractive ? "auto" : "none" }}
    >
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [10.2, 7.6, 13.2], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#e8eadc"]} />
        <fog attach="fog" args={["#e8eadc", 17, 31]} />
        <hemisphereLight args={["#f5f1df", "#b6ad93", 1.3]} />
        <ambientLight intensity={1.55} color="#f5efdc" />
        <directionalLight
          position={[5, 9, 6]}
          intensity={2.6}
          color="#fff0cf"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={25}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        <SoftShadows size={18} samples={12} focus={0.4} />
        <CameraRig
          phase={props.cameraPhase}
          onDisplayReached={props.onDisplayReached}
          onRoomRestored={props.onRoomRestored}
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
          <Room {...props} />
        </PresentationControls>
      </Canvas>
    </div>
  );
}
