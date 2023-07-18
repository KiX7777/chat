import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Stores/store.tsx';
import './i18n';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryFallback from './Components/ErrorBoundaryFallback.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ErrorBoundary
          FallbackComponent={ErrorBoundaryFallback}
          onReset={() => window.location.replace('/')}
        >
          <App />
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
