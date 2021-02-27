import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import classNames from "classnames";
import { useApp } from "../components/AppContext";

import styles from "../styles/pages/Home.module.scss";
import { LoginPage } from "../components/PageStates/Login";
import { Footer } from "../components/Footer";
import { Logo } from "../components/Common/Logo";
import { LoadingPage } from "../components/PageStates/Loading";
import { MainPage } from "../components/PageStates/Main";
import { AboutOverlay } from "../components/AboutOverlay";

export default function Home() {
  const {
    loading,
    spotify,
    profile,
    userId,
    setAboutOpen,
    aboutOpen,
  } = useApp();

  const [transition, setTransition] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    });
  }, []);

  return (
    <div
      className={classNames(styles.container, {
        transition,
      })}
    >
      <Head>
        <title>Hyperbolic Playlists</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Staatliches&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Logo />

      <button
        className={classNames(styles.aboutLink, {
          [styles.show]: !loading && profile,
        })}
        onClick={() => setAboutOpen(!aboutOpen)}
      >
        About
      </button>

      {loading && <LoadingPage />}
      {!loading && !spotify && <LoginPage />}
      {!loading && profile && (
        <MainPage spotify={spotify} profile={profile} userId={userId} />
      )}

      <AboutOverlay />

      <Footer />
    </div>
  );
}
