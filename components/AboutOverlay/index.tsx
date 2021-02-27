import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import styles from "./AboutOverlay.module.scss";
import { useApp } from "../AppContext";
import { clickOutside } from "../../utils/utils";

interface AboutOverlayProps {}

const AboutOverlay: React.FC<AboutOverlayProps> = () => {
  const { aboutOpen, setAboutOpen } = useApp();

  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aboutOpen) {
      return clickOutside(aboutRef.current, () => {
        setAboutOpen(true);
      });
    }
  }, [aboutOpen]);

  return (
    <section
      ref={aboutRef}
      className={classNames(styles.about, { [styles.open]: aboutOpen })}
      aria-hidden={!aboutOpen}
    >
      <button onClick={() => setAboutOpen(false)} className={styles.close}>
        Close
      </button>

      <div className={styles.content}>
        <p className={styles.large}>
          A project to help you vibe with how you are feeling, from the stuff
          you're already working with.
        </p>
        <p>
          Using Spotify's machine learning assisted statistics on songs, the
          project filter's out the songs down to match whatever exaggerated
          state you are looking for.
        </p>
        <h5>Privacy</h5>
        <p>
          The site has access (after permission) to your Spotify account
          temporarily (1 hour), with the ability to read your library and create
          playlists <u>only</u>. No data is saved by the website ever.
        </p>
      </div>
      <footer>
        Get more work like this to your inbox from{" "}
        <a
          href="https://jthaw.me/newsletter"
          target="_blank"
          rel="noopener noreferrer"
        >
          my newsletter
        </a>
      </footer>
    </section>
  );
};

export { AboutOverlay };
