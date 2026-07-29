import { SolidBox } from "./ScenePrimitives";

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
 * 各段を独立した箱として置くのではなく、開始高さ・終了高さ・段数から
 * それぞれの段の高さと奥行きを計算して組み立てる。
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
    <group position={position}>
      {Array.from({ length: stepCount }, (_, index) => {
        const stepTop = fromY + rise * (index + 1);
        const height = stepTop - fromY;

        return (
          <SolidBox
            key={index}
            position={[0, fromY + height / 2, depthOffset - index * treadDepth]}
            scale={[width, height, treadDepth]}
            color="#d7c2a2"
          />
        );
      })}
    </group>
  );
}
