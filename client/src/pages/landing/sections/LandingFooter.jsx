import { Link } from 'react-router-dom';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-xl font-bold text-white mb-3"
            >
              <img src="/siteLogo.png" alt="MovieMon" className="w-6 h-6" />
              MovieMon
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your ultimate movie discovery and streaming companion. Search,
              explore, stream trailers, and save your favorites.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/movie/popular"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/trending"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/user/saved"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Saved Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/user/watch-later"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Watch Later
                </Link>
              </li>
              <li>
                <Link
                  to="/user"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>&copy; {currentYear} MovieMon. All rights reserved.</p>
          <p className="text-xs">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              TMDB
            </a>{' '}
            and{' '}
            <a
              href="https://www.imdb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              IMDb
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
