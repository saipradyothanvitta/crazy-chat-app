// Import the main libraries from the react packages
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main App component and any global styles you have
import './App.css';
import App from './App';

// 1. Find the div with the id of 'root' in your public/index.html file
const rootElement = document.getElementById('root');

// 2. Tell React that this element will be the root of your application
const root = ReactDOM.createRoot(rootElement);

// 3. Render your main App component inside that root element, bringing your UI to life
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);