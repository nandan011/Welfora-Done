// Topbar: Demonstrates <NavLink> for top navigation and useLocation for dynamic breadcrumbs
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useWelfora } from '../context/WelforaContext';
import { BellIcon, SearchIcon } from './Icons';

const TOP_LINKS = [
  ['Dashboard', '/'],
  ['Explore Schemes', '/explore'],
  ['AI Assistant', '/chatbot'],
  ['About Us', '/about'],
];

const ROUTE_TITLES = {
  '/': 'Dashboard',
  '/explore': 'Explore Schemes',
  '/find-schemes': 'Find My Schemes',
  '/recommended': 'Recommended',
  '/saved': 'Saved Schemes',
  '/deadlines': 'Deadlines',
  '/chatbot': 'AI Assistant',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/eligibility': 'Eligibility Guide',
  '/about': 'About Us',
};

export default function Topbar() {
  const { profileName, visibleNotifications } = useWelfora();
  // useLocation: inspects current URL pathname
  const location = useLocation();

  const currentTitle =
    ROUTE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/scheme/') ? 'Scheme Details' : 'Citizen Portal');

  return (
    <header className="topbar">
      <div className="crumb">
        <span>Citizen Portal</span>
        <b>/</b>
        <strong>{currentTitle}</strong>
      </div>

      <nav className="top-links">
        {TOP_LINKS.map(([label, path]) => (
          <NavLink
            key={label}
            to={path}
            end={path === '/'}
            className={({ isActive }) => (isActive ? 'chosen' : '')}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="top-actions">
        <Link
          to="/explore"
          className="round"
          title="Search schemes"
          aria-label="Search schemes"
        >
          <SearchIcon size={16} />
        </Link>

        <Link
          to="/notifications"
          className="round round-bell"
          title={`Notifications (${visibleNotifications.length} active)`}
          aria-label={`Notifications (${visibleNotifications.length} active)`}
        >
          <BellIcon size={17} />
          {visibleNotifications.length > 0 && <i className="ping" />}
        </Link>

        <Link
          to="/profile"
          className="top-profile-chip"
          title="View profile & settings"
          aria-label="View profile & settings"
        >
          <div className="mini-avatar">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <span className="top-profile-name">{profileName.split(' ')[0]}</span>
        </Link>

        <Link
          to="/find-schemes"
          className="primary-btn small"
        >
          Find Schemes
        </Link>
      </div>
    </header>
  );
}
