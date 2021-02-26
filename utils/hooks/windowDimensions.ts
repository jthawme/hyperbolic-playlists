import { useEffect, useRef, useState } from "react";
import { onWindowResize } from "../utils";

export const useWindowDimensions = () => {
  const [width, setWidth] = useState<number>(-1);
  const [height, setHeight] = useState<number>(-1);
  const [bodyWidth, setBodyWidth] = useState<number>(-1);
  const [bodyHeight, setBodyHeight] = useState<number>(-1);
  const widthRef = useRef(-1);
  const heightRef = useRef(-1);

  useEffect(() => {
    const getDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setBodyWidth(document.body.clientWidth);
      setBodyHeight(document.body.clientHeight);
    };

    getDimensions();

    return onWindowResize(getDimensions);
  });

  useEffect(() => {
    widthRef.current = width;
    heightRef.current = height;
  }, [width, height]);

  return { width, height, bodyWidth, bodyHeight, widthRef, heightRef };
};
