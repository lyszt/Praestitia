import React, { useState } from 'react'
import Navigator from '../../components/navigator'
import { removeToken } from '../../utils/api'
import DashboardStats from './stats'
import Clientes from './clientes'
import Leads from './leads'

export default function Dashboard ({ setAuth }) {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const handleNavigate = (page) => {
        if (page === 'logout') {
            removeToken()
            setAuth(false)
            return
        }

        setCurrentPage(page);
    };

    return (
        <Navigator currentPage={currentPage} setAuth={setAuth} onNavigate={handleNavigate}>
            {currentPage === 'dashboard' && <DashboardStats />}
            {currentPage === 'cliente' && <Clientes />}
            {currentPage === 'lead' && <Leads />}
        </Navigator>
    );
}