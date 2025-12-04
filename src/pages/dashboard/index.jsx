import React, { useState } from 'react'
import Navigator from '../../components/navigator'
import Clientes from './clientes'
import Leads from './leads'

export default function Dashboard ({ setAuth }) {
    const [currentPage, setCurrentPage] = useState('cliente');

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <Navigator currentPage={currentPage} onNavigate={handleNavigate}>
            {currentPage === 'cliente' && <Clientes />}
            {currentPage === 'lead' && <Leads />}
        </Navigator>
    );
}