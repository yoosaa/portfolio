type LevelStairsProps = {
  position: [number, number, number];
  fromY: number;
  toY: number;
  stepCount: number;
  width?: number;
  treadDepth?: number;
};

/**
 * 2つの高さをつなぐ階段。
 *
 * 開始高さ・終了高さ・段数から、均一な高さの段と上段床への橋を組み立てる。
 */
export function LevelStairs({
  position,
  fromY,
  toY,
  stepCount,
  width = 1.18,
  treadDepth = 0.38,
}: LevelStairsProps) {
  const rise = (toY - fromY) / stepCount;
  const depthOffset = ((stepCount - 1) * treadDepth) / 2;

  return (
    <group name="studio-uniform-stairs" position={position}>
      {Array.from({ length: stepCount }, (_, index) => {
        return (
          <mesh
            key={index}
            position={[
              0,
              fromY + rise * (index + 0.5),
              depthOffset - index * treadDepth,
            ]}
            scale={[width, rise, treadDepth]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#d7c2a2" roughness={0.93} />
          </mesh>
        );
      })}
      <mesh
        position={[0, toY - 0.03, -0.63]}
        scale={[width, 0.06, 0.34]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d7c2a2" roughness={0.93} />
      </mesh>
    </group>
  );
}
