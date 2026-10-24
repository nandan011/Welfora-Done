import ExplorePage from './ExplorePage';
import SavedSchemesPage from './SavedSchemesPage';
import DeadlinesPage from './DeadlinesPage';
import EligibilityPage from './EligibilityPage';
import AssistantPage from './AssistantPage';
import NotificationsPage from './NotificationsPage';
import ProfileSettingsPage from './ProfileSettingsPage';
import ProfilePage from './ProfilePage';
import AboutPage from './AboutPage';
import NotFoundPage from './NotFoundPage';
import FindSchemesPage from './FindSchemesPage';

export default function PageViews({ page, go }) {
  switch (page) {
    case 'Explore Schemes':
      return <ExplorePage isRecommended={false} />;

    case 'Recommended':
      return <ExplorePage isRecommended={true} />;

    case 'Find My Schemes':
      return <FindSchemesPage />;

    case 'Saved Schemes':
      return <SavedSchemesPage go={go} />;

    case 'Deadlines':
      return <DeadlinesPage go={go} />;

    case 'Eligibility Guide':
      return <EligibilityPage />;

    case 'AI Assistant':
      return <AssistantPage />;

    case 'Notifications':
      return <NotificationsPage />;

    case 'Profile':
      return <ProfilePage go={go} />;

    case 'Settings':
      return <ProfileSettingsPage title="Settings" go={go} />;

    case 'About Us':
      return <AboutPage />;

    case 'Not Found':
      return <NotFoundPage go={go} />;

    default:
      return null;
  }
}
