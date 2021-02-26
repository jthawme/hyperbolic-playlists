import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import styles from "./PreviewPlayer.module.scss";
import { Icon } from "../Icon";

interface PreviewPlayerProps {
  src: string;
  className?: string;
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ src, className }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const togglePlaying = useCallback(() => {
    if (!playing) {
      [
        ...document.querySelectorAll(`.${styles.player} audio`),
      ].forEach((p: HTMLAudioElement) => p.pause());
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      const target = e.target as HTMLAudioElement;

      setPercentage(target.currentTime / target.duration);
    },
    []
  );

  return (
    <div
      className={classNames(
        styles.player,
        { [styles.playing]: playing },
        className
      )}
    >
      <audio
        src={src}
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <div className={styles.content}>
        <button className={styles.btn} onClick={togglePlaying}>
          <Icon name={playing ? "pause" : "play"} />
        </button>
        <div
          className={styles.bar}
          style={{ "--preview-percentage": percentage } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export { PreviewPlayer };
