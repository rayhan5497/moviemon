import { Link } from 'react-router-dom';
import { Card, CardActionArea, Typography } from '@mui/material';
import { useIsMd } from '@/shared/hooks/useIsMd';
import { getMediaRating } from '@/shared/utils/mediaRatings';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w185';

const MovieSuggestionCards = ({ movies, setIsOpen }) => {
  const isMd = useIsMd();

  if (!movies || movies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar mt-2 pb-1">
      {movies.map((movie) => {
        const rating = getMediaRating(movie);

        return (
          <Link key={movie.id} to={`/player/${movie.media_type}/${movie.id}`}>
            <Card
              onClick={() => {
                if (!isMd) {
                  setIsOpen(false);
                }
              }}
              sx={{
                minWidth: 88,
                maxWidth: 88,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                flexShrink: 0,
                transition: 'border-color 0.2s, transform 0.15s',
                '&:hover': {
                  borderColor: 'rgba(249,115,22,0.5)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea sx={{ height: '100%' }}>
                <div className="w-full aspect-[2/3] bg-gray-700 overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={`${TMDB_IMG}${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-[10px] text-center px-1 leading-tight">
                        No poster
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-[6px] py-[5px]">
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '0.62rem',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {movie.title}
                  </Typography>
                  {rating ? (
                    <Typography
                      sx={{
                        color: '#f97316',
                        fontSize: '0.6rem',
                        mt: '2px',
                        fontWeight: 600,
                      }}
                    >
                      * {rating.toFixed(1)}
                    </Typography>
                  ) : null}
                </div>
              </CardActionArea>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default MovieSuggestionCards;
