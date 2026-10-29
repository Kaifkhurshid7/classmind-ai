import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConfirmProvider } from './components/Modal';
import { RoleProvider } from './context/RoleContext';
import { ToastProvider } from './context/ToastContext';
import './styles/style.css';
import './styles/footer-pages.css';
import './styles/analytics.css';
import './styles/home.css';
import './styles/select.css';
import './styles/responsive.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RoleProvider>
          <ToastProvider>
            <ConfirmProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </ConfirmProvider>
          </ToastProvider>
        </RoleProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
