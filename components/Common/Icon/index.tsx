import React from "react";
import classNames from "classnames";

import styles from "./Icon.module.scss";

import { ReactComponent as Pause } from "../../../assets/icons/pause.svg";
import { ReactComponent as Play } from "../../../assets/icons/play.svg";
import { ReactComponent as Refresh } from "../../../assets/icons/refresh.svg";
import { ReactComponent as Save } from "../../../assets/icons/save.svg";
import { ReactComponent as Star } from "../../../assets/icons/star.svg";

const icons = {
  pause: <Pause />,
  play: <Play />,
  refresh: <Refresh />,
  save: <Save />,
  star: <Star />,
};

export type IconList = keyof typeof icons;

interface IconProps {
  name: IconList;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ className, name }) => {
  return (
    <span className={classNames(styles.icon, className)}>{icons[name]}</span>
  );
};

export { Icon };
