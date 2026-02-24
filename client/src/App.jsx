import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import HomePage from './pages/Home';
import DiscoverMoviePage from './pages/DiscoverMovie';
import DiscoverTvPage from './pages/DiscoverTv.jsx';
import TrendingPage from './pages/Trending';
import MoviePage from './pages/Movie';
import TvPage from './pages/Tv';
import MediaPlayerPage from './pages/MediaPlayer';
import SearchPage from './pages/Search';
import InvalidRoute from './pages/InvalidRoute';
import SimilarAndRecommendationsPage from './pages/SimilarAndRecommendations';
import PersonPage from './pages/Person';
import UserPage from './pages/User';
import SavedPage from './pages/Saved';
import WatchLaterPage from './pages/WatchLater';
import WatchHistoryPage from './pages/WatchHistory';
import AccountPage from './pages/Account';
import VerifyEmailPage from './pages/VerifyEmail.jsx';
import EmailChangeApprovalPage from './pages/EmailChangeApproval.jsx';
import { useState, useEffect } from 'react';

import { SnackbarProvider } from './context/SnackbarProvider.jsx';
import { UserMoviesProvider } from './context/UserMoviesContext.jsx';

const queryClient = new QueryClient();

import { lazy, Suspense } from 'react';
import { ModalProvider } from './context/ModalContext.jsx';

const DevPanel = import.meta.env.DEV
  ? lazy(() => import('./dev/DevPanel'))
  : null;

const App = () => {
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        setShowDevPanel((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ModalProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <UserMoviesProvider>
              {DevPanel && showDevPanel && (
                <Suspense fallback={null}>
                  <DevPanel />
                </Suspense>
              )}
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/discover/movie"
                    element={<DiscoverMoviePage />}
                  />
                  <Route path="/discover/tv" element={<DiscoverTvPage />} />

                  <Route
                    path="/movie"
                    element={<Navigate to="/movie/popular" replace />}
                  />
                  <Route path="/movie/:sort" element={<MoviePage />} />
                  <Route
                    path="/tv"
                    element={<Navigate to="/tv/popular" replace />}
                  />
                  <Route path="/tv/:sort" element={<TvPage />} />

                  <Route
                    path="/trending"
                    element={<Navigate to="/trending/all/day" replace />}
                  />
                  <Route
                    path="/trending/:mediaType"
                    element={<Navigate to="/trending/all/day" replace />}
                  />
                  <Route
                    path="/trending/:mediaType/:timeWindow"
                    element={<TrendingPage />}
                  />

                  <Route
                    path="/player/:mediaType/:id"
                    element={<MediaPlayerPage />}
                  />
                  <Route
                    path="/:mediaType/:id/:sort"
                    element={<SimilarAndRecommendationsPage />}
                  />
                  <Route path="/user" element={<UserPage />} />
                  <Route path="/user/saved" element={<SavedPage />} />
                  <Route
                    path="/user/watch-later"
                    element={<WatchLaterPage />}
                  />
                  <Route
                    path="/user/watch-history"
                    element={<WatchHistoryPage />}
                  />
                  <Route path="/user/account" element={<AccountPage />} />
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route
                    path="/email-change/approve"
                    element={<EmailChangeApprovalPage />}
                  />

                  <Route path="/person/:id" element={<PersonPage />} />

                  <Route path="/search" element={<SearchPage />} />
                  <Route path="*" element={<InvalidRoute />} />
                </Route>
              </Routes>
            </UserMoviesProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ModalProvider>
  );
};

export default App;
