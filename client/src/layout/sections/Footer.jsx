import { NavLink } from 'react-router-dom';
import {
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope
} from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`mt-auto bg-primary text-primary border-t border-accent-secondary mb-14 md:mb-0`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 sm:grid-cols-2">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <img
              src="/siteLogo.png"
              className="w-6 h-6 text-accent -bottom-[1px] relative"
            />
            <span>Moviemon</span>
          </div>
          <p className="text-sm text-secondary leading-relaxed">
            Discover movies & TV shows, explore cast details, and dive deep into
            recommendations tailored for you.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink to="/movie/popular" className="hover:text-accent">
                Popular Movies
              </NavLink>
            </li>
            <li>
              <NavLink to="/tv/popular" className="hover:text-accent">
                Popular TV Shows
              </NavLink>
            </li>
            <li>
              <NavLink to="/trending/all/day" className="hover:text-accent">
                Trending
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" className="hover:text-accent">
                Search
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li className="text-secondary">TMDB API used</li>
            <li className="text-secondary">No content hosted</li>
            <li className="text-secondary">For educational use</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-4">
            <a
              title="Github"
              href="https://github.com/rayhan5497/moviemon---watch-movies"
              target="_blank"
              className="hover:text-accent"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              title="Linkedin"
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-accent"
              aria-label="Twitter"
            >
              <FaLinkedinIn className="w-5 h-5" />
            </a>
            <a
              title="Twitter"
              href="https://twitter.com"
              target="_blank"
              className="hover:text-accent"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              title="Email"
              href="mailto:raihan5497681@gmail.com"
              className="hover:text-accent"
              aria-label="Email"
            >
              <FaEnvelope className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-accent-secondary text-center py-4 text-xs text-secondary">
        © {year} Movimon. Built with ❤️ for movie lovers.
      </div>
    </footer>
  );
}
