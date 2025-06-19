// File: cloud_storage/frontend/src/main.tsx
import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
// import { store } from './store/store';

console.log('Document body:', document.body.innerHTML);
console.log('Root element:', document.getElementById('root'));

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      {/* <Provider store={store}> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </Provider> */}
    </StrictMode>
  );
} else {
  console.error('Root element not found! Check index.html');
}
