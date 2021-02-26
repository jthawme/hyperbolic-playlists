import React from "react";
import classNames from "classnames";

import styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <h1 className={styles.title}>
      <span>Hyperbolic</span>
      <span>Playlists</span>
    </h1>
  );
};

export { Logo };
