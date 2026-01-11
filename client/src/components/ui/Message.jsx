import LottiePlayer from './LottiePlayer';

export default function Loading({ lottie, icon, className = '', message }) {
  return (
    <div className="flex items-center justify-center self-center gap-2 my-5 mx-auto p-2 text-primary bg-accent-secondary rounded relative w-fit z-10">
      <span className="text-secondary">{message}</span>
      {lottie && (
        <div className="invert-on-dark">
          <LottiePlayer lottie={lottie} className={className} />
        </div>
      )}

      {icon && <div className="w-5 h-5 invert-on-dark">{icon}</div>}
    </div>
  );
}
