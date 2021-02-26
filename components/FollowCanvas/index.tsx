import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useWindowDimensions } from "../../utils/hooks/windowDimensions";
import { mapRange } from "../../utils/utils";

import styles from "./FollowCanvas.module.scss";

const resizeCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const dpr = window.devicePixelRatio;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.getContext("2d").scale(dpr, dpr);
};

const getAngle = (x1, y1, x2, y2) => {
  return Math.atan2(x2 - x1, y2 - y1);
};

const FollowCanvas = () => {
  const mousePos = useRef<{ x: Number; y: Number }>({ x: -1, y: -1 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(-1);

  const { width, height, widthRef, heightRef } = useWindowDimensions();

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    document.addEventListener("mousemove", cb, { passive: true });

    return () => {
      document.removeEventListener("mousemove", cb);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const onRef = useCallback(
    (ref: HTMLCanvasElement | null) => {
      canvasRef.current = ref;
      if (ref) {
        const ctx = ref.getContext("2d");
        resizeCanvas(ref, width, height);

        const OUTER_SIZE = 100;
        const SIZE = OUTER_SIZE * 0.2;

        const update = () => {
          ctx.clearRect(0, 0, widthRef.current, heightRef.current);
          const cols = Math.ceil(widthRef.current / OUTER_SIZE);
          const rows = Math.ceil(heightRef.current / OUTER_SIZE);

          const overX = widthRef.current / OUTER_SIZE - cols;
          const overY = heightRef.current / OUTER_SIZE - rows;

          ctx.save();
          ctx.translate((overX * OUTER_SIZE) / 2, (overY * OUTER_SIZE) / 2);

          for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
              ctx.save();
              const cx = x * OUTER_SIZE + OUTER_SIZE / 2;
              const cy = y * OUTER_SIZE + OUTER_SIZE / 2;
              ctx.translate(cx, cy);

              const rotate = mapRange(
                getAngle(
                  cx - SIZE,
                  cy - SIZE,
                  mousePos.current.x,
                  mousePos.current.y
                ),
                -Math.PI,
                Math.PI,
                1,
                0
              );

              ctx.rotate(rotate * (Math.PI * 2) + Math.PI);

              ctx.translate(-(SIZE / 2), -(SIZE / 2));
              ctx.drawImage(img, 0, 0, SIZE, SIZE);

              ctx.restore();
            }
          }

          ctx.restore();

          frameRef.current = requestAnimationFrame(update);
        };

        const img = new Image();
        img.src = "/assets/smile.svg";
        img.onload = () => {
          frameRef.current = requestAnimationFrame(update);
        };
      }
    },
    [width, height]
  );

  useEffect(() => {
    if (canvasRef.current) {
      resizeCanvas(canvasRef.current, width, height);
    }
  }, [width, height]);

  return <canvas className={styles.canvas} ref={onRef} />;
};

export { FollowCanvas };
