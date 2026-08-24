import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'motion/react';
import { IoIosArrowForward } from 'react-icons/io';
import { FileIcon } from '../../atoms/FileIcon/FileIcon';

const ROW =
    'group flex w-full items-center gap-1.5 h-6 rounded-chip pr-2 cursor-pointer select-none text-left font-mono text-[13px] leading-none outline-none focus-visible:ring-1 focus-visible:ring-accent';

function TreeRow({
    depth,
    isFolder,
    isExpanded,
    name,
    extension,
    onClick,
    onContextMenu,
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onClick}
            onContextMenu={onContextMenu}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.045)' }}
            whileTap={reduceMotion ? undefined : { scale: 0.995 }}
            transition={{ duration: 0.12 }}
            style={{
                paddingLeft: `${6 + depth * 14}px`,
                backgroundColor: 'rgba(255,255,255,0)',
                border: 'none',
            }}
            className={`${ROW} ${
                isFolder && isExpanded ? 'text-ink' : 'text-ink-dim'
            } hover:text-ink`}
        >
            {isFolder ? (
                <motion.span
                    aria-hidden="true"
                    className="flex h-3.5 w-3.5 items-center justify-center text-ink-faint group-hover:text-ink-dim"
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    initial={false}
                    transition={
                        reduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 500, damping: 34 }
                    }
                >
                    <IoIosArrowForward size={13} />
                </motion.span>
            ) : (
                <span className="flex h-3.5 w-3.5 items-center justify-center">
                    <FileIcon extension={extension} compact />
                </span>
            )}
            <span className="truncate">{name}</span>
        </motion.button>
    );
}

TreeRow.propTypes = {
    depth: PropTypes.number.isRequired,
    isFolder: PropTypes.bool.isRequired,
    isExpanded: PropTypes.bool,
    name: PropTypes.string.isRequired,
    extension: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired,
};

export default TreeRow;
