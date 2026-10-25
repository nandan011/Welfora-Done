// Layout: Multi-page SPA shared layout shell using <Outlet /> for nested routing
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SchemeModal from './SchemeModal';
import { useWelfora } from '../context/WelforaContext';

export default function Layout() {
  const location = useLocation();
  const {
    dark,
    selectedScheme,
    setSelectedScheme,
    saved,
    toggleSave,
    applyScheme,
    toast,
    toastType,
  } = useWelfora();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className={`wf ${dark ? 'dark' : 'light'}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Persistent SPA Sidebar */}
      <Sidebar />

      <main className="main" id="main-content" tabIndex={-1}>
        {/* Persistent SPA Topbar */}
        <Topbar />

        {/* Suspense: Fallback UI while lazy-loaded route chunks are fetched */}
        <Suspense
          fallback={
            <div className="page-content" style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
              <div className="api-status-banner">
                <span className="loading-dots"><span /><span /><span /></span>
                Loading page content…
              </div>
            </div>
          }
        >
          {/* Outlet: React Router renders matched child route components here */}
          <Outlet />
        </Suspense>

        <footer className="main-footer">
          <span>WELFORA © 2026</span>
          <span>
            Making public welfare transparent, accessible, and dignified for every citizen. <b>✦</b>
          </span>
          <span>Citizen Welfare Navigator</span>
        </footer>
      </main>

      {/* Global Quick Preview Modal */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          isSaved={saved.includes(selectedScheme.id)}
          onSave={() => toggleSave(selectedScheme.id)}
          onApply={() => applyScheme(selectedScheme.id)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className={`toast toast-${toastType}`}
        >
          {toast}
        </aside>
      )}
    </div>
  );
}
