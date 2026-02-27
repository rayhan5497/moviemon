import { Tooltip } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

export default function QueryNavLink({
  to,
  children,
  isSectionActive,
  className = '',
  disabled = false,
}) {
  const location = useLocation();
  const link = new URL(to, window.location.origin);

  const isActive =
    location.pathname === link.pathname && location.search === link.search;

  return (
    <Tooltip title={disabled ? 'Login to use this feature' : ''}>
      <NavLink
        to={disabled ? '#' : to}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
        className={`block ${className} ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        } ${
          isActive || isSectionActive
            ? 'text-teal-400 font-semibold'
            : 'hover:text-gray-400'
        }`}
      >
        {children}
      </NavLink>
    </Tooltip>
  );
}
