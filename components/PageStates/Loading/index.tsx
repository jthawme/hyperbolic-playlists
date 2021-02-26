import React from "react";
import { LoaderIcon } from "../../Common/LoaderIcon";

import styles from "./LoadingPage.module.scss";

const LoadingPage = () => {
  return (
    <div className={styles.loading}>
      <LoaderIcon />
    </div>
  );
};

export { LoadingPage };
