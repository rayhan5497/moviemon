import LinkWithScrollSave from '@/shared/components/ui/LinkWithScrollSave';
import { useIsMd } from '@/shared/hooks/useIsMd';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';

const SaveAndWatchLaterButtons = ({
  isSaved,
  isWatchLater,
  onSave,
  onWatchLater,
  classNames,
}) => {
  const isMd = useIsMd();
  const { isLoggedIn } = useUserMoviesContext();

    const handleSave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSave();
    };

    const handleWatchLater = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onWatchLater();
    };
    
  return (
    <div className={`opacity-80 absolute left-1 bottom-1 flex gap-0 md:gap-1 items-center justify-center ${classNames}`}>
      {/* Save */}
      <button
        disabled={isMd && !isLoggedIn}
        onClick={handleSave}
        className={`flex items-center justify-center p-1 rounded-full transition-colors ${
          isLoggedIn ? 'cursor-pointer hover:bg-red-500' : 'cursor-not-allowed'
        } ${isSaved ? 'bg-accent text-white' : 'bg-[#0000007a] text-white'}`}
        title={
          isLoggedIn
            ? isSaved
              ? 'Click to remove from collection'
              : 'Click to add in collection'
            : 'Login to use this feature'
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isSaved ? 'white' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      </button>

      {/* Watch Later */}
      <button
        disabled={isMd && !isLoggedIn}
        onClick={handleWatchLater}
        className={`flex items-center justify-center p-1 rounded-full transition-colors ${
          isLoggedIn ? 'cursor-pointer hover:bg-blue-500' : 'cursor-not-allowed'
        } ${
          isWatchLater ? 'bg-accent text-white' : 'bg-[#0000007a] text-white'
        }`}
        title={
          isLoggedIn
            ? isWatchLater
              ? 'Click to remove from watch later'
              : 'Click to save in watch later'
            : 'Login to use this feature'
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6l4 2"
          />
        </svg>
      </button>
    </div>
  );
};

export default SaveAndWatchLaterButtons;
