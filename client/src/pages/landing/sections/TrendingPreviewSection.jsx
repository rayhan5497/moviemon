import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ResponsiveH2 } from '../components/LandingHeading';
import MovieCard from '@/widgets/MovieCard';

const TrendingPreviewSection = ({ allMovies, isError, isLoading }) => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <ResponsiveH2>Trending Now</ResponsiveH2>
            <p className="text-gray-400">
              See what people are streaming and watching — updated daily with
              top movies and TV shows.
            </p>
          </div>
          <Link
            to="/trending"
            className="hidden sm:inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-medium"
          >
            View All
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>

        <div
          className="movie-wrapper movies-grid grid gap-4 lg:gap-5 m-2 xl:m-4
        grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
        md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
        xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]"
        >
          {(isLoading || isError) && allMovies.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="transition-all duration-300"
                >
                  <div className="poster-container relative">
                    <div className="poster bg-secondary text-center aspect-[2/3] w-full rounded">
                      <div className="!absolute inset-0 skeleton-shimmer rounded-lg" />
                    </div>
                  </div>

                  <div className="mt-2 h-4 w-3/4 skeleton-shimmer rounded-full mb-2" />
                </motion.div>
              ))
            : allMovies.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="transition-all duration-300"
                >
                  <MovieCard media={item} />
                </motion.div>
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/trending"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-medium"
          >
            View All Trending
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingPreviewSection;
