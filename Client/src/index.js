import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"; import {BrowserRouter as Router} from "react-router-dom";
import { createRoot } from 'react-dom/Client'; //New way to hook into div with root id; when using react 18
import ContextProvider from './context/ContextProvider'

//wrap our app with this provider
createRoot(document.getElementById('root')).render( //New way to render the app application
    <ContextProvider>
        <App />
    </ContextProvider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <App/>
        </Router>
    </React.StrictMode>,
);
