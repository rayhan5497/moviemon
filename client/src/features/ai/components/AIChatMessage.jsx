import { Typography } from '@mui/material';
import MovieSuggestionCards from './MovieSuggestionCards';

const AIChatMessage = ({ message, setIsOpen }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`${isUser ? 'max-w-[80%]' : 'w-full'}`}>
        {/* Bubble */}
        <div
          className={`px-3 py-2 rounded-2xl ${
            isUser
              ? 'bg-orange-600 rounded-br-sm'
              : `rounded-bl-sm ${
                  message.isError
                    ? 'bg-red-950/70 border border-red-700/40'
                    : 'bg-gray-800'
                }`
          }`}
        >
          <Typography
            variant="body2"
            sx={{
              color: isUser ? '#fff' : 'rgba(255,255,255,0.88)',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </Typography>
        </div>

        {/* Movie suggestion cards (AI messages only) */}
        {!isUser && message.movies && message.movies.length > 0 ? (
          <MovieSuggestionCards movies={message.movies} setIsOpen={setIsOpen}/>
        ) : null}

        {!isUser &&
          message.titles &&
          message.titles.length > 0 &&
          message.titles.length > (message.movies?.length || 0) && (
            <div className="mt-2 text-sm text-gray-300">
              <div className="font-semibold mb-1">
                Recommended titles (including items without cards):
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {message.titles.map((title, idx) => (
                  <li key={idx}>{title}</li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

export default AIChatMessage;
