// File: cloud_storage/frontend/src/main.tsx
import React from 'react';
// import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store/store';


const container = document.getElementById('root');
const rootElement = createRoot(container!);

if (rootElement) {
  rootElement.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
} else {
  console.error('Root element not found! Check index.html');
}
