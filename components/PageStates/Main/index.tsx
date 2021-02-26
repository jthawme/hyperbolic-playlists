import React, { useCallback, useEffect, useMemo, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import classNames from "classnames";

import { Button } from "../../Common/Button";
import { LoaderIcon } from "../../Common/LoaderIcon";
import { SongRow } from "../../Common/SongRow";
import { FillOutForm, Hyperbole } from "../../FillOutForm";

import styles from "./MainPage.module.scss";
import { ExpandedItem, TargetItem } from "./types";
import {
  getPlaylistItems,
  filterTracks,
  getTrackDetails,
  createAndFillPlaylist,
} from "./spotifyActions";
import { PlaylistImageTester } from "../../Common/PlaylistImageTester";
import {
  extremeStat,
  getTitle,
  isTheExtremeStat,
} from "../../../utils/hyperbole";

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

  const headerTitle = useMemo(() => {
    if (!target) {
      return "";
    }

    return getTitle(target.term);
  }, [target]);

  useEffect(() => {
    if (target) {
      if (memoized[`${target.playlist}-${target.term}`]) {
        setItems(memoized[`${target.playlist}-${target.term}`]);
        return;
      }

      setLoading(true);
      setItems([]);
      getPlaylistItems(spotify, target.playlist)
        .then((items) => getTrackDetails(spotify, items))
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

    setLoading(true);
    setSaving(true);

    createAndFillPlaylist(spotify, userId, items, headerTitle).then(() => {
      setLoading(false);
      setSaving(false);
    });

    // spotify.createPlaylist
  }, [spotify, items, userId, target, headerTitle]);

  return (
    <main className={classNames(styles.main, { [styles.saving]: saving })}>
      {loading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.loading}>
            <LoaderIcon />
          </div>
        </div>
      )}
      {target && items.length > 0 && (
        <>
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
                icon="refresh"
                onClick={() => setTarget(undefined)}
                disabled={saving}
              >
                Create another
              </Button>
              <Button icon="save" onClick={savePlaylist} disabled={saving}>
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
        </>
      )}
      {!target && (
        <FillOutForm
          name={profile.display_name}
          spotify={spotify}
          userId={userId}
          onSubmit={(term, playlist) => setTarget({ term, playlist })}
        />
      )}
    </main>
  );
};

export { MainPage };
