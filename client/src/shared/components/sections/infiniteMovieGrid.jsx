import { useContext } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import MainScrollContext from '@/shared/context/MainScrollContext';

const InfiniteMovieGrid = ({ data, renderItem }) => {
  const { mainRef } = useContext(MainScrollContext);

  return (
    <VirtuosoGrid
      useWindowScroll={false}
      customScrollParent={mainRef.current}
      data={data}
      overscan={400}
      listClassName="movie-wrapper movies-grid grid gap-1 lg:gap-2 m-2 xl:m-4
        grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
        md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
        xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]"
      itemContent={(index, item) => renderItem(item, index)}
    />
  );
};

export default InfiniteMovieGrid;
