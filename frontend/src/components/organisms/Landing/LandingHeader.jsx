import PropTypes from 'prop-types';
import NimbusButton from '../../atoms/NimbusButton/NimbusButton';
import NimbusMark from '../../atoms/NimbusMark/NimbusMark';

function LandingHeader({ onCta }) {
    return (
        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
            <NimbusMark />
            <NimbusButton variant="ghost" onClick={onCta}>
                New project
            </NimbusButton>
        </header>
    );
}

LandingHeader.propTypes = { onCta: PropTypes.func.isRequired };

export default LandingHeader;
