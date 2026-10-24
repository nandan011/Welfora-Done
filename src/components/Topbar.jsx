import { useWelfora } from '../context/WelforaContext';
import { BellIcon, SearchIcon } from './Icons';

const TOP_LINKS = ['Dashboard', 'Explore Schemes', 'AI Assistant', 'About Us'];

export default function Topbar({ page, go }) {
  const { profileName, visibleNotifications } = useWelfora();

  function handleTopLink(linkName) {
    go(linkName);
  }

  function isLinkActive(linkName) {
    if (linkName === 'Dashboard' && (page === 'Dashboard' || page === 'Home')) return true;
    return page === linkName;
  }

  return (
    <header className="topbar">
      <div className="crumb">
        <span>Citizen Portal</span>
        <b>/</b>
        <strong>{page}</strong>
      </div>

      <nav className="top-links">
        {TOP_LINKS.map(item => (
          <button
            key={item}
            className={isLinkActive(item) ? 'chosen' : ''}
            onClick={() => handleTopLink(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="top-actions">
        <button
          className="round"
          title="Search schemes"
          aria-label="Search schemes"
          onClick={() => go('Explore Schemes')}
        >
          <SearchIcon size={16} />
        </button>

        <button
          className="round round-bell"
          title={`Notifications (${visibleNotifications.length} active)`}
          aria-label={`Notifications (${visibleNotifications.length} active)`}
          onClick={() => go('Notifications')}
        >
          <BellIcon size={17} />
          {visibleNotifications.length > 0 && <i className="ping" />}
        </button>

        <button
          className="top-profile-chip"
          onClick={() => go('Profile')}
          title="View profile & settings"
          aria-label="View profile & settings"
        >
          <div className="mini-avatar">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <span className="top-profile-name">{profileName.split(' ')[0]}</span>
        </button>

        <button
          className="primary-btn small"
          onClick={() => go('Find My Schemes')}
        >
          Find Schemes
        </button>
      </div>
    </header>
  );
}
