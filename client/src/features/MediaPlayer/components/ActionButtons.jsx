export default function ActionButtons({ media, setOpenTrailer }) {
  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2.5 mt-2 justify-center">
      {/* Trailer */}
      <button
        onClick={() => setOpenTrailer(true)}
        className="flex items-center gap-1 p-1 md:px-2 h-5 md:h-auto rounded-full bg-accent hover:brightness-110 active:scale-95 transition-all duration-200 text-primary font-semibold text-sm shadow-lg shadow-orange-500/20 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-3 h-3 shadow-xs shadow-black rounded-full p-0.5"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        Trailer
      </button>

      {/* IMDb */}
      {media?.external_ids?.imdb_id && (
        <a
          href={`https://www.imdb.com/title/${media.external_ids.imdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 p-1 md:px-2 h-5 md:h-auto  rounded-full bg-secondary text-primary font-semibold text-sm hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg cursor-pointer"
        >
          {/* <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M18.5 3H5.5C4.12 3 3 4.12 3 5.5v13C3 19.88 4.12 21 5.5 21h13c1.38 0 2.5-1.12 2.5-2.5v-13C21 4.12 19.88 3 18.5 3zm-9.5 12H7.5V9H9v6zm2.5 0H10.5V9H11v6zm2.5 0H13V9h1v6zm3.5 0h-1.5V9H17v6z" />
          </svg> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Movie_Ticket_20"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path d="M2.87 4.48a.923.923 0 0 0-.92.92v3.22h.23c.765 0 1.38.615 1.38 1.38s-.615 1.38-1.38 1.38h-.23v3.22c0 .506.414.92.92.92h14.26c.506 0 .92-.414.92-.92v-3.22h-.23c-.765 0-1.38-.615-1.38-1.38s.615-1.38 1.38-1.38h.23V5.4a.923.923 0 0 0-.92-.92Zm0 .46h2.76a.23.23 0 0 0 .46 0h11.04c.257 0 .46.203.46.46v2.807c-.9.118-1.61.861-1.61 1.793s.71 1.675 1.61 1.793V14.6c0 .257-.203.46-.46.46H6.09a.23.23 0 0 0-.46 0H2.87a.456.456 0 0 1-.46-.46v-2.807c.9-.118 1.61-.861 1.61-1.793s-.71-1.675-1.61-1.793V5.4c0-.257.203-.46.46-.46m2.99.69a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m5.06.916-.21.471-.547 1.228-1.85.195 1.382 1.246-.386 1.82 1.611-.93 1.61.93-.385-1.82 1.382-1.246-1.85-.195Zm-5.06.004a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m5.06.207.446.998 1.088.115-.813.732.227 1.07-.948-.546-.948.546.227-1.07-.813-.732 1.088-.115Zm-5.06.713a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46m0 .92a.23.23 0 0 0 0 .46.23.23 0 0 0 0-.46"></path>
          </svg>
          IMDb
        </a>
      )}

      {/* Share */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: media?.title || media?.name,
              text: media?.overview,
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
          }
        }}
        className="flex items-center gap-1 p-1 md:px-2 h-5 md:h-auto  rounded-full bg-secondary text-primary font-semibold text-sm hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
        Share
      </button>
    </div>
  );
}
