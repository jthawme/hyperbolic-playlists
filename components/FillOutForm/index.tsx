import React, { useEffect, useState } from "react";
import classNames from "classnames";

import styles from "./FillOutForm.module.scss";
import { HyperSelect } from "../Common/Select";
import { SpotifyProps } from "../PageStates/Main";
import { Button } from "../Common/Button";
import { Hyperbole, hyperboleOptions } from "../../utils/hyperbole";
import { useApp } from "../AppContext";

interface FillOutFormProps extends Omit<SpotifyProps, "profile"> {
  name?: string;
  onSubmit: (
    term: Hyperbole,
    playlist: "saved-tracks" | "top-tracks" | string
  ) => void;
}

const FillOutForm: React.FC<FillOutFormProps> = ({
  name,
  userId,
  spotify,
  onSubmit,
}) => {
  const { getUserPlaylists } = useApp();
  const [playlists, setPlaylists] = useState([]);

  const [hyperboleTerm, setHyperboleTerm] = useState();
  const [playlistChoice, setPlaylistChoice] = useState();

  useEffect(() => {
    getUserPlaylists(spotify).then((list) => {
      setPlaylists(list);
    });
  }, []);

  return (
    <div className={styles.box}>
      <p>
        Hey {name || "exaggeration enthusiast"}!<br />
        Let's generate an overly dramatic playlist for you. Fill out the
        following:
      </p>

      <p>
        I want to generate the{" "}
        <HyperSelect
          className={styles.select}
          value={hyperboleTerm}
          onValue={setHyperboleTerm}
          items={hyperboleOptions}
          title="Playlist type"
        />{" "}
        playlist I can, using tracks from{" "}
        <HyperSelect
          className={styles.select}
          onValue={setPlaylistChoice}
          value={playlistChoice}
          title="Which playlist?"
          items={[
            { label: "my saved tracks", value: "saved-tracks" },
            // { label: "my top tracks", value: "top-tracks" },
            ...playlists.map((playlist) => ({
              label: playlist.name,
              value: playlist.id,
            })),
          ]}
        />
      </p>

      <p>
        <Button
          disabled={!hyperboleTerm || !playlistChoice}
          onClick={() => onSubmit(hyperboleTerm, playlistChoice)}
        >
          Lets go
        </Button>
      </p>
    </div>
  );
};

export { FillOutForm };
