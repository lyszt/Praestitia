import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import "@fontsource/inter"
import './App.css'
import theme from './theme'
import AuthenticationPage from './pages/authentication/';
import Dashboard from './pages/dashboard';

function App() {
  const [isAuth, setAuth] = useState(() => {
    // Verifica se o token existe no localStorage ao inicializar
    return !!localStorage.getItem('token_acesso')
  });


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuth && <AuthenticationPage setAuth={setAuth} />}
      {isAuth && <Dashboard setAuth={setAuth} />}
    </ThemeProvider>
  )
}

export default App
