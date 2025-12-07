import React, { useState, useEffect } from 'react'
import Navigator from '../../components/navigator'
import { removeToken, authenticatedFetch } from '../../utils/api'
import DashboardStats from './stats'
import Clientes from './clientes'
import Concorrentes from './concorrentes'
import Leads from './leads'

export default function Dashboard({ setAuth }) {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const handleNavigate = (page) => {
        if (page === 'logout') {
            removeToken()
            setAuth(false)
            return
        }

        setCurrentPage(page);
    };

    // O projeto está usando Knox, que é uma 
    // Ferramenta provida por biblioteca/pelo Django
    // E é mais seguro/mais fácil de configurar
        const checkAuth = async () => {
            try {
                const response = await authenticatedFetch('/auth/validate/', {
                    method: 'POST'
                });

                // Se retornar 401 ou outro erro, faz logout
                if (response.status === 401) {
                    removeToken()
                    setAuth(false)
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error)
            }
        };

        // Executa imediatamente
        checkAuth();

        // Configura intervalo de 10 segundos
        const intervalId = setInterval(checkAuth, 10000);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(intervalId);
    }, [setAuth]);

    return (
        <Navigator currentPage={currentPage} setAuth={setAuth} onNavigate={handleNavigate}>
            {currentPage === 'dashboard' && <DashboardStats />}
            {currentPage === 'cliente' && <Clientes />}
            {currentPage === 'lead' && <Leads />}
            {currentPage === 'concorrente' && <Concorrentes />}
        </Navigator>
    );
}