import React, { useMemo } from "react";
import classNames from "classnames";
import { useInView } from "react-intersection-observer";

import { ExpandedItem } from "../../PageStates/Main/types";
import styles from "./SongRow.module.scss";
import { PreviewPlayer } from "../PreviewPlayer";
import { Icon } from "../Icon";
import { getStat, Hyperbole } from "../../../utils/hyperbole";
import { ImageLoad } from "../ImageLoad";

interface SongRowProps extends ExpandedItem {
  className?: string;
  term: Hyperbole;
  most?: boolean;
}

const SongRow: React.FC<SongRowProps> = ({
  className,
  artists,
  name,
  album,
  features,
  preview_url,
  term,
  most,
}) => {
  const { ref, inView } = useInView({
    rootMargin: "100px",
  });

  const stat = useMemo(() => {
    return getStat(term, features);
  }, [term, features]);

  return (
    <div
      ref={ref}
      className={classNames(
        styles.row,
        { [styles.visible]: inView },
        className
      )}
    >
      <div className={styles.image}>
        {inView && (
          <ImageLoad
            className="album-artwork"
            crossOrigin="anonymous"
            src={album.images[0].url}
          />
        )}
        {preview_url && <PreviewPlayer src={preview_url} />}
      </div>
      <div className={styles.info}>
        <div className={styles.title}>
          {name} {most && <Icon className={styles.icon} name="star" />}
        </div>
        <div className={styles.artist}>
          {album.name} – {artists.map((a) => a.name).join(", ")}
        </div>
        <div className={styles.stat}>{stat}</div>
      </div>
    </div>
  );
};

export { SongRow };
