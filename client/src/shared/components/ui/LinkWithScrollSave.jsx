import { Link } from 'react-router-dom';
import { useContext } from 'react';
import MainScrollContext from '@/shared/context/MainScrollContext';
import { scrollMemory } from '@/shared/utils/scrollMemory';

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


