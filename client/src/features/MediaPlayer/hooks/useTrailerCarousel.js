import { useMemo, useState } from 'react';

export default function useTrailerCarousel(videos = []) {
  const filteredVideos = useMemo(() => {
    return videos
      .filter(
        (video) =>
          video?.site === 'YouTube' &&
          ['Trailer', 'Teaser', 'Clip'].includes(video?.type)
      )
      .sort((a, b) => {
        const getPriority = (video) => {
          if (video.type === 'Trailer' && /official/i.test(video.name))
            return 0;
          if (video.type === 'Trailer') return 1;
          if (video.type === 'Teaser' &&  /official/i.test(video.name)) return 2;
          if (video.type === 'Teaser') return 3;
          if (video.type === 'Clip') return 4;
          return 5;
        };
        return getPriority(a) - getPriority(b);
      });
  }, [videos]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentVideo = filteredVideos[selectedIndex] ?? null;

  const selectVideo = (index) => setSelectedIndex(index);

  const nextVideo = () => {
    setSelectedIndex((prev) =>
      prev === filteredVideos.length - 1 ? 0 : prev + 1
    );
  };

  const prevVideo = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? filteredVideos.length - 1 : prev - 1
    );
  };

  return {
    filteredVideos,
    selectedIndex,
    currentVideo,
    selectVideo,
    nextVideo,
    prevVideo,
  };
}