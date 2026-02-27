import { createPortal } from 'react-dom';

const Backdrop = ({ onClick, className = '' }) => {
  return createPortal(
    <div
      onClick={onClick}
      className={`fixed inset-0 bg-black/50 ${className}`}
    />,
    document.body
  );
};

export default Backdrop;

