import React, { useState } from "react";
import classNames from "classnames";

import styles from "./ImageLoad.module.scss";

interface ImageLoadProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  ratio?: number;
  className?: string;
  alt?: string;
}

const ImageLoad: React.FC<ImageLoadProps> = ({
  src,
  ratio = 1,
  className,
  alt = "",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <span
      className={classNames(
        styles.wrapper,
        { [styles.loaded]: loaded },
        className
      )}
      style={{ "--ratio": ratio } as React.CSSProperties}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </span>
  );
};

export { ImageLoad };
