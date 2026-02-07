import { useEffect, useState } from 'react';

import TrendingSection from '../features/home/TrendingSection';
import PopularSection from '../features/home/PopularSection';
import HeroSliderSection from '../features/home/slider/HeroSliderSection';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  //Change document title
  useEffect(() => {
    document.title = `Moviemon - Discover Movies Instantly`;
  }, []);

  return (
    <>
      <HeroSliderSection trending={trendingMovies} popular={popularMovies} />

      <TrendingSection setMovies={setTrendingMovies} />
      <PopularSection setMovies={setPopularMovies} />
    </>
  );
};

export default Home;
