import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Metric from '../components/Metric';
import QuickStat from '../components/QuickStat';
import { SearchIcon } from '../components/Icons';
import { categories } from '../data/categories';
import { formatDaysRemaining } from '../utils/schemeUtils';
import { useWelfora } from '../context/WelforaContext';

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: '👤',
    title: 'Create Your Profile',
    desc: 'Enter basic information such as your state, age group, occupation and other details.',
    color: 'violet',
  },
  {
    step: '2',
    icon: '🔍',
    title: 'Explore Schemes',
    desc: 'Browse government schemes using categories, search and state filters.',
    color: 'blue',
  },
  {
    step: '3',
    icon: '✓',
    title: 'Check Eligibility',
    desc: 'View the basic eligibility requirements and check whether a scheme may be suitable for you.',
    color: 'mint',
  },
  {
    step: '4',
    icon: '📋',
    title: 'View Scheme Details',
    desc: 'Read important information such as benefits, eligibility, required documents and application details.',
    color: 'orange',
  },
];

export default function Dashboard({ go }) {
  // useNavigate: React Router hook for programmatic navigation
  const navigate = useNavigate();
  const {
    schemes,
    assessedSchemes,
    saved,
    applied,
    profileName,
    deadlineItems,
    reminderPreferences,
    setSelectedScheme,
    setExploreCategory,
    apiLoading,
    apiError,
    loadSchemes,
  } = useWelfora();

  const totalSchemesCount = schemes?.length || 0;

  const eligibleSchemes = useMemo(() => {
    return (assessedSchemes || []).filter(s => (s.fit?.score || 0) >= 55);
  }, [assessedSchemes]);

  const eligibleCount = eligibleSchemes.length;

  const recommended = useMemo(() => {
    if (eligibleSchemes.length > 0) {
      return eligibleSchemes.slice(0, 4);
    }
    return [schemes[0], schemes[2], schemes[3], schemes[4]].filter(Boolean);
  }, [eligibleSchemes, schemes]);

  return (
    <section className="dashboard-content">
      {/* Hero Banner */}
      <div className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>🇮🇳</span> EMPOWERING CITIZENS · {totalSchemesCount > 0 ? `${totalSchemesCount} ` : ''}VERIFIED SCHEMES
          </div>
          <h1>
            Find. Understand.<br /> Apply. <span>Succeed.</span>
          </h1>
          <p>
            Discover government schemes tailored for you and your family, understand eligibility in clear plain language, and navigate applications with confidence.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate('/find-schemes')}>
              Find Schemes For Me <span>→</span>
            </button>
            <button className="hero-secondary" onClick={() => navigate('/explore')}>
              Explore all {totalSchemesCount > 0 ? `${totalSchemesCount} ` : ''}schemes
            </button>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-glow" />
          <div className="hero-showcase-card">
            <div className="showcase-header">
              <span className="showcase-dot-pulse" />
              <span className="showcase-status">Live Welfare Navigator</span>
              <span className="showcase-pill">🇮🇳 India</span>
            </div>

            <div className="showcase-body">
              <div className="showcase-avatar-row">
                <div className="showcase-avatar">{profileName.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="showcase-user-title">{profileName}</div>
                  <div className="showcase-user-sub">Active Citizen Profile</div>
                </div>
              </div>

              <div className="showcase-stats-grid">
                <div className="showcase-stat-box">
                  <span className="stat-label">Eligible Match</span>
                  <strong className="stat-num">{eligibleCount} Schemes</strong>
                </div>
                <div className="showcase-stat-box">
                  <span className="stat-label">Total Available</span>
                  <strong className="stat-num">{totalSchemesCount} Schemes</strong>
                </div>
              </div>

              <div className="showcase-tags-list">
                <span>✓ Direct Benefit Transfer</span>
                <span>✓ 100% Free Guidance</span>
              </div>
            </div>
          </div>

          <div className="float-tag tag-edu"><span>🎓</span> Higher Education</div>
          <div className="float-tag tag-health"><span>🩺</span> Ayushman PM-JAY</div>
          <div className="float-tag tag-home"><span>🏠</span> PM Awas Housing</div>
          <div className="float-tag tag-money"><span>₹</span> PM-Kisan DBT</div>
        </div>
      </div>

      {/* API status */}
      {apiLoading && (
        <div className="api-status-banner">
          <span className="loading-dots"><span /><span /><span /></span>
          Loading government schemes…
        </div>
      )}
      {apiError && (
        <div className="api-status-banner api-error" role="alert">
          {apiError}{' '}
          <button className="outline-btn small" onClick={loadSchemes}>Retry</button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="metric-row">
        <Metric
          icon="🏛️"
          color="violet"
          value={apiLoading ? '...' : `${totalSchemesCount}`}
          label="Available Schemes"
        />
        <Metric
          icon="🎯"
          color="mint"
          value={apiLoading ? '...' : `${eligibleCount}`}
          label="Eligible Schemes"
        />
        <Metric
          icon="📍"
          color="blue"
          value="28"
          label="States & UTs Covered"
        />
        <Metric
          icon="🌟"
          color="pink"
          value="98%"
          label="Citizen Satisfaction"
        />
      </div>

      {/* Welcome & Quick Stats */}
      <div className="welcome-panel">
        <div className="welcome-title">
          <div>
            <h2>
              👋 Welcome back, <span>{profileName}!</span>
            </h2>
            <p>Here's what's happening today.</p>
          </div>
          <label className="searchbox welcome-search">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <SearchIcon size={16} />
            </span>
            <input
              readOnly
              onClick={() => navigate('/explore')}
              placeholder="Search schemes, benefits…"
              style={{ cursor: 'pointer' }}
            />
            <button onClick={() => navigate('/explore')}>↗</button>
          </label>
        </div>

        <div className="quick-stats">
          <QuickStat
            icon="🏛️"
            title="Available Schemes"
            number={apiLoading ? '...' : totalSchemesCount}
            color="blue"
            onClick={() => navigate('/explore')}
          />
          <QuickStat
            icon="🎓"
            title="Eligible Schemes"
            number={apiLoading ? '...' : eligibleCount}
            color="violet"
            onClick={() => navigate('/recommended')}
          />
          <QuickStat
            icon="❤️"
            title="Saved Schemes"
            number={saved.length}
            color="mint"
            onClick={() => navigate('/saved')}
          />
          <QuickStat
            icon="⏱️"
            title="Upcoming Deadlines"
            number={reminderPreferences.upcomingDeadlines ? deadlineItems.length : 0}
            color="orange"
            onClick={() => navigate('/deadlines')}
          />
        </div>
      </div>

      {/* Dashboard Lower Grid */}
      <div className="dashboard-lower">
        <div className="panel recommendation-panel">
          <div className="panel-heading">
            <h2>Top Recommended for You</h2>
            <button onClick={() => navigate('/recommended')}>View all ↗</button>
          </div>
          {recommended.map(s => {
            const matchScore = s.fit?.score || s.match || 75;
            return (
              <button className="recommend-row" key={s.id} onClick={() => setSelectedScheme(s)}>
                <span className={`scheme-symbol ${s.color}`}>{s.icon}</span>
                <span className="recommend-name">
                  <b>{s.name}</b>
                  <i>
                    <span style={{ width: `${matchScore}%` }} />
                  </i>
                </span>
                <span className="match">{matchScore}% match</span>
                <span className="row-arrow">›</span>
              </button>
            );
          })}
        </div>

        <div className="right-stack">
          <div className="panel deadlines-panel">
            <div className="panel-heading">
              <h2>Upcoming Deadlines</h2>
              <button onClick={() => navigate('/deadlines')}>View all ↗</button>
            </div>
            {(reminderPreferences.upcomingDeadlines ? deadlineItems.slice(0, 3) : []).map((s, i) => (
              <button className="deadline-mini" key={s.id} onClick={() => setSelectedScheme(s)}>
                <span className={`tiny-date ${['orange', 'pink', 'blue'][i] || 'blue'}`}>⏱️</span>
                <b>{s.name}</b>
                <span>{s.deadline}</span>
                <i>{formatDaysRemaining(s.parsedDeadline)}</i>
              </button>
            ))}
            {(!reminderPreferences.upcomingDeadlines || deadlineItems.length === 0) && (
              <div className="deadline-empty-note">
                No dated reminders shown. Check official notices for current dates.
              </div>
            )}
          </div>

          {/* Welfora Assistant CTA */}
          <button className="assistant-banner" onClick={() => navigate('/chatbot')}>
            <span className="assistant-mini">✦</span>
            <span>
              <b>Ask Welfora</b>
              <small>Ask about schemes, eligibility, documents…</small>
            </span>
            <span className="assistant-go">↗</span>
          </button>

          {/* Find Schemes CTA */}
          <button className="find-schemes-banner" onClick={() => navigate('/find-schemes')}>
            <span className="find-schemes-mini">🔍</span>
            <span>
              <b>Find Schemes For Me</b>
              <small>Enter your profile, get personalised suggestions</small>
            </span>
            <span className="assistant-go">→</span>
          </button>
        </div>
      </div>

      {/* Category Strip */}
      <div className="category-strip">
        <div className="panel-heading">
          <div>
            <h2>Explore by category</h2>
            <p>Find support for what matters to you.</p>
          </div>
          <button onClick={() => navigate('/explore')}>All categories ↗</button>
        </div>
        <div className="category-tiles">
          {categories.map(c => (
            <button
              className="category-tile"
              key={c[0]}
              onClick={() => {
                setExploreCategory(c[0]);
                navigate('/explore');
              }}
            >
              <span className={`category-icon ${c[3]}`}>{c[1]}</span>
              <b>{c[0]}</b>
              <small>{c[2]}</small>
            </button>
          ))}
        </div>
      </div>

      {/* How Welfora Works */}
      <div className="how-it-works">
        <div className="panel-heading">
          <div>
            <h2>How Welfora Works</h2>
            <p>Four simple steps to discover and understand government benefits.</p>
          </div>
        </div>
        <div className="hiw-grid">
          {HOW_IT_WORKS.map((step) => (
            <div className="hiw-card" key={step.step}>
              <div className={`hiw-step-num ${step.color}`}>{step.step}</div>
              <div className={`hiw-icon ${step.color}`}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="hiw-connector" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
