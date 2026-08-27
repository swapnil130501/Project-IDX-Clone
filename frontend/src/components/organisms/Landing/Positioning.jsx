const PRINCIPLES = [
    {
        title: 'No dashboard maze',
        body: 'One workspace, not a settings screen pretending to be a product.',
    },
    {
        title: 'No idle bloat',
        body: 'Every feature here earns its place. Nothing ships to pad a features page.',
    },
    {
        title: 'No waiting on infra',
        body: 'A container starts, and you are already typing.',
    },
];

function Positioning() {
    return (
        <section className="relative z-10 px-6 pt-4 pb-28 sm:px-10 sm:pt-8">
            <div>
                <h2 className="max-w-xl font-ui text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-ink sm:text-[32px]">
                    Lean by design, not by accident.
                </h2>
                <p className="mt-3 max-w-md font-ui text-[15px] leading-[1.6] text-ink-dim">
                    Nimbus is deliberately smaller than the hosted sandboxes it&rsquo;s
                    inspired by — Replit, CodeSandbox, Project IDX. Fewer knobs, less
                    chrome, a faster path from opening the page to a project that runs.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                    {PRINCIPLES.map((p) => (
                        <div key={p.title}>
                            <h3 className="font-ui text-[14px] font-semibold text-ink">
                                {p.title}
                            </h3>
                            <p className="mt-1.5 font-ui text-[13.5px] leading-[1.55] text-ink-dim">
                                {p.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Positioning;
