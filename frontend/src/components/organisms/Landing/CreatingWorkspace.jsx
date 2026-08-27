import { motion, useReducedMotion } from 'motion/react';
import Spinner from '../../atoms/Spinner/Spinner';

function CreatingWorkspace() {
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto flex max-w-3xl flex-col items-start gap-4 px-6 pt-24 pb-28 sm:px-10 sm:pt-32 sm:pb-36"
        >
            <Spinner size="md" />
            <p className="font-ui text-[18px] leading-[1.55] text-ink-dim">
                Setting up your workspace…
            </p>
        </motion.section>
    );
}

export default CreatingWorkspace;
