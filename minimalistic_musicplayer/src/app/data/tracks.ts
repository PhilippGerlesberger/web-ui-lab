export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
};

export const tracks: Track[] = [
  {
    id: "1",
    title: "No Copyright Music 1",
    artist: "Prettyjohn1",
    src: "/audio/prettyjohn1-no-copyright-music-498106.mp3",
  },
  {
    id: "2",
    title: "No Copyright Music 2",
    artist: "Moodmode",
    src: "/audio/moodmode-no-copyright-music-201745.mp3",
  },
  {
    id: "3",
    title: "No Copyright Music 3",
    artist: "Loksii",
    src: "/audio/loksii-no-copyright-music-211881.mp3",
  },
  {
    id: "4",
    title: "No Copyright Music 4",
    artist: "Alexgrohl",
    src: "/audio/alexgrohl-no-copyright-music-bounce-on-it-184234.mp3",
  },
  {
    id: "5",
    title: "No Copyright Music 5",
    artist: "Alex Morgan",
    src: "/audio/alex-morgan-no-copyright-music-528321.mp3",
  },
];
