import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global styles thay vì index.css cũ - SỬA Ở ĐÂY
import './styles/main.css'; // Thay vì './styles/globals.css'
// XÓA: import './styles/utilities.css'; (vì đã được import trong main.css)

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();