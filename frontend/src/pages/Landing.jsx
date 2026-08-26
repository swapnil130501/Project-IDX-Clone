import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import GridBackdrop from '../components/atoms/GridBackdrop/GridBackdrop';
import LandingHeader from '../components/organisms/Landing/LandingHeader';
import LandingHero from '../components/organisms/Landing/LandingHero';
import FeatureHighlights from '../components/organisms/Landing/FeatureHighlights';
import CreatingWorkspace from '../components/organisms/Landing/CreatingWorkspace';
import useCreateProject from '../hooks/apis/mutations/useCreateProject';

function Landing() {
    const navigate = useNavigate();
    const { createProjectMutation } = useCreateProject();
    const reduceMotion = useReducedMotion();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    async function handleCreateProject() {
        setError(null);
        setIsCreating(true);
        try {
            const response = await createProjectMutation();
            navigate(`/project/${response.data}`);
        } catch {
            setIsCreating(false);
            setError("Couldn't create a project. Try again.");
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-base text-ink">
            <GridBackdrop />
            <AnimatePresence mode="wait" initial={false}>
                {isCreating ? (
                    <CreatingWorkspace key="creating" />
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    >
                        <LandingHeader onCta={handleCreateProject} />
                        <LandingHero onCta={handleCreateProject} error={error} />
                        <FeatureHighlights />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default Landing;
