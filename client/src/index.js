// import statements here
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import ContextProvider from './context/ContextProvider';
import App from "./App";

// Wrap your app with the provider using createRoot
createRoot(document.getElementById('root')).render(
    <ContextProvider>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                {/* Add more Route components here as needed */}
            </Routes>
        </Router>
    </ContextProvider>
);

