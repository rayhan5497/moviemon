import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import {ResponsiveH2} from '../components/LandingHeading';

const trendingMock = [
  { title: 'Dune: Part Two', year: '2024', rating: '8.6' },
  { title: 'Oppenheimer', year: '2023', rating: '8.4' },
  { title: 'Spider-Man: Across the Spider-Verse', year: '2023', rating: '8.6' },
  { title: 'The Batman', year: '2022', rating: '7.8' },
  { title: 'Everything Everywhere All at Once', year: '2022', rating: '7.8' },
];

const TrendingPreviewSection = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trendingMock.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group relative rounded-xl overflow-hidden bg-gray-800/60 border border-white/5 p-5 hover:border-white/10 transition-all duration-300"
            >
              <div className="absolute top-3 right-3 text-4xl font-black text-white/5 select-none">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-3">
                  ★ {item.rating}
                </div>
                <h3 className="font-semibold text-sm leading-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.year}</p>
              </div>
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
