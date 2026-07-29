import { RoundedBox } from "@react-three/drei";

type BoxProps = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  radius?: number;
};

/**
 * 角丸の直方体。
 *
 * 家具やマットなど、少し柔らかい見た目にしたいオブジェクトで使う。
 * マテリアル設定はシーン全体の質感を揃えるため、このコンポーネント内に集約する。
 */
export function Box({
  position,
  scale,
  color,
  rotation,
  radius = 0.06,
}: BoxProps) {
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

/**
 * 角丸を使わない直方体。
 *
 * 壁や階段など、輪郭を直線的に保ちたいオブジェクトで使う。
 */
export function SolidBox({ position, scale, color, rotation }: BoxProps) {
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.93} metalness={0.01} />
    </mesh>
  );
}
