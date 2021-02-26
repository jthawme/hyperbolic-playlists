import { Hyperbole } from "../../../utils/hyperbole";

export type TargetItem = {
  term: Hyperbole;
  playlist: "saved-tracks" | "top-tracks" | string;
};

export interface ExpandedItem extends SpotifyApi.TrackObjectFull {
  features: SpotifyApi.AudioFeaturesObject;
}
