import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import uniqid from "uniqid";
import queryString from "query-string";
import Spotify from "spotify-web-api-js";
import { ACCESS_TOKEN_KEY, STATE_KEY } from "../../utils/constants";
import { getSpotify, getSpotifyAuthoriseUrl } from "../../utils/spotify";
import { useRouter } from "next/router";
import { timer } from "../../utils/promises";

interface AppContextProps {
  spotify?: Spotify.SpotifyWebApiJs;
  profile?: SpotifyApi.CurrentUsersProfileResponse;
  setToken: (token: string, expires: number) => void;
  authoriseUrl: string;
  userId?: string;
  loading: boolean;
  aboutOpen: boolean;
  setAboutOpen: (aboutOpen: boolean) => void;
  getUserPlaylists: (
    client: Spotify.SpotifyWebApiJs
  ) => Promise<SpotifyApi.PlaylistObjectSimplified[]>;
}

const AppContext = createContext<AppContextProps>({
  setToken: () => false,
  authoriseUrl: "",
  loading: true,
  getUserPlaylists: () => Promise.resolve([]),
  aboutOpen: false,
  setAboutOpen: () => false,
});

const AppContainer: React.FC = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [spotify, setSpotify] = useState<AppContextProps["spotify"]>(undefined);
  const [profile, setProfile] = useState<AppContextProps["profile"]>(undefined);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [authStateToken, setAuthStateToken] = useState<string>(uniqid());
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >();

  const authoriseUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? getSpotifyAuthoriseUrl(authStateToken)
        : "",
    [authStateToken]
  );
  const userId = useMemo(() => profile?.id, [profile]);

  const setToken = useCallback((token: string, expires: number) => {
    setSpotify(getSpotify(token, expires));
  }, []);

  useEffect(() => {
    if (spotify) {
      spotify.getMe().then((p) => setProfile(p));
    }
  }, [spotify]);

  useEffect(() => {
    const getPreviousToken = (): Promise<boolean> => {
      const prevToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (prevToken) {
        const [expires, token] = prevToken.split(":");

        if (
          !isNaN(parseInt(expires)) &&
          new Date().getTime() < parseInt(expires) &&
          token
        ) {
          setToken(token, parseInt(expires));
          return Promise.resolve(true);
        }
      }

      return Promise.resolve(false);
    };

    const getCurrentToken = (): Promise<boolean> => {
      if (window.location.hash) {
        const { state, access_token, expires_in } = queryString.parse(
          window.location.hash
        );

        router.replace("/");

        const prevStateToken = localStorage.getItem(STATE_KEY);

        if (state && access_token && expires_in && state === prevStateToken) {
          setToken(
            access_token.toString(),
            new Date().getTime() + parseFloat(expires_in.toString()) * 1000
          );

          return Promise.resolve(true);
        }
      }

      return Promise.resolve(false);
    };

    Promise.all([
      getCurrentToken()
        .then((loggedIn) => {
          if (!loggedIn) {
            return getPreviousToken();
          }

          return Promise.resolve(true);
        })
        .then((loggedIn) => {
          if (!loggedIn) {
            localStorage.setItem(STATE_KEY, authStateToken);
          }

          return Promise.resolve();
        }),
      timer(1000),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  const getUserPlaylists = useCallback(
    async (client: Spotify.SpotifyWebApiJs) => {
      if (playlists) {
        return playlists;
      }

      const p = await client.getUserPlaylists();
      const list = p.items.filter(
        // (i) => i.owner.id === userId && i.tracks.total > 0
        (i) => i.tracks.total > 0
      );

      setPlaylists(list);

      return list;
    },
    [playlists, userId]
  );

  return (
    <AppContext.Provider
      value={{
        loading,
        setToken,
        spotify,
        profile,
        userId,
        authoriseUrl,
        getUserPlaylists,
        aboutOpen,
        setAboutOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

export { AppContainer, useApp };
