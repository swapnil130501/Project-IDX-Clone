import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';

const VARIANTS = {
    primary:
        'bg-accent text-white border border-transparent hover:bg-accent-hover',
    ghost:
        'bg-transparent text-ink-dim border border-line hover:text-ink hover:border-line-strong',
};

function NimbusButton({ children, onClick, variant = 'primary', className = '' }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97, y: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={`font-ui text-[14px] font-medium leading-none rounded-chip px-4 py-2.5 cursor-pointer outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base ${VARIANTS[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
}

NimbusButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'ghost']),
    className: PropTypes.string,
};

export default NimbusButton;
