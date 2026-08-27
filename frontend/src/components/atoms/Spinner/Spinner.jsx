import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';

const SIZES = {
    sm: 'h-4 w-4 border',
    md: 'h-8 w-8 border-2',
};

function Spinner({ size = 'md', className = '' }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.span
            aria-hidden="true"
            className={`rounded-full border-line-strong border-t-accent ${SIZES[size]} ${className}`}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={
                reduceMotion
                    ? undefined
                    : { duration: 0.8, repeat: Infinity, ease: 'linear' }
            }
        />
    );
}

Spinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md']),
    className: PropTypes.string,
};

export default Spinner;
