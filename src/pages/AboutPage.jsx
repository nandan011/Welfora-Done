import PageTitle from '../components/PageTitle';

export default function AboutPage() {
  return (
    <section className="page-content">
      <PageTitle
        eyebrow="OUR MISSION"
        title="Welfare benefits should be simple, transparent & accessible to everyone."
        subtitle="Welfora bridges the gap between citizens and government support by transforming complex policy documentation into clear, actionable guidance."
      />

      <div className="about-grid">
        <div className="panel">
          <div className="about-symbol">🔍</div>
          <h2>1. Discover</h2>
          <p>
            Explore tailored schemes across education, healthcare, agriculture, housing, and social security based on your personal eligibility.
          </p>
        </div>

        <div className="panel">
          <div className="about-symbol">📖</div>
          <h2>2. Understand</h2>
          <p>
            Plain-language summaries, clear document checklists, and transparent eligibility criteria with zero bureaucratic jargon.
          </p>
        </div>

        <div className="panel">
          <div className="about-symbol">🎯</div>
          <h2>3. Apply Confidently</h2>
          <p>
            Direct links to official portals, deadline reminders, and an interactive application tracker to keep your progress organized.
          </p>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '17.5px' }}>🔒 Privacy-First by Design</h3>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6 }}>
            Your eligibility data, preferences, and saved notes remain stored on your local device. We never sell citizen data or act as an unauthorized intermediary.
          </p>
        </div>
        <div style={{ flex: '1 1 280px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '17.5px' }}>🇮🇳 Verified Government Sources</h3>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6 }}>
            Every scheme links out to official ministry portals (MyScheme, NSP, PM-JAY, PM-Kisan) for official verification and portal submissions.
          </p>
        </div>
      </div>

      <p className="disclaimer">
        Welfora is an independent digital navigator designed for citizen benefit awareness. Information is illustrative and should always be verified on the official department portals.
      </p>
    </section>
  );
}
