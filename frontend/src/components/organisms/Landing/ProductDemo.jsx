import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';
import TreeRow from '../../molecules/Tree/TreeRow';
import EditorTab from '../../atoms/EditorTab/EditorTab';

const CODE_LINES = [
    'export default function App() {',
    '  return (',
    '    <main className="hero">',
    '      <h1>Hello, Nimbus</h1>',
    '    </main>',
    '  );',
    '}',
];

const COMMAND = 'npm run dev';

const OUTPUT_LINES = [
    { text: '  VITE v6  ready in 312 ms', tone: 'text-ink-dim' },
    { text: '  ➔  Local:   http://localhost:5173/', tone: 'text-accent' },
    { text: '  ✓ live preview synced', tone: 'text-success' },
];

function useInViewOnce() {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref.current || inView) return undefined;
        if (typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [inView]);

    return [ref, inView];
}

function TypedCommand({ text, start, instant, onDone }) {
    const [shown, setShown] = useState(instant ? text : '');

    useEffect(() => {
        if (instant) {
            onDone?.();
            return undefined;
        }
        if (!start) return undefined;

        setShown('');
        let i = 0;
        const id = setInterval(() => {
            i += 1;
            setShown(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(id);
                onDone?.();
            }
        }, 45);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, instant]);

    return (
        <span>
            {shown}
            {!instant && start && shown.length < text.length && (
                <span className="ml-px inline-block h-[13px] w-[6px] -mb-px animate-pulse bg-ink-faint" />
            )}
        </span>
    );
}

TypedCommand.propTypes = {
    text: PropTypes.string.isRequired,
    start: PropTypes.bool,
    instant: PropTypes.bool,
    onDone: PropTypes.func,
};

function ProductDemo() {
    const reduceMotion = useReducedMotion();
    const [ref, inView] = useInViewOnce();
    const play = reduceMotion || inView;
    const [commandDone, setCommandDone] = useState(Boolean(reduceMotion));

    return (
        <section className="relative z-10 px-6 pb-24 sm:px-10">
            <div>
                <h2 className="mt-2 font-ui text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[32px]">
                    This is the actual editor. Not a screenshot of one.
                    <span
                        aria-hidden="true"
                        className="ml-1 inline-block h-[22px] w-[3px] align-middle bg-accent animate-pulse motion-reduce:animate-none sm:h-[26px]"
                    />
                </h2>

                <div
                    ref={ref}
                    className="mt-8 overflow-hidden rounded-card border border-line bg-surface"
                >
                    <div className="flex h-8 items-center justify-between border-b border-line px-3">
                        <span className="font-mono text-[12.5px] text-ink-dim">
                            nimbus · src/App.jsx
                        </span>
                        {commandDone && (
                            <motion.span
                                initial={reduceMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-1.5 font-mono text-[12.5px] text-ink-dim"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                running
                            </motion.span>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row">
                        <div className="hidden shrink-0 flex-col gap-0.5 border-r border-line bg-base py-2 sm:flex sm:w-40">
                            <TreeRow
                                depth={0}
                                isFolder
                                isExpanded
                                name="src"
                                onClick={() => {}}
                                onContextMenu={() => {}}
                            />
                            <TreeRow
                                depth={1}
                                isFolder={false}
                                isActive
                                name="App.jsx"
                                extension="jsx"
                                onClick={() => {}}
                                onContextMenu={() => {}}
                            />
                            <TreeRow
                                depth={1}
                                isFolder={false}
                                name="index.css"
                                extension="css"
                                onClick={() => {}}
                                onContextMenu={() => {}}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex border-b border-line">
                                <EditorTab
                                    label="App.jsx"
                                    isActive
                                    onClick={() => {}}
                                    onClose={() => {}}
                                />
                            </div>
                            <div className="px-4 py-3 font-mono text-[12.5px] leading-[1.7]">
                                {CODE_LINES.map((line, i) => (
                                    <motion.div
                                        key={line + i}
                                        initial={reduceMotion ? false : { opacity: 0, x: -4 }}
                                        animate={play ? { opacity: 1, x: 0 } : {}}
                                        transition={{
                                            duration: 0.3,
                                            delay: reduceMotion ? 0 : i * 0.07,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className={
                                            line.includes('Hello, Nimbus')
                                                ? 'text-ink'
                                                : 'text-ink-dim'
                                        }
                                    >
                                        {line || ' '}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-line bg-base px-4 py-3 font-mono text-[12.5px] leading-[1.7]">
                        <div className="text-ink-dim">
                            <span className="text-ink-dim">$ </span>
                            <TypedCommand
                                text={COMMAND}
                                start={play}
                                instant={reduceMotion}
                                onDone={() => setCommandDone(true)}
                            />
                        </div>
                        {commandDone &&
                            OUTPUT_LINES.map((line, i) => (
                                <motion.div
                                    key={line.text}
                                    initial={reduceMotion ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.25,
                                        delay: reduceMotion ? 0 : 0.15 + i * 0.12,
                                    }}
                                    className={line.tone}
                                >
                                    {line.text}
                                </motion.div>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDemo;
