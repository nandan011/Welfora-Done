import { useEffect, useMemo, useState } from 'react';
import PageTitle from '../components/PageTitle';
import SchemeCard from '../components/SchemeCard';
import Empty from '../components/Empty';
import { SearchIcon } from '../components/Icons';
import { categories } from '../data/categories';
import { ALL_INDIAN_STATES } from '../services/schemeService';
import { parseDemoDeadline } from '../utils/schemeUtils';
import { useWelfora } from '../context/WelforaContext';
import { useDebounceValue } from '../hooks/useDebounce';

const interestKeywords = {
  'Scholarships & Education': ['education', 'scholarship', 'student', 'learning', 'vidyalakshmi', 'nmms'],
  Healthcare: ['health', 'medical', 'healthcare', 'hospital', 'ayushman'],
  'Employment & Skill Development': ['employment', 'skill', 'training', 'job', 'worker', 'apprentice', 'mudra'],
  Agriculture: ['agriculture', 'farmer', 'farming', 'crop', 'kisan', 'fasal'],
  Housing: ['housing', 'home', 'house', 'shelter', 'awas'],
  'Pension & Senior Citizen Benefits': ['pension', 'senior', 'elderly', 'old age', 'nsap'],
  'Business & Self-employment': ['business', 'entrepreneur', 'self-employment', 'enterprise', 'mudra'],
  'General Financial Assistance': ['financial', 'assistance', 'income', 'cash', 'benefit'],
};

function matchesInterests(scheme, interests = []) {
  if (!interests.length) return false;
  const searchable = [scheme.name, scheme.category, scheme.description, scheme.eligibility]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return interests.some(interest =>
    (interestKeywords[interest] || []).some(keyword => searchable.includes(keyword))
  );
}

export default function ExplorePage({
  isRecommended = false,
}) {
  const {
    assessedSchemes,
    saved,
    toggleSave,
    applyScheme,
    setSelectedScheme,
    authSession,
    // Use global explore state from context
    exploreQuery,
    setExploreQuery,
    exploreCategory,
    setExploreCategory,
    exploreState,
    setExploreState,
    apiLoading,
    apiError,
    loadSchemes,
  } = useWelfora();

  const [fitFilter, setFitFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailScheme, setDetailScheme] = useState(null);
  const pageSize = 9;

  const userInterests = authSession?.profile?.interests || [];

  // Debounce search — only filter 400ms after typing stops
  const debouncedQuery = useDebounceValue(exploreQuery, 400);

  const filtered = useMemo(() => {
    return assessedSchemes
      .filter(s => {
        const matchQuery = `${s.name} ${s.category} ${s.description} ${s.eligibility}`
          .toLowerCase()
          .includes((debouncedQuery || '').toLowerCase());
        const matchCategory = exploreCategory === 'All categories' || s.category === exploreCategory;
        const matchState =
          exploreState === 'All states' ||
          ['All India', 'State dependent', 'Participating states', 'Urban areas'].includes(s.state) ||
          s.state.toLowerCase().includes(exploreState.toLowerCase());
        const matchRecommendation =
          !isRecommended || s.fit?.score >= 55 || matchesInterests(s, userInterests);
        const matchFit = fitFilter === 'all' || s.fit?.score >= 55;

        return matchQuery && matchCategory && matchState && matchRecommendation && matchFit;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'match') return (b.fit?.score || 0) - (a.fit?.score || 0);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        if (sortBy === 'deadline') {
          const dateA = parseDemoDeadline(a.deadline)?.getTime() ?? Infinity;
          const dateB = parseDemoDeadline(b.deadline)?.getTime() ?? Infinity;
          return dateA - dateB;
        }
        return a.id - b.id;
      });
  }, [assessedSchemes, debouncedQuery, exploreCategory, exploreState, fitFilter, isRecommended, sortBy, userInterests]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedSchemes = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, exploreCategory, exploreState, fitFilter, sortBy]);

  function resetFilters() {
    setExploreQuery('');
    setExploreCategory('All categories');
    setExploreState('All states');
    setFitFilter('all');
    setSortBy('recommended');
  }

  // If a detail scheme is selected via "View Details", show detail page
  if (detailScheme) {
    return (
      <SchemeDetailPage
        scheme={detailScheme}
        onBack={() => setDetailScheme(null)}
      />
    );
  }

  return (
    <section className="page-content">
      <PageTitle
        eyebrow="DISCOVER YOUR OPTIONS"
        title={isRecommended ? 'Recommended for you' : 'Explore Schemes'}
        subtitle="Find support that fits your needs. Verify all details on official government portals before applying."
      />

      {/* API loading/error banners */}
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

      <div className="filterbar">
        <label className="searchbox">
          <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <SearchIcon size={16} />
          </span>
          <input
            aria-label="Search schemes"
            value={exploreQuery}
            onChange={e => setExploreQuery(e.target.value)}
            placeholder="Search schemes, benefits…"
          />
          {exploreQuery && (
            <button
              className="search-clear"
              onClick={() => setExploreQuery('')}
              aria-label="Clear search"
            >×</button>
          )}
        </label>

        <select
          aria-label="Filter by category"
          value={exploreCategory}
          onChange={e => setExploreCategory(e.target.value)}
        >
          <option>All categories</option>
          {categories.map(c => (
            <option key={c[0]}>{c[0]}</option>
          ))}
        </select>

        <select
          aria-label="Filter by state"
          value={exploreState}
          onChange={e => setExploreState(e.target.value)}
        >
          {ALL_INDIAN_STATES.map(s => (
            <option key={s} value={s === 'All States' ? 'All states' : s}>
              {s === 'All States' ? 'All states' : s}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by eligibility fit"
          value={fitFilter}
          onChange={e => setFitFilter(e.target.value)}
        >
          <option value="all">All eligibility fits</option>
          <option value="potential">Potential matches only</option>
        </select>

        <select
          aria-label="Sort schemes"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="recommended">Default order</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="match">Highest potential fit</option>
          <option value="category">Category</option>
          <option value="deadline">Earliest deadline</option>
        </select>

        <button className="outline-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className="result-count">
        {filtered.length} scheme{filtered.length !== 1 ? 's' : ''} shown
        {(exploreQuery || exploreCategory !== 'All categories' || exploreState !== 'All states') && (
          <span className="filter-active-note"> · Filters active</span>
        )}
        {' '}<span>DEMO DATA · VERIFY OFFICIAL DETAILS</span>
      </div>

      <div className="scheme-grid">
        {paginatedSchemes.map(scheme => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            saved={saved.includes(scheme.id)}
            onSave={() => toggleSave(scheme.id)}
            onOpen={() => {
              setDetailScheme(scheme);
            }}
            onApply={() => applyScheme(scheme.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && !apiLoading && (
        <Empty
          title="No matching schemes"
          text="Try a different keyword, clear the category or state filter."
          action="Reset filters"
          onAction={resetFilters}
        />
      )}

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="pagination-row">
          <button
            className="outline-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              // Show pages around current page
              const start = Math.max(1, currentPage - 2);
              const page = start + i;
              if (page > pageCount) return null;
              return (
                <button
                  key={page}
                  className={`page-num ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <span className="page-info">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </span>

          <button
            className="outline-btn"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
