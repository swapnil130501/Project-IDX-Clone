import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ProjectPlayground from "./pages/ProjectPlayground";

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/project/:projectId" element={<ProjectPlayground />} />
        </Routes>
    );
}