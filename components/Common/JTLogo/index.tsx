import React, { useRef, useEffect, useCallback } from "react";

import { generate } from "./LogoGenerate";

interface JTLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const JTLogo: React.FC<JTLogoProps> = ({
  width = 128,
  height = 128,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number>(-1);

  const regen = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");

    generate(canvasRef.current, ctx, width, height, width / 28, color);

    const img = canvasRef.current.toDataURL("image/png", 0.5);
    const link = document.querySelector<HTMLLinkElement | null>(
      "link[rel~='icon']"
    );

    if (link) {
      link.href = img;
    }
  }, [width, height, color]);

  useEffect(() => {
    regen();
  }, [regen]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const timedRegen = () => {
    clearTimeout(timerRef.current);

    regen();

    timerRef.current = window.setTimeout(() => {
      timedRegen();
    }, 250);
  };

  const clearRegen = () => {
    clearTimeout(timerRef.current);
  };

  const style = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <canvas
      style={style}
      onMouseOver={timedRegen}
      onMouseLeave={clearRegen}
      onClick={clearRegen}
      ref={canvasRef}
    />
  );
};

export default JTLogo;
