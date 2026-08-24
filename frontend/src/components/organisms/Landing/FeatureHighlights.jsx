const FEATURES = [
    {
        title: 'Instant workspaces',
        body: 'Spin up a ready-to-run project in seconds. No installs, no config files to babysit.',
    },
    {
        title: 'A real editor',
        body: 'Monaco with syntax highlighting, a live file tree, and a terminal wired to your project.',
    },
    {
        title: 'Live preview',
        body: 'Your app renders beside your code and reloads as you save.',
    },
];

function FeatureHighlights() {
    return (
        <section className="relative z-10 px-6 pb-24 sm:px-10">
            <div className="grid gap-4 sm:grid-cols-3 max-w-5xl">
                {FEATURES.map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-card border border-line bg-surface/70 p-5 transition-colors duration-200 hover:border-line-strong"
                    >
                        <h3 className="font-ui text-[15px] font-semibold text-ink">
                            {feature.title}
                        </h3>
                        <p className="mt-2 font-ui text-[13.5px] leading-[1.55] text-ink-dim">
                            {feature.body}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeatureHighlights;
