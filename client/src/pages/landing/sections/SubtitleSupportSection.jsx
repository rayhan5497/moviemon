import { motion } from 'framer-motion';
import { Languages, Globe, CheckCircle } from 'lucide-react';

const SubtitleSupportSection = () => {
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Arabic',
    'Hindi',
    'Japanese',
    'Korean',
  ];

  return (
    <section className="py-24 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 mb-6">
              <Languages className="w-4 h-4 text-teal-400" />
              Multi-Language
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Watch in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Any Language
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Built-in subtitle support with a growing library of languages.
              Whether you are learning a new language or need subtitles,
              MovieMon has you covered.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span>Subtitle search and download</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span>Auto-sync with your video player</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span>Multiple subtitle tracks supported</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-medium">{lang}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubtitleSupportSection;
