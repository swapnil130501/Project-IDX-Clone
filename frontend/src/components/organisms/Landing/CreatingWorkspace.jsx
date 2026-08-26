import { motion, useReducedMotion } from 'motion/react';

function CreatingWorkspace() {
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-start gap-4 px-6 pt-24 pb-28 sm:px-10 sm:pt-32 sm:pb-36 max-w-3xl"
        >
            <motion.span
                aria-hidden="true"
                className="h-8 w-8 rounded-full border-2 border-line-strong border-t-accent"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={
                    reduceMotion
                        ? undefined
                        : { duration: 0.8, repeat: Infinity, ease: 'linear' }
                }
            />
            <p className="font-ui text-[18px] leading-[1.55] text-ink-dim">
                Setting up your workspace…
            </p>
        </motion.section>
    );
}

export default CreatingWorkspace;
