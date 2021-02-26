import { ExpandedItem } from "../components/PageStates/Main/types";
import { clamp, mapRange } from "./utils";

export enum Hyperbole {
  Happiest = "happiest",
  Saddest = "saddest",
  Danciest = "danciest",
  Most_Energetic = "most-energetic",
  Most_Upbeat = "most-upbeat",
  Loudest = "loudest",
}

export const hyperboleOptions = [
  { label: "Happiest", value: Hyperbole.Happiest },
  { label: "Saddest", value: Hyperbole.Saddest },
  { label: "Danciest", value: Hyperbole.Danciest },
  { label: "Most Energetic", value: Hyperbole.Most_Energetic },
  { label: "Loudest", value: Hyperbole.Loudest },
  { label: "Most Upbeat", value: Hyperbole.Most_Upbeat },
];

export const getStat = (
  hyperbole: Hyperbole,
  features: SpotifyApi.AudioFeaturesObject
) => {
  switch (hyperbole) {
    case Hyperbole.Danciest:
      return `${Math.round(features.danceability * 100)}% danceable`;
    case Hyperbole.Most_Energetic:
      return `${Math.round(features.energy * 100)}% energetic`;
    case Hyperbole.Saddest:
      return `${Math.round(100 - features.valence * 100)}% sad`;
    case Hyperbole.Happiest:
      return `${Math.round(features.valence * 100)}% happy`;
    case Hyperbole.Loudest:
      return `${Math.round(
        mapRange(features.loudness, -60, 0, 0, 1) * 100
      )}% loud`;
    case Hyperbole.Most_Upbeat:
      return `${Math.round(features.tempo)} BPM`;
    // return `${Math.round(
    //   clamp(mapRange(features.tempo, 0, 200, 0, 1), 0, 1) * 100
    // )}% fast`;
    default:
      return "";
  }
};

export const filterTrackStat = (hyperbole: Hyperbole, item: ExpandedItem) => {
  if (!item.features) {
    return false;
  }

  switch (hyperbole) {
    case Hyperbole.Happiest:
      return item.features.valence > 0.7;
    case Hyperbole.Danciest:
      return item.features.danceability > 0.7;
    case Hyperbole.Saddest:
      return item.features.valence < 0.3;
    case Hyperbole.Most_Energetic:
      return item.features.energy > 0.6;
    case Hyperbole.Loudest:
      return item.features.loudness > -7.5;
    case Hyperbole.Most_Upbeat:
      return item.features.tempo > 140;
    default:
      return true;
  }
};

export const getTitle = (hyperbole) => {
  const titles = {
    [Hyperbole.Danciest]: [
      "Get on your dancing shoes",
      "I didnt come to stare at the dancefloor",
      "Saturday night/All week fever",
    ],
    [Hyperbole.Happiest]: [
      "Smiling from ear to ear",
      "If you are happy and you know it, clap your cheeks",
    ],
    [Hyperbole.Saddest]: [
      "It was never a phase mum",
      "I'm not okay, and thats okay",
      "The world is a beautiful place and I'm no longer afraid to cry",
    ],
    [Hyperbole.Most_Energetic]: [
      "I am going to explode",
      "Time to get unleashed",
      "badadadad bee ba ba badabop",
    ],
    [Hyperbole.Loudest]: [
      "Pump it. Louder.",
      "Lets see how cool the neighbours are",
    ],
    [Hyperbole.Most_Upbeat]: [
      "Too many cokey colas",
      "I feel like I can run around the world",
      "Good stuff good stuff. Got anymore?",
    ],
  };

  const t = titles[hyperbole] || ["None"];
  return t[Math.floor(Math.random() * t.length)];
};

export const extremeStat = (hyperbole: Hyperbole, items: ExpandedItem[]) => {
  switch (hyperbole) {
    case Hyperbole.Danciest:
      return Math.max(...items.map((t) => t.features?.danceability));
    case Hyperbole.Most_Energetic:
      return Math.max(...items.map((t) => t.features?.energy));
    case Hyperbole.Happiest:
      return Math.max(...items.map((t) => t.features?.valence));
    case Hyperbole.Saddest:
      return Math.min(...items.map((t) => t.features?.valence));
    case Hyperbole.Loudest:
      return Math.max(...items.map((t) => t.features?.loudness));
    case Hyperbole.Most_Upbeat:
      return Math.min(...items.map((t) => t.features?.tempo));
    default:
      return 0;
  }
};

export const isTheExtremeStat = (
  hyperbole: Hyperbole,
  item: ExpandedItem,
  most: number
) => {
  switch (hyperbole) {
    case Hyperbole.Danciest:
      return item.features?.danceability === most;
    case Hyperbole.Most_Energetic:
      return item.features?.energy === most;
    case Hyperbole.Loudest:
      return item.features?.loudness === most;
    case Hyperbole.Most_Upbeat:
      return item.features?.tempo === most;
    case Hyperbole.Happiest:
    case Hyperbole.Saddest:
      return item.features?.valence === most;
  }
};
