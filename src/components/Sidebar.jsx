// Sidebar: Demonstrates <NavLink> with active styling and useNavigate for programmatic logout
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useWelfora } from '../context/WelforaContext';
import {
  DashboardIcon,
  CompassIcon,
  SparklesIcon,
  BookmarkIcon,
  ClockIcon,
  BotIcon,
  BellIcon,
  UserIcon,
  SettingsIcon,
  MoreVerticalIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
} from './Icons';

const NAV_ITEMS = [
  ['Dashboard', DashboardIcon, '/'],
  ['Explore Schemes', CompassIcon, '/explore'],
  ['Recommended', SparklesIcon, '/recommended'],
  ['Saved Schemes', BookmarkIcon, '/saved'],
  ['Deadlines', ClockIcon, '/deadlines'],
  ['AI Assistant', BotIcon, '/chatbot'],
  ['Notifications', BellIcon, '/notifications'],
  ['Profile', UserIcon, '/profile'],
  ['Settings', SettingsIcon, '/settings'],
];

export default function Sidebar() {
  const { dark, setDark, profileName, visibleNotifications, setAuthSession } = useWelfora();
  // useNavigate: React Router programmatic redirection
  const navigate = useNavigate();

  function handleLogout() {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('welfora-demo-session');
      setAuthSession(null);
      navigate('/login');
    }
  }

  return (
    <aside className="sidebar">
      {/* Link: Client-side navigation without page reload */}
      <Link to="/" className="brand">
        <span className="brand-mark">W</span>
        <span>
          <b>WELFORA</b>
          <small>Your Gateway to Government Benefits</small>
        </span>
      </Link>

      <div className="side-nav">
        {NAV_ITEMS.map(([label, IconComponent, path]) => (
          // NavLink: Automatically applies active class when matching current route
          <NavLink
            key={label}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-ico">
              <IconComponent size={16} />
            </span>
            <span>{label}</span>
            {label === 'Notifications' && visibleNotifications.length > 0 && (
              <i className="nav-badge">{visibleNotifications.length}</i>
            )}
          </NavLink>
        ))}
      </div>

      <div className="side-bottom">
        <button
          className="theme-switch"
          onClick={() => setDark(!dark)}
          title="Toggle color theme"
          aria-label="Toggle color theme"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {dark ? <MoonIcon size={14} /> : <SunIcon size={14} />}
            {dark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <i className={dark ? 'switch on' : 'switch'}>
            <b />
          </i>
        </button>

        <div className="user-chip">
          <div className="avatar">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <span>
            <b>{profileName}</b>
            <small>Your journey starts here</small>
          </span>
          <Link
            to="/profile"
            className="dots"
            title="Profile & account options"
            aria-label="Profile & account options"
          >
            <MoreVerticalIcon size={16} />
          </Link>
        </div>

        <button className="logout-btn" onClick={handleLogout} aria-label="Log Out">
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <LogOutIcon size={15} />
          </span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
