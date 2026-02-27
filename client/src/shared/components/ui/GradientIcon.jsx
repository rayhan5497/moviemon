import { renderToStaticMarkup } from 'react-dom/server';

const GradientIcon = ({ Icon, size = 48 }) => {
  return (
    <div
      className="bg-gradient-to-r from-teal-500 bg-accent"
      style={{
        WebkitMask: `url('data:image/svg+xml;utf8,${encodeURIComponent(
          renderToStaticMarkup(<Icon size={size} />)
        )}') no-repeat center`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        width: size,
        height: size,
      }}
    />
  );
};

export default GradientIcon