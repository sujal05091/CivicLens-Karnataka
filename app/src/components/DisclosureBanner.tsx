export default function DisclosureBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="disclosure-banner">
        Independent prototype • Synthetic civic data
      </p>
    );
  }

  return (
    <div className="disclosure-banner">
      <p>
        CivicLens is an independent prototype. Government routing, infrastructure/project
        records and case updates are simulated with synthetic data.
      </p>
    </div>
  );
}
