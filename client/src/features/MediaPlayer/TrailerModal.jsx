import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { X } from 'lucide-react';

import useTrailerCarousel from './hooks/useTrailerCarousel';
import useCarouselScroll from './hooks/useCarouselScroll';
import TrailerPlayer from './components/TrailerPlayer';
import TrailerThumbnailCarousel from './components/TrailerThumbnailCarousel';

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

  if (!filteredVideos.length) return null;

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
      </DialogContent>
    </Dialog>
  );
}
