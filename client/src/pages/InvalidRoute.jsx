import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const InvalidRoute = () => {
    //Change document title
    useEffect(() => {
      document.title = `Page not found - Moviemon`;
    }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-500">Invalid URL</h1>
      <p className="mt-3 text-gray-400 text-lg">
        The page you requested does not exist.
      </p>

      <NavLink
        to="/home"
        className="mt-6 text-blue-400 underline hover:text-blue-300 transition"
      >
        Go back home
      </NavLink>
    </div>
  );
};

export default InvalidRoute;
