import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { useApp } from "../../AppContext";
import { Button } from "../../Common/Button";
import { Logo } from "../../Common/Logo";
import { FollowCanvas } from "../../FollowCanvas";

import styles from "./Login.module.scss";

const LoginPage: React.FC = () => {
  const { authoriseUrl, setAboutOpen } = useApp();
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisplay(true);
      });
    });
  }, []);

  return (
    <section className={classNames(styles.page, { [styles.display]: display })}>
      <FollowCanvas />

      <div className={styles.box}>
        <Button to={authoriseUrl}>Login with spotify</Button>

        <button onClick={() => setAboutOpen(true)} className={styles.btn}>
          What is this?
        </button>
      </div>
    </section>
  );
};

export { LoginPage };
