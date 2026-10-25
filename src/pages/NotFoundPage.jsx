import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';

export default function NotFoundPage() {
  return (
    <section className="page-content">
      <PageTitle
        eyebrow="404 · PAGE NOT FOUND"
        title="This page does not exist."
        subtitle="Use the dashboard to get back to your Welfora workspace."
      />
      {/* Declarative Link back to home */}
      <Link to="/" className="primary-btn" style={{ textDecoration: 'none' }}>
        Back to dashboard →
      </Link>
    </section>
  );
}
