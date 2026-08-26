import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NimbusMark({ href, compact = false }) {
    const mark = (
        <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            <span
                className={`font-ui font-semibold tracking-[-0.01em] text-ink ${compact ? 'text-[13px]' : 'text-[15px]'}`}
            >
                Nimbus
            </span>
        </span>
    );

    if (!href) return mark;

    return (
        <Link
            to={href}
            className="inline-flex items-center rounded-chip outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
            {mark}
        </Link>
    );
}

NimbusMark.propTypes = {
    href: PropTypes.string,
    compact: PropTypes.bool,
};

export default NimbusMark;
