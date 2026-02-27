export default function ScrollNavigator({
  canScrollPrev,
  canScrollNext,
  onPrev,
  onNext,
}) {
  return (
    <div className="navigate-icon hidden z-10 absolute justify-between p-0 md:flex bottom-1/2 translate-y-1/2 invert pointer-events-none w-full">
      {/* Prev */}
      <svg
        onClick={onPrev}
        className={`prev-btn rotate-180 bg-white/50 rounded-full p-0 border cursor-pointer pointer-events-auto shadow-[0_0_5px] shadow-black hover:scale-105 ${
          canScrollPrev ? 'visible' : 'invisible'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="50"
        height="50"
      >
        <g>
          <path d="M10.811,18.707,9.4,17.293,14.689,12,9.4,6.707l1.415-1.414L16.1,10.586a2,2,0,0,1,0,2.828Z" />
        </g>
      </svg>

      {/* Next */}
      <svg
        onClick={onNext}
        className={`next-btn bg-white/50 rounded-full p-0 border cursor-pointer pointer-events-auto shadow-[0_0_5px] shadow-black hover:scale-105 ${
          canScrollNext ? 'visible' : 'invisible'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="50"
        height="50"
      >
        <g>
          <path d="M10.811,18.707,9.4,17.293,14.689,12,9.4,6.707l1.415-1.414L16.1,10.586a2,2,0,0,1,0,2.828Z" />
        </g>
      </svg>
    </div>
  );
}
