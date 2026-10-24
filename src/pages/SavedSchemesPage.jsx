import PageTitle from '../components/PageTitle';
import SchemeCard from '../components/SchemeCard';
import Empty from '../components/Empty';
import { useWelfora } from '../context/WelforaContext';

export default function SavedSchemesPage({ go }) {
  const {
    schemes,
    saved,
    toggleSave,
    applyScheme,
    setSelectedScheme,
  } = useWelfora();

  const savedSchemes = schemes.filter(s => saved.includes(s.id));

  return (
    <section className="page-content">
      <PageTitle
        eyebrow="YOUR SHORTLIST"
        title="Saved schemes"
        subtitle="Keep useful opportunities together while you explore."
      />

      <div className="scheme-grid">
        {savedSchemes.map(scheme => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            saved
            onSave={() => toggleSave(scheme.id)}
            onOpen={() => setSelectedScheme(scheme)}
            onApply={() => applyScheme(scheme.id)}
          />
        ))}
      </div>

      {savedSchemes.length === 0 && (
        <Empty
          title="Nothing saved yet"
          text="Explore schemes and press the heart to save them here."
          action="Explore schemes"
          onAction={() => go('Explore Schemes')}
        />
      )}
    </section>
  );
}
