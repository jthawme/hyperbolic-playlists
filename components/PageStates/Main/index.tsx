import React, { useCallback, useEffect, useMemo, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "../../Common/Button";
import { LoaderIcon } from "../../Common/LoaderIcon";
import { SongRow } from "../../Common/SongRow";
import { FillOutForm } from "../../FillOutForm";

import styles from "./MainPage.module.scss";
import { ExpandedItem, TargetItem } from "./types";
import {
  getPlaylistItems,
  filterTracks,
  getTrackDetails,
  createAndFillPlaylist,
} from "./spotifyActions";
// import { PlaylistImageTester } from "../../Common/PlaylistImageTester";
import {
  extremeStat,
  getTitle,
  isTheExtremeStat,
} from "../../../utils/hyperbole";
import { fireEvent } from "../../../utils/analytics";
import { switchVariants } from "./animation";

export interface SpotifyProps {
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  profile: SpotifyApi.CurrentUsersProfileResponse;
  userId: string;
}

// interface MainPageProps {
//   spotify: SpotifyWebApi.SpotifyWebApiJs;
//   profile: SpotifyApi.CurrentUsersProfileResponse;
//   userId: string;
// }

const memoized = {};

const MainPage: React.FC<SpotifyProps> = ({ profile, spotify, userId }) => {
  const [target, setTarget] = useState<TargetItem>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [items, setItems] = useState<ExpandedItem[]>([]);

  const [loadingInfo, setLoadingInfo] = useState<
    { label: string; percentage: number } | false
  >(false);

  const headerTitle = useMemo(() => {
    if (!target) {
      return "";
    }

    return getTitle(target.term);
  }, [target]);

  useEffect(() => {
    if (target) {
      fireEvent("target", target);

      if (memoized[`${target.playlist}-${target.term}`]) {
        setItems(memoized[`${target.playlist}-${target.term}`]);
        return;
      }

      setLoading(true);
      setItems([]);
      getPlaylistItems(spotify, target.playlist, (current, total, clipped) => {
        const act = clipped ? 1500 : total;

        setLoadingInfo({
          percentage: current / act / 2,
          label: `Fetching ${current}/${act} tracks${
            clipped ? " (maximum 1500)" : ""
          }`,
        });
      })
        .then((items) =>
          getTrackDetails(spotify, items, (current, total) => {
            setLoadingInfo({
              percentage: current / total / 2 + 0.5,
              label: `Analysing ${current}/${total} tracks`,
            });
          })
        )
        .then((full) => filterTracks(full, target.term))
        .then((items) => {
          setItems(items);
          memoized[`${target.playlist}-${target.term}`] = items;
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setItems([]);
    }
  }, [target]);

  const duration = useMemo(() => {
    return Math.ceil(
      items.reduce((prev, curr) => (prev += curr.duration_ms), 0) / 1000 / 60
    );
  }, [items]);

  const most = useMemo(() => {
    if (!target) {
      return;
    }

    return extremeStat(target.term, items);
  }, [items, target]);

  const isMost = useCallback(
    (item: ExpandedItem) => {
      return isTheExtremeStat(target.term, item, most);
    },
    [most, target]
  );

  const savePlaylist = useCallback(() => {
    if (!target || items.length === 0) {
      return;
    }

    fireEvent("save");

    setLoadingInfo(false);
    setLoading(true);
    setSaving(true);

    createAndFillPlaylist(spotify, userId, items, headerTitle).then(() => {
      setLoading(false);
      setSaving(false);
    });

    // spotify.createPlaylist
  }, [spotify, items, userId, target, headerTitle]);

  return (
    <>
      {loading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.loading}>
            <LoaderIcon />
          </div>

          {loadingInfo && (
            <>
              <div className={styles.loadingBar}>
                <div
                  className={styles.loadingBarTrack}
                  style={
                    {
                      "--percentage": loadingInfo.percentage,
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className={styles.loadingMessage}>{loadingInfo.label}</div>
            </>
          )}
        </div>
      )}
      <AnimatePresence>
        {target && items.length === 0 && !loading && (
          <motion.main
            variants={switchVariants}
            key="emptyplaylist"
            animate="in"
            exit="out"
            initial="initial"
            className={classNames(styles.main, { [styles.saving]: saving })}
          >
            <header className={styles.header}>
              <h2>Hmm, an empty feeling</h2>
              <div className={styles.info}>
                <div className={styles.left}>
                  <p>
                    Either this playlist is empty, or there is actually no
                    tracks in it that match the criteria. Congrats?
                  </p>
                </div>
              </div>
            </header>

            <div className={styles.emptyWrapper}>
              <div className={styles.empty}>
                <h4>Try changing the playlist or the filter</h4>
                <Button
                  className={styles.menuBtn}
                  icon="refresh"
                  onClick={() => setTarget(undefined)}
                  disabled={saving}
                >
                  Create another
                </Button>
              </div>
            </div>
          </motion.main>
        )}
        {target && items.length > 0 && (
          <motion.main
            variants={switchVariants}
            animate="in"
            exit="out"
            initial="initial"
            key="fullplaylist"
            className={classNames(styles.main, { [styles.saving]: saving })}
          >
            <header className={styles.header}>
              <h2>{headerTitle}</h2>
              <div className={styles.info}>
                <div className={styles.left}>
                  <p>
                    According to Spotify, these are the songs for what you are
                    after.
                  </p>
                </div>

                <div className={styles.right}>
                  <p>
                    {items.length} tracks / {duration} minutes
                  </p>
                </div>
              </div>
            </header>

            <div className={styles.menuWrapper}>
              <div className={styles.menu}>
                <h4>Actions</h4>
                <Button
                  className={styles.menuBtn}
                  icon="refresh"
                  onClick={() => setTarget(undefined)}
                  disabled={saving}
                >
                  Create another
                </Button>
                <Button
                  className={styles.menuBtn}
                  icon="save"
                  onClick={savePlaylist}
                  disabled={saving}
                >
                  {" "}
                  Save this playlist
                </Button>
              </div>
            </div>
            <div className={styles.list}>
              {items.map((item) => (
                <SongRow
                  key={item.id}
                  term={target.term}
                  most={isMost(item)}
                  {...item}
                />
              ))}
            </div>
          </motion.main>
        )}
        {!target && (
          <FillOutForm
            name={profile.display_name}
            spotify={spotify}
            userId={userId}
            onSubmit={(term, playlist) => setTarget({ term, playlist })}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export { MainPage };
