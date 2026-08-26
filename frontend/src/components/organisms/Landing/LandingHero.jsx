import PropTypes from 'prop-types';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NimbusButton from '../../atoms/NimbusButton/NimbusButton';

function LandingHero({ onCta, error }) {
    const reduceMotion = useReducedMotion();

    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 },
        },
    };
    const item = {
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 flex flex-col items-start px-6 pt-24 pb-28 sm:px-10 sm:pt-32 sm:pb-36 max-w-3xl"
        >
            <motion.h1
                variants={item}
                className="font-ui text-[38px] sm:text-[56px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
            >
                Nimbus
            </motion.h1>

            <motion.p
                variants={item}
                className="mt-5 max-w-[34rem] font-ui text-[18px] leading-[1.55] text-ink-dim"
            >
                A full development environment in your browser. Open a project, edit,
                run, and preview — no local setup, no waiting.
            </motion.p>

            <motion.div variants={item} className="mt-9">
                <NimbusButton onClick={onCta}>Start building →</NimbusButton>
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                        className="mt-3 font-ui text-[13.5px] text-danger"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

LandingHero.propTypes = {
    onCta: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default LandingHero;
