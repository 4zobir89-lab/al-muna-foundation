import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={
            <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center" dir="rtl">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-[#292524] border-t-[#EA580C] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#A8A29E] font-tajawal text-sm">جاري التحميل...</p>
              </div>
            </div>
          }>
            <App />
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
