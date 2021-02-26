import React, { useCallback, useEffect, useRef } from "react";
import { createCoverImage } from "../../PageStates/Main/spotifyActions";

const PlaylistImageTester: React.FC<{ title: string }> = ({ title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    createCoverImage(title, canvasRef.current);
  }, [title]);
  return <canvas ref={canvasRef} />;
};

export { PlaylistImageTester };
