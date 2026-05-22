import { motion } from 'framer-motion';
import { Search, Star, Film, List, Languages, Zap } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description:
      'Find any movie or TV show instantly with our powerful search engine. Filter by genre, rating, year, and more.',
  },
  {
    icon: Star,
    title: 'Ratings & Reviews',
    description:
      'IMDb and TMDB ratings at a glance. Make informed decisions before you watch.',
  },
  {
    icon: Film,
    title: 'HD Trailers',
    description:
      'Watch high-quality trailers directly in the app. No more jumping between sites.',
  },
  {
    icon: List,
    title: 'Personal Watchlist',
    description:
      'Save movies to your watchlist and keep track of what you want to watch next.',
  },
  {
    icon: Languages,
    title: 'Multi-Subtitle Support',
    description:
      'Built-in subtitle support with multiple languages. Never miss a word.',
  },
  {
    icon: Zap,
    title: 'AI Recommendations',
    description:
      'Get personalized movie suggestions powered by AI. Discover hidden gems you will love.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            MovieMon combines powerful tools into one seamless experience.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 rounded-2xl bg-gray-800/60 border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-gray-800/80"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
