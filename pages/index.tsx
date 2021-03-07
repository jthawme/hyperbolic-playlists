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
        <meta
          name="description"
          content="A site to help generate the most extreme versions of spotify playlists"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Staatliches&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content="Hyperbolic Playlists" />
        <meta
          property="og:description"
          content="A site to help generate the most extreme versions of spotify playlists"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://playlists.jthaw.club" />
        <meta
          property="og:image"
          content="https://playlists.jthaw.club/social.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@jthawme" />
        <meta name="twitter:title" />
        <meta property="twitter:url" content="https://playlists.jthaw.club" />
        <meta
          name="twitter:description"
          content="A site to help generate the most extreme versions of spotify playlists"
        />
        <meta
          name="twitter:image"
          content="https://playlists.jthaw.club/social.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <script
          async
          defer
          data-domain="playslists.jthaw.club"
          src="https://plausible.io/js/plausible.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() {
              (window.plausible.q = window.plausible.q || []).push(arguments)
            }`,
          }}
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
