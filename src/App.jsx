import React, { useState, useEffect } from 'react'
import "@fontsource/inter"
import './App.css'
import AuthenticationPage from './pages/authentication/';
import Dashboard from './pages/dashboard';

function App() {
  const [isAuth, setAuth] = useState(() => {
    // Verifica se o token existe no localStorage ao inicializar
    return !!localStorage.getItem('token_acesso')
  });


  return (
    <>
     {!isAuth && <AuthenticationPage setAuth={setAuth} />}
     {isAuth && <Dashboard setAuth={setAuth} />}
    </>
  )
}

export default App
