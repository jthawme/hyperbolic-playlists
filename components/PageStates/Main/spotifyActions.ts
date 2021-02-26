import SpotifyWebApi from "spotify-web-api-js";
import { filterTrackStat, Hyperbole } from "../../../utils/hyperbole";
import { chunk } from "../../../utils/utils";
import { ExpandedItem } from "./types";

export const getPlaylistItems = (
  spotify: SpotifyWebApi.SpotifyWebApiJs,
  playlist: "saved-tracks" | "top-tracks" | string,
  onProgress: (current: number, total: number, clipped: boolean) => void
): Promise<
  SpotifyApi.SavedTrackObject[] | SpotifyApi.PlaylistTrackObject[]
> => {
  return new Promise((resolve, reject) => {
    const MAX = 1500;
    const items = [];

    const limit = playlist === "saved-tracks" ? 50 : 100;

    const getItems = (offset = 0) => {
      const func = (): Promise<
        SpotifyApi.UsersSavedTracksResponse | SpotifyApi.PlaylistTrackResponse
      > => {
        if (playlist === "saved-tracks") {
          return spotify.getMySavedTracks({
            limit,
            offset,
          });
        }

        return spotify.getPlaylistTracks(playlist, {
          offset,
          limit,
        });
      };

      func()
        .then((res) => {
          items.push(...res.items);

          onProgress(items.length, res.total, res.total > MAX);

          if (
            res.offset + limit + res.offset > res.total ||
            items.length > MAX
          ) {
            resolve(items);
          } else {
            getItems(offset + limit);
          }
        })
        .catch((e) => reject(e));
    };

    getItems();
  });
};

export const getTrackDetails = async (
  spotify: SpotifyWebApi.SpotifyWebApiJs,
  items: SpotifyApi.SavedTrackObject[] | SpotifyApi.PlaylistTrackObject[],
  onProgress: (current: number, total: number) => void
) => {
  const details = [];

  for (let i = 0; i < Math.ceil(items.length / 100); i++) {
    const tracks = [...items.slice(i * 100, (i + 1) * 100)].map((i) => i.track);

    const features = await spotify
      .getAudioFeaturesForTracks(tracks.map((t) => t.id))
      .then((items) => items.audio_features);

    onProgress(i * 100, items.length);

    details.push(
      ...tracks.map((t, i) => ({
        ...t,
        features: features[i],
      }))
    );
  }

  return details;
};

export const filterTracks = (items: ExpandedItem[], term: Hyperbole) => {
  return items.filter((item) => filterTrackStat(term, item));
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  w: number,
  rowHeight: number
) => {
  let _w = 0;
  let row = 0;

  const pos = [];

  text.split(" ").forEach((word) => {
    let nextW = _w + ctx.measureText(`${word} `).width;

    if (nextW > w) {
      nextW = ctx.measureText(`${word} `).width;
      row++;
      pos.push({ x: 0, y: row * rowHeight, word });
    } else {
      pos.push({ x: _w, y: row * rowHeight, word });
    }

    _w = nextW;
  });

  ctx.save();
  ctx.translate(x, y - rowHeight * (row + 0.85));

  pos.forEach((pos) => {
    ctx.fillText(pos.word, pos.x, pos.y);
  });
  ctx.restore();
};

export const createCoverImage = (
  title: string,
  _canvas?: HTMLCanvasElement
) => {
  const canvas = _canvas || document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 512;
  const height = 512;

  const w = (perc: number) => perc * width;
  const h = (perc: number) => perc * height;

  canvas.width = 512;
  canvas.height = 512;
  ctx.fillStyle = "#f6be60";
  ctx.fillRect(0, 0, w(1), h(1));

  ctx.globalAlpha = 0.75;
  const images = [
    ...document.querySelectorAll(".album-artwork img"),
  ] as HTMLImageElement[];

  const cols = 2;
  const rows = 2;
  const tw = width / cols;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const i = y * cols + x;
      if (images[i]) {
        ctx.drawImage(images[i], x * tw, y * tw, tw, tw);
      }
    }
  }
  ctx.globalAlpha = 1;

  const fontSize = Math.round(w(0.05));
  const largeFontSize =
    title.split(" ").length > 6 ? Math.round(w(0.14)) : Math.round(w(0.2));

  ctx.fillStyle = "#1d1d1b";
  ctx.textBaseline = "top";
  ctx.font = `${fontSize}px "Staatliches"`;
  ctx.fillText("Hyperbolic", w(0.05), h(0.05));
  ctx.fillText("Playlists", w(0.05), h(0.05) + fontSize * 0.95);

  ctx.font = `${largeFontSize}px "Staatliches"`;
  wrapText(ctx, title, w(0.05), h(0.95), w(0.9), largeFontSize);

  return canvas.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", "");
};

export const createAndFillPlaylist = (
  spotify: SpotifyWebApi.SpotifyWebApiJs,
  userId: string,
  items: ExpandedItem[],
  title: string
): Promise<boolean> => {
  return spotify
    .createPlaylist(userId, {
      name: `${title} – Hyperbolic Playlist`,
    })
    .then(async (playlist) => {
      const uris = chunk(
        items.map((i) => i.uri),
        100
      );

      for (let i = 0; i < uris.length; i++) {
        await spotify.addTracksToPlaylist(playlist.id, uris[i]);
      }

      return playlist.id;
    })
    .then((id) => {
      return spotify
        .uploadCustomPlaylistCoverImage(id, createCoverImage(title))
        .then(() => true);
    })
    .catch((e) => {
      console.log("err making playlist", e);
      return false;
    });
};
