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
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type StudioSceneProps = {
  isProjects: boolean;
  accent: string;
  projectIndex: number;
  onOpenProjects: () => void;
};

function CameraRig({ isProjects }: { isProjects: boolean }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    target.set(
      isProjects ? 4.45 : 10.2,
      isProjects ? 3.7 : 7.6,
      isProjects ? 7.1 : 13.2
    );
    lookAt.set(
      isProjects ? 1.6 : 0,
      isProjects ? 1.55 : 1.35,
      isProjects ? 0.3 : 0
    );
    camera.position.lerp(target, 1 - Math.exp(-delta * 3.2));
    camera.lookAt(lookAt);
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
            <meshStandardMaterial color="#c8a77f" />
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
        color="#eee3cc"
        rotation={[0, -0.2, 0]}
      />
    </group>
  );
}

function Bookshelf() {
  const bookColors = ["#b77966", "#c6a66f", "#7e9a86", "#8296a1", "#d2b992"];
  return (
    <group position={[-3.25, 0, -0.25]}>
      <Box position={[0, 1.75, 0]} scale={[1.75, 3.55, 0.78]} color="#a58265" />
      {[0.65, 1.75, 2.85].map((y) => (
        <Box
          key={y}
          position={[0, y, 0.44]}
          scale={[1.55, 0.1, 0.65]}
          color="#765d49"
        />
      ))}
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
  );
}

function Corkboard() {
  return (
    <group position={[-1.2, 2.7, -3.94]}>
      <Box position={[0, 0, 0]} scale={[2.5, 1.55, 0.12]} color="#c39b6e" />
      {[
        [-0.72, 0.25, "#f6eedc", -0.08],
        [0.05, -0.18, "#e2eadc", 0.04],
        [0.75, 0.2, "#e3e5de", 0.09],
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
  );
}

function Window() {
  return (
    <group position={[3.15, 2.65, -3.92]}>
      <Box position={[0, 0, 0]} scale={[2.05, 1.72, 0.14]} color="#91a18e" />
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.76, 1.44]} />
        <meshStandardMaterial
          color="#d5e0d4"
          emissive="#edf0d9"
          emissiveIntensity={0.28}
        />
      </mesh>
      <Box position={[0, 0, 0.13]} scale={[0.08, 1.5, 0.08]} color="#f0e7d4" />
      <Box position={[0, 0, 0.13]} scale={[1.82, 0.08, 0.08]} color="#f0e7d4" />
    </group>
  );
}

function Plant() {
  return (
    <group position={[-3.1, 0.42, 2.8]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.32, 0.65, 12]} />
        <meshStandardMaterial color="#c58b68" roughness={0.9} />
      </mesh>
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
          <meshStandardMaterial color={index === 1 ? "#76917a" : "#8aa087"} />
        </mesh>
      ))}
    </group>
  );
}

function Room({
  isProjects,
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
        active={isProjects}
        onOpen={onOpenProjects}
      />
      <Bookshelf />
      <Corkboard />
      <Window />
      <Plant />

      <mesh position={[0.3, 4.4, 0.5]}>
        <sphereGeometry args={[0.13, 12, 8]} />
        <meshStandardMaterial
          color="#f3dba9"
          emissive="#f7dfad"
          emissiveIntensity={1.3}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0.3, 4.2, 0.5]}
        color="#f3dcb2"
        intensity={13}
        distance={8}
        decay={2}
        castShadow
      />
    </group>
  );
}

export function StudioScene(props: StudioSceneProps) {
  return (
    <div className="studio-canvas" aria-hidden="true">
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
        <CameraRig isProjects={props.isProjects} />
        <PresentationControls
          global
          enabled={!props.isProjects}
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
