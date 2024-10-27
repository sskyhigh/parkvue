// import statements here
import {BrowserRouter} from "react-router-dom";
import {createRoot} from 'react-dom/client';
import ContextProvider from './context/ContextProvider';
import App from "./App";

// Wrap your app with the provider using createRoot
createRoot(document.getElementById('root')).render(
    <ContextProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </ContextProvider>
);

