import React from "react";
import classNames from "classnames";
import styles from "./Footer.module.scss";
import JTLogo from "../Common/JTLogo";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={classNames(styles.footer, className)}>
      <div className={styles.right}>
        <a target="_blank" className={styles.attr} href="https://jthaw.me">
          <span>Made by</span>
          <JTLogo width={48} height={48} color="#1d1d1b" />
        </a>
      </div>
    </footer>
  );
};

export { Footer };
