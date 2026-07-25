import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useLayoutEffect, useRef } from "react";

type CanvasResizeSyncProps = {
  viewRef: RefObject<HTMLDivElement | null>;
};

export function CanvasResizeSync({ viewRef }: CanvasResizeSyncProps) {
  const setSize = useThree((state) => state.setSize);
  const pendingSize = useRef<{
    width: number;
    height: number;
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    const measureSize = () => {
      const rect = view.getBoundingClientRect();

      // ResizeObserver 内では更新せず、次の描画フレーム用に記録する。
      pendingSize.current = {
        width: view.clientWidth,
        height: view.clientHeight,
        top: rect.top + view.clientTop,
        left: rect.left + view.clientLeft,
      };
    };

    const observer = new ResizeObserver(measureSize);
    observer.observe(view);
    measureSize();

    return () => observer.disconnect();
  }, [viewRef]);

  // priority -1: 通常のシーン描画より前に実行する。
  useFrame(() => {
    const nextSize = pendingSize.current;
    if (!nextSize) {
      return;
    }

    pendingSize.current = null;
    setSize(nextSize.width, nextSize.height, nextSize.top, nextSize.left);
  }, -1);

  return null;
}
