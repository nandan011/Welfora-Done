import { useWelfora } from '../context/WelforaContext';
import {
  DashboardIcon,
  CompassIcon,
  TargetFinderIcon,
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
  ['Dashboard', DashboardIcon],
  ['Explore Schemes', CompassIcon],
  ['Find My Schemes', TargetFinderIcon],
  ['Recommended', SparklesIcon],
  ['Saved Schemes', BookmarkIcon],
  ['Deadlines', ClockIcon],
  ['AI Assistant', BotIcon],
  ['Notifications', BellIcon],
  ['Profile', UserIcon],
  ['Settings', SettingsIcon],
];

export default function Sidebar({ page, go, onLogout }) {
  const { dark, setDark, profileName, visibleNotifications } = useWelfora();

  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => go('Dashboard')}>
        <span className="brand-mark">W</span>
        <span>
          <b>WELFORA</b>
          <small>Your Gateway to Government Benefits</small>
        </span>
      </button>

      <div className="side-nav">
        {NAV_ITEMS.map(([label, IconComponent]) => (
          <button
            key={label}
            className={`nav-link ${page === label ? 'active' : ''}`}
            aria-current={page === label ? 'page' : undefined}
            onClick={() => go(label)}
          >
            <span className="nav-ico">
              <IconComponent size={16} />
            </span>
            <span>{label}</span>
            {label === 'Notifications' && visibleNotifications.length > 0 && (
              <i className="nav-badge">{visibleNotifications.length}</i>
            )}
          </button>
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
          <button
            className="dots"
            onClick={() => go('Profile')}
            title="Profile & account options"
            aria-label="Profile & account options"
          >
            <MoreVerticalIcon size={16} />
          </button>
        </div>

        <button className="logout-btn" onClick={onLogout} aria-label="Log Out">
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <LogOutIcon size={15} />
          </span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
