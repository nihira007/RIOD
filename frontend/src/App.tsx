import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import Literature from "./pages/Literature";
import PaperDetails from "./pages/PaperDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/literature" element={<Literature />} />
            <Route path="/paper/:id" element={<PaperDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
