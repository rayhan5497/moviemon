import { useMemo, useState } from 'react';

export default function useTrailerCarousel(videos = []) {
  const filteredVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        video?.site === 'YouTube' &&
        ['Trailer', 'Teaser', 'Clip'].includes(video?.type)
    );
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
