import Spotify from "spotify-web-api-js";
import queryString from "query-string";
import { ACCESS_TOKEN_KEY } from "./constants";

export const getSpotify = (token, expires) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, `${expires}:${token}`);

  const s = new Spotify();
  s.setAccessToken(token);

  return s;
};

const getRedirectURI = () => {
  return `${
    window.location.hostname.includes("localhost")
      ? `http://localhost:3000`
      : window.location.origin
  }/`;
};

export const getSpotifyAuthoriseUrl = (stateToken: string) => {
  const baseURL = "https://accounts.spotify.com/authorize";

  return queryString.stringifyUrl({
    url: baseURL,
    query: {
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      response_type: "token",
      scope: "user-library-read,playlist-modify-public,ugc-image-upload",
      redirect_uri: getRedirectURI(),
      state: stateToken,
    },
  });
};
