import PropTypes from 'prop-types';

function GridBackdrop({ className = '' }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{
                backgroundImage: [
                    'linear-gradient(to right, var(--color-grid) 1px, transparent 1px)',
                    'linear-gradient(to bottom, var(--color-grid) 1px, transparent 1px)',
                    'linear-gradient(to right, var(--color-grid-major) 1px, transparent 1px)',
                    'linear-gradient(to bottom, var(--color-grid-major) 1px, transparent 1px)',
                ].join(','),
                backgroundSize: '28px 28px, 28px 28px, 140px 140px, 140px 140px',
                maskImage:
                    'radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 100%)',
                WebkitMaskImage:
                    'radial-gradient(120% 90% at 50% 0%, #000 35%, transparent 100%)',
            }}
        />
    );
}

GridBackdrop.propTypes = { className: PropTypes.string };

export default GridBackdrop;
