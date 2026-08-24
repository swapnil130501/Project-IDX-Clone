import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';

function EditorTab({ label, isActive, onClick, onClose }) {
    const reduceMotion = useReducedMotion();

    function handleClose(e) {
        e.stopPropagation();
        onClose();
    }

    return (
        <motion.div
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0"
        >
            <div
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                    }
                }}
                className={`group flex h-8 cursor-pointer select-none items-center gap-2 border-r border-line pl-3 pr-2 font-mono text-[12.5px] leading-none transition-colors duration-150 ${
                    isActive
                        ? 'bg-surface text-ink'
                        : 'bg-base text-ink-faint hover:bg-hover hover:text-ink-dim'
                }`}
            >
                <span className="truncate max-w-[14rem]">{label}</span>

                <button
                    type="button"
                    aria-label={`Close ${label}`}
                    onClick={handleClose}
                    className={`flex h-4 w-4 items-center justify-center rounded-chip border-none bg-transparent text-[13px] leading-none text-ink-faint transition-opacity duration-150 hover:bg-elevated hover:text-ink focus-visible:opacity-100 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                    ×
                </button>
            </div>

            {isActive && (
                <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 480, damping: 38 }
                    }
                />
            )}
        </motion.div>
    );
}

EditorTab.propTypes = {
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditorTab;
