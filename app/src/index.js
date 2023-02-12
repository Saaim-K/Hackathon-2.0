import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContextWrapper } from './Context/Context';
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextWrapper>
      <Router>
        <App />
      </Router>
    </ContextWrapper>
  </React.StrictMode>
);