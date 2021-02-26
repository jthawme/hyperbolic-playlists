import React from "react";
import { ReactComponent as LoaderSvg } from "../../../public/assets/loader.svg";
import styles from "./LoaderIcon.module.scss";

const LoaderIcon = () => {
  return <LoaderSvg className={styles.svg} />;
};

export { LoaderIcon };
