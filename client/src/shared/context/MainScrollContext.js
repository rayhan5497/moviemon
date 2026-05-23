import { createContext } from 'react';

// Provide safe default refs so consumers can destructure without runtime errors
// Components often do: const { mainRef, sentinelRef } = useContext(MainScrollContext)
// If the context is not provided (null), destructuring throws. Using defaults
// prevents that and keeps .current === null until a provider sets real refs.
const MainScrollContext = createContext({
  mainRef: { current: null },
  sentinelRef: { current: null },
});

export default MainScrollContext;
