import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottiePlayer = ({ lottie, className, width = '100%', height = '100%' }) => {
  return (
    <DotLottieReact
      src={lottie}
      autoplay
      loop
      width={width}
      height={height}
      className={className}
    />
  );
};

export default LottiePlayer;
