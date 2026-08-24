import PropTypes from 'prop-types';
import NimbusButton from '../../atoms/NimbusButton/NimbusButton';

function LandingHeader({ onCta }) {
    return (
        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
            <div className="flex items-center gap-2.5">
                <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-accent"
                />
                <span className="font-ui text-[15px] font-semibold tracking-[-0.01em] text-ink">
                    Nimbus
                </span>
            </div>
            <NimbusButton variant="ghost" onClick={onCta}>
                New project
            </NimbusButton>
        </header>
    );
}

LandingHeader.propTypes = { onCta: PropTypes.func.isRequired };

export default LandingHeader;
