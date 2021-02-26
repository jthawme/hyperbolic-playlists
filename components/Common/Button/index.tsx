import React from "react";
import classNames from "classnames";
import { InternalExternalLink } from "../InternalExternalLink";

import styles from "./Button.module.scss";
import { Icon, IconList } from "../Icon";

interface ButtonProps extends React.HTMLAttributes<HTMLSpanElement> {
  to?: string;
  icon?: IconList;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  to,
  children,
  className,
  icon,
  disabled,
  onClick,
  ...props
}) => {
  const inner = (
    <span className={styles.inner}>
      {icon && <Icon className={styles.icon} name={icon} />}
      <span>{children}</span>
    </span>
  );

  const cls = classNames(
    styles.button,
    { [styles.withIcon]: !!icon, [styles.disabled]: disabled },
    className
  );

  if (to && !disabled) {
    return (
      <InternalExternalLink className={cls} to={to} {...props}>
        {inner}
      </InternalExternalLink>
    );
  }

  if (onClick) {
    return (
      <button className={cls} onClick={onClick} disabled={disabled} {...props}>
        {inner}
      </button>
    );
  }

  return (
    <span className={cls} {...props}>
      {inner}
    </span>
  );
};

export { Button };
