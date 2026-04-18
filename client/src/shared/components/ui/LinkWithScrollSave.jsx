import { Link } from 'react-router-dom';
import { useContext } from 'react';
import MainScrollContext from '@/shared/context/MainScrollContext';
import { scrollMemory } from '@/shared/utils/scrollMemory';

export default function LinkWithScrollSave({
  to,
  children,
  onClick,
  ...props
}) {
  const { mainRef } = useContext(MainScrollContext);

  const handleClick = (event) => {
    if (mainRef.current) {
      scrollMemory[window.location.pathname + window.location.search] =
        mainRef.current.scrollTop;
    }
    onClick?.(event);
  };

  return (
    <Link to={to} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}


