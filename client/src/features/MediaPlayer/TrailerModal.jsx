import { AlertCircle, ExternalLink, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';

import useTrailerCarousel from './hooks/useTrailerCarousel';
import useCarouselScroll from './hooks/useCarouselScroll';
import TrailerPlayer from './components/TrailerPlayer';
import TrailerThumbnailCarousel from './components/TrailerThumbnailCarousel';

const YOUTUBE_BASE_URL = 'https://www.youtube.com/results?search_query=';

export default function TrailerModal({
  open,
  onClose,
  videos = [],
  mediaTitle = '',
}) {
  const {
    filteredVideos,
    selectedIndex,
    currentVideo,
    selectVideo,
    nextVideo,
    prevVideo,
  } = useTrailerCarousel(videos);

  const { carouselRef, scrollCarousel } = useCarouselScroll();

  const isTrailerAvailable = filteredVideos.length;

  const handleOpenInNewTab = () => {
    window.open(
      YOUTUBE_BASE_URL +
        mediaTitle.toLocaleLowerCase().replace(' ', '+') +
        '+trailer',
      '_blank'
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'grey.900',
          borderRadius: '8px',
          overflow: 'hidden',
          margin: '5px',
          padding: '0px',
          width: 'auto',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box className="flex items-center justify-between px-4 py-1 md:py-2 border-b border-white/10">
          <Typography className="text-gray-200" sx={{ fontWeight: 700 }}>
            {mediaTitle} — Trailers
          </Typography>

          <IconButton onClick={onClose}>
            <X className="text-gray-200" />
          </IconButton>
        </Box>

        {isTrailerAvailable ? (
          <>
            {/* Video player */}
            <TrailerPlayer
              video={currentVideo}
              showNav={filteredVideos.length > 1}
              onPrev={prevVideo}
              onNext={nextVideo}
            />

            {/* Thumbnail carousel */}
            <TrailerThumbnailCarousel
              videos={filteredVideos}
              selectedIndex={selectedIndex}
              onSelect={selectVideo}
              carouselRef={carouselRef}
              onScrollLeft={() => scrollCarousel('left')}
              onScrollRight={() => scrollCarousel('right')}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-12">
            <div className="flex gap-2.5 items-center">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-zinc-100">
                No trailers available
              </p>
            </div>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View on YouTube</span>
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
