import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import MainScrollContext from '../context/MainScrollContext';
import NowPlayingContext from '../context/NowPlayingContext';

import useScrollRestoration from '../hooks/useScrollRestoration';

import Header from './sections/Header';
import Sidebar from './sections/sidebar/Sidebar';
import Footer from './sections/Footer';
import NavbarBottom from './sections/NavbarBottom';
import { useIsLg } from '@/hooks/useIsLg';
import { getSidebarState, saveSidebarState } from '@/utils/userState';

const Layout = () => {
  const mainRef = useRef(null);
  const [nowPlayingMedia, setNowPlayingMedia] = useState(null);

  const sentinelRef = useRef(null);

  useScrollRestoration(mainRef);

  const [nowPlayingId, setNowPlayingId] = useState(null);
  const [nowPlayingSId, setNowPlayingSId] = useState(null);
  const [nowPlayingEId, setNowPlayingEId] = useState(null);
  const [nowPlayingSNum, setNowPlayingSNum] = useState(null);
  const [nowPlayingENum, setNowPlayingENum] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlayerPage, setIsPlayerPage] = useState(false);

  const isLg = useIsLg();

  useEffect(() => {
    const sidebarState = getSidebarState();

    if (sidebarState === null && isLg) {
      const nextState = true;
      setIsSidebarOpen(nextState);
      saveSidebarState(nextState);
    } else if (sidebarState !== null) {
      setIsSidebarOpen(sidebarState);
    }
  }, [isLg]);

  return (
    <MainScrollContext.Provider value={{ mainRef, sentinelRef }}>
      <NowPlayingContext.Provider
        value={{
          isPlayerPage,
          setIsPlayerPage,
          nowPlayingId,
          setNowPlayingId,
          nowPlayingSNum,
          setNowPlayingSNum,
          nowPlayingENum,
          setNowPlayingENum,
          nowPlayingEId,
          setNowPlayingEId,
          nowPlayingSId,
          setNowPlayingSId,
          nowPlayingMedia,
          setNowPlayingMedia,
        }}
      >
        <div className="layout grid grid-rows-[auto_1fr_auto] grid-cols-[240px_1fr] h-screen">
          <Header
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div
            ref={mainRef}
            className={`main min-w-dvw md:min-w-auto flex-1 relative flex flex-col transition-all duration-300 overflow-auto md:w-auto
          ${isSidebarOpen ? 'md:ml-0' : 'md:-ml-60'}`}
          >
            <Outlet />
            <div ref={sentinelRef} className="sentinel" />
            <Footer />
          </div>

          <NavbarBottom />
        </div>
      </NowPlayingContext.Provider>
    </MainScrollContext.Provider>
  );
};

export default Layout;
