import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Empty from '../components/Empty';
import { SearchIcon, BellIcon } from '../components/Icons';
import { useWelfora } from '../context/WelforaContext';
import { categories } from '../data/categories';
import './DeadlinesPage.css';

function getDeadlineUrgency(parsedDate) {
  if (!parsedDate) return { days: 0, level: 'normal', text: 'Scheduled' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(parsedDate);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { days: diffDays, level: 'urgent', text: 'Past date · check status' };
  if (diffDays === 0) return { days: 0, level: 'urgent', text: 'Closing today' };
  if (diffDays === 1) return { days: 1, level: 'urgent', text: '1 day left · closing soon' };
  if (diffDays <= 30) return { days: diffDays, level: 'urgent', text: `${diffDays} days left` };
  if (diffDays <= 90) return { days: diffDays, level: 'warning', text: `${diffDays} days left` };
  return { days: diffDays, level: 'normal', text: `${diffDays} days left` };
}

function parseCalendarParts(deadlineStr, parsedDate) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
    return {
      month: months[parsedDate.getMonth()],
      day: String(parsedDate.getDate()).padStart(2, '0'),
      year: String(parsedDate.getFullYear()),
    };
  }

  const match = String(deadlineStr || '').match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (match) {
    return {
      day: match[1].padStart(2, '0'),
      month: match[2].toUpperCase(),
      year: match[3],
    };
  }

  return {
    day: '—',
    month: 'DATE',
    year: '2026',
  };
}

export default function DeadlinesPage() {
  // useNavigate: route to catalog when empty or exploring
  const navigate = useNavigate();
  const {
    deadlineItems,
    reminderPreferences,
    setReminderPreferences,
    setSelectedScheme,
    saved = [],
    toggleSave,
  } = useWelfora();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [sortBy, setSortBy] = useState('deadline');

  // Filtered and sorted deadline items
  const filteredDeadlines = useMemo(() => {
    return deadlineItems
      .filter(scheme => {
        const matchesQuery =
          !searchQuery ||
          scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (scheme.state && scheme.state.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat =
          selectedCategory === 'All categories' || scheme.category === selectedCategory;

        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'match') return (b.match || 0) - (a.match || 0);
        // Default: closing soonest
        const timeA = a.parsedDeadline ? new Date(a.parsedDeadline).getTime() : Infinity;
        const timeB = b.parsedDeadline ? new Date(b.parsedDeadline).getTime() : Infinity;
        return timeA - timeB;
      });
  }, [deadlineItems, searchQuery, selectedCategory, sortBy]);

  return (
    <section className="page-content deadlines-page">
      <PageTitle
        eyebrow="APPLICATION TIMELINES"
        title="Upcoming Deadlines"
        subtitle="Stay ahead of critical dates and application cutoffs. Schemes with explicit calendar dates are sorted chronologically below."
      />

      {/* 2. Sleek In-App Reminder Preferences Banner */}
      <div className="deadlines-preference-banner">
        <div className="preference-banner-info">
          <div className="preference-banner-icon">
            <BellIcon size={20} />
          </div>
          <div className="preference-banner-texts">
            <h2>Deadline Alert Preferences</h2>
            <p>
              In-app reminders display upcoming application notices and sort impending deadlines first.
              Preferences are preserved in your local browser profile.
            </p>
          </div>
        </div>

        <div className="preference-banner-control">
          <span
            className={`preference-status-tag ${
              reminderPreferences.upcomingDeadlines ? 'active' : 'paused'
            }`}
          >
            {reminderPreferences.upcomingDeadlines && <span className="pulse-dot" />}
            {reminderPreferences.upcomingDeadlines ? 'Reminders On' : 'Reminders Off'}
          </span>

          <label className="switch-control" title="Toggle deadline reminders">
            <input
              type="checkbox"
              checked={reminderPreferences.upcomingDeadlines}
              onChange={e =>
                setReminderPreferences(prev => ({
                  ...prev,
                  upcomingDeadlines: e.target.checked,
                }))
              }
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>

      {/* 3. Search and Filter Bar */}
      {reminderPreferences.upcomingDeadlines && (
        <div className="deadlines-filterbar">
          <div className="deadlines-search-wrap">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <SearchIcon size={16} />
            </span>
            <input
              type="text"
              placeholder="Filter by scheme name, category or region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '14.5px',
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="deadlines-filter-group">
            <select
              className="deadlines-select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              aria-label="Filter deadlines by category"
            >
              <option value="All categories">All categories</option>
              {categories.map(([catName]) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>

            <select
              className="deadlines-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort deadlines"
            >
              <option value="deadline">Closing Soonest</option>
              <option value="name">Alphabetical (A–Z)</option>
              <option value="match">Highest Match</option>
            </select>
          </div>
        </div>
      )}

      {/* 4. Main Deadlines List */}
      {!reminderPreferences.upcomingDeadlines ? (
        <div className="deadlines-paused-notice">
          <div className="deadlines-paused-icon">🔕</div>
          <h3>Deadline Reminders Are Paused</h3>
          <p>
            You have disabled upcoming deadline notices. Turn deadline reminders back on using the
            toggle switch above to view scheduled cutoff alerts and timelines.
          </p>
          <button
            className="btn-details"
            onClick={() =>
              setReminderPreferences(prev => ({
                ...prev,
                upcomingDeadlines: true,
              }))
            }
          >
            Enable Reminders
          </button>
        </div>
      ) : filteredDeadlines.length > 0 ? (
        <div className="deadlines-card-list">
          <div className="deadlines-section-header">
            <h2 className="deadlines-section-title">
              Active Schedules
              <span className="deadlines-count-chip">{filteredDeadlines.length}</span>
            </h2>
          </div>

          {filteredDeadlines.map(scheme => {
            const urgency = getDeadlineUrgency(scheme.parsedDeadline);
            const cal = parseCalendarParts(scheme.deadline, scheme.parsedDeadline);
            const isSaved = saved.includes(scheme.id);

            return (
              <div className="deadline-card-item" key={scheme.id}>
                {/* Visual Calendar Badge */}
                <div className="deadline-calendar-badge">
                  <span className="calendar-month">{cal.month}</span>
                  <span className="calendar-day">{cal.day}</span>
                  <span className="calendar-year">{cal.year}</span>
                </div>

                {/* Scheme Icon */}
                <div className={`deadline-scheme-symbol ${scheme.color}`}>
                  {scheme.icon}
                </div>

                {/* Scheme Details */}
                <div className="deadline-info-block">
                  <div className="deadline-info-header">
                    <h3>{scheme.name}</h3>
                  </div>
                  <div className="deadline-badges-row">
                    <span className="deadline-badge">{scheme.category}</span>
                    <span className="deadline-badge">📍 {scheme.state}</span>
                    {scheme.match && (
                      <span className="deadline-badge match-pill">
                        🎯 {scheme.match}% match
                      </span>
                    )}
                  </div>
                </div>

                {/* Urgency & Days Remaining */}
                <div className="deadline-urgency-wrapper">
                  <span className={`urgency-badge ${urgency.level}`}>
                    {urgency.text}
                  </span>
                  <span className="deadline-verif-note">
                    {scheme.deadline} · Demo date
                  </span>
                </div>

                {/* Actions */}
                <div className="deadline-actions-group">
                  <button
                    className="btn-details"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    View Details →
                  </button>
                  {toggleSave && (
                    <button
                      className={`btn-bookmark ${isSaved ? 'saved' : ''}`}
                      onClick={() => toggleSave(scheme.id)}
                      title={isSaved ? 'Remove from saved' : 'Save scheme'}
                      aria-label={isSaved ? 'Remove from saved' : 'Save scheme'}
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No deadlines matching criteria"
          text="No explicitly dated schemes matched your search or category filter. Try clearing your filters or explore all schemes in the catalog."
          action="Explore all schemes"
          onAction={() => navigate('/explore')}
        />
      )}

    </section>
  );
}
