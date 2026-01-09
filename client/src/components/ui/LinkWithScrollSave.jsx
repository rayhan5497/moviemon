import { Link } from 'react-router-dom';
import { useContext } from 'react';
import MainScrollContext from '../../context/MainScrollContext';

const scrollMemory = {};

export default function LinkWithScrollSave({ to, children, ...props }) {
  const { mainRef } = useContext(MainScrollContext);

  const handleClick = () => {
    if (mainRef.current) {
      scrollMemory[window.location.pathname + window.location.search] =
        mainRef.current.scrollTop;
    }
  };

  return (
    <Link to={to} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

export { scrollMemory };
