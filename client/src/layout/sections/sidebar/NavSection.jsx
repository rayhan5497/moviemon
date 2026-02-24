import GradientIcon from '@/components/ui/GradientIcon';

import QueryNavLink from './QueryNavLink';

const NavSection = ({
  title,
  items,
  isSectionActive,
  icon: Icon,
  iconFill: IconFill,
  disabled = false,
  onClick,
}) => {
  return (
    <div>
      <h3
        onClick={onClick}
        className="text-xl bg-gray-700 rounded-lg p-1 px-3 mt-5"
      >
        <QueryNavLink
          disabled={disabled}
          className="flex items-center gap-2"
          isSectionActive={isSectionActive}
          to={title.path}
          onClick={onClick}
        >
          {!isSectionActive && (
            <>
              <Icon className="w-6 h-6 text-gray-400" />{' '}
              <div className="title text-gray-400">{title.label}</div>
            </>
          )}

          {isSectionActive && (
            <>
              <GradientIcon Icon={IconFill} size={24} />{' '}
              <div className="title">{title.label}</div>
            </>
          )}
          {/* {title.label} */}
        </QueryNavLink>
      </h3>
      {items.length > 0 && (
        <ul className="border border-t-0 border-gray-600 rounded-b-lg px-3 p-1 ml-2">
          {items.map((item) => (
            <li
              key={item.path}
              className={`p-2 ${
                disabled
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:text-gray-400 cursor-pointer'
              }`}
              onClick={onClick}
            >
              <QueryNavLink
                onClick={onClick}
                disabled={disabled}
                to={item.path}
              >
                {item.label}
              </QueryNavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavSection;
