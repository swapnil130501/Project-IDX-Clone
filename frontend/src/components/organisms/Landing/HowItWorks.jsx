const STEPS = [
    {
        n: '01',
        title: 'Create',
        body: 'Spin up a project in seconds — no installs, no setup screens.',
    },
    {
        n: '02',
        title: 'Edit',
        body: 'A real Monaco editor with syntax highlighting and a live file tree.',
    },
    {
        n: '03',
        title: 'Run',
        body: 'A terminal wired straight into your container. Run anything you would locally.',
    },
    {
        n: '04',
        title: 'Preview',
        body: 'Your app renders beside your code and reloads the moment you save.',
    },
];

function HowItWorks() {
    return (
        <section className="relative z-10 px-6 pt-4 pb-24 sm:px-10 sm:pt-8">
            <div>
                <h2 className="font-ui text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[32px]">
                    From nothing to running, in four steps.
                </h2>

                <ol className="mt-10 grid list-none gap-x-6 gap-y-8 pl-0 sm:grid-cols-4">
                    {STEPS.map((step) => (
                        <li key={step.n}>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[13px] text-ink-dim">
                                    {step.n}
                                </span>
                                <span className="h-px flex-1 bg-line" aria-hidden="true" />
                            </div>
                            <h3 className="mt-3 font-ui text-[15px] font-semibold text-ink">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 font-ui text-[13.5px] leading-[1.55] text-ink-dim">
                                {step.body}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export default HowItWorks;
