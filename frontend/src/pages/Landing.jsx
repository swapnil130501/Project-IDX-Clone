import { useNavigate } from 'react-router-dom';
import GridBackdrop from '../components/atoms/GridBackdrop/GridBackdrop';
import LandingHeader from '../components/organisms/Landing/LandingHeader';
import LandingHero from '../components/organisms/Landing/LandingHero';
import FeatureHighlights from '../components/organisms/Landing/FeatureHighlights';

function Landing() {
    const navigate = useNavigate();

    function goToNewProject() {
        navigate('/new');
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-base text-ink">
            <GridBackdrop />
            <LandingHeader onCta={goToNewProject} />
            <LandingHero onCta={goToNewProject} />
            <FeatureHighlights />
        </main>
    );
}

export default Landing;
