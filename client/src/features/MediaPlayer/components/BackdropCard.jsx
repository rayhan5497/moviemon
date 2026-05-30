import { memo, useEffect, useState } from 'react';

import { useIsXs } from '@/shared/hooks/useIsXs';
const TMDB_BASE_URL = 'https://image.tmdb.org/t/p/';

const BackdropCard = ({ media, onClick }) => {
  const isXs = useIsXs();
  const THUMB_SIZE = isXs ? 'w500' : 'w300';

  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-lg bg-zinc-900 shadow-md transition-all duration-300 hover:scale-[1.02] snap-start"
    >
      <img
        loading="lazy"
        decoding="async"
        src={`${TMDB_BASE_URL}${THUMB_SIZE}${media.file_path}`}
        alt="Backdrop frame canvas layout"
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
      />
      {!imgLoaded && (
        <div className="!absolute inset-0 skeleton-shimmer rounded-lg"></div>
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};

export default memo(BackdropCard);
