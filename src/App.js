import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './utils/theme';
import AppRoutes from './app/routes/AppRoutes';


function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeModeProvider>
  );
}


export default App;

