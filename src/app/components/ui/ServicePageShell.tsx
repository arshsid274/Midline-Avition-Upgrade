interface ServiceFeature {
  title: string;
  description: string;
}

interface ServicePageShellProps {
  title: string;
  description: string;
  features: ServiceFeature[];
  columns?: 2 | 3;
}

const gridClassByColumnCount = {
  2: "feature-grid md:grid-cols-2",
  3: "feature-grid md:grid-cols-2 xl:grid-cols-3",
} as const;

export default function ServicePageShell({
  title,
  description,
  features,
  columns = 3,
}: ServicePageShellProps) {
  return (
    <main className="midline-page">
      <section className="midline-section">
        <div className="midline-shell">
          <div className="border border-inverse-surface-1 bg-inverse-canvas px-6 py-10 text-white sm:px-8 md:px-10 md:py-12">
            <p className="text-sm text-inverse-ink-muted">Aviation Services</p>
            <h1 className="mt-3 text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-inverse-ink-muted sm:text-lg">{description}</p>
          </div>

          <section className={`${gridClassByColumnCount[columns]} mt-8 sm:mt-10`}>
            {features.map((feature) => (
              <article
                key={feature.title}
                className="midline-card h-full p-5 sm:p-6"
              >
                <h2 className="text-lg font-normal text-ink sm:text-xl">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">{feature.description}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
