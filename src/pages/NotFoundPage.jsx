import PageTitle from '../components/PageTitle';

export default function NotFoundPage({ go }) {
  return (
    <section className="page-content">
      <PageTitle
        eyebrow="404 · PAGE NOT FOUND"
        title="This page does not exist."
        subtitle="Use the dashboard to get back to your Welfora workspace."
      />
      <button className="primary-btn" onClick={() => go('Dashboard')}>
        Back to dashboard →
      </button>
    </section>
  );
}
