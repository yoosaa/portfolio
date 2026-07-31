import { Box } from "./ScenePrimitives";
import { LOWER_MAT_TOP } from "./scene-levels";

export function FloorBookStack() {
  return (
    <group
      position={[2.16, LOWER_MAT_TOP + 0.06, 2.5]}
      rotation={[0, -0.16, 0]}
    >
      <Box
        position={[0, 0, 0]}
        scale={[0.78, 0.12, 0.5]}
        color="#8d9c87"
        radius={0.025}
      />
      <Box
        position={[0.04, 0.11, 0]}
        scale={[0.7, 0.1, 0.46]}
        rotation={[0, 0.18, 0]}
        color="#d2b26f"
        radius={0.022}
      />
      <Box
        position={[-0.02, 0.205, 0]}
        scale={[0.62, 0.09, 0.42]}
        rotation={[0, -0.12, 0]}
        color="#b97868"
        radius={0.02}
      />
    </group>
  );
}
