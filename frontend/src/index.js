import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './styles/global.css';
import './styles/index.css';
import ScrollToTop from "./components/scroll/ScrollToTop";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);