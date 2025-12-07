// Utilitários para gerenciamento de API e token de autenticação

const API_BASE_URL = 'http://127.0.0.1:5000'

// Recupera token JWT do localStorage
export function getToken() {
    return localStorage.getItem('token_acesso')
}

// Armazena token JWT no localStorage (mantém sessão ativa)
export function setToken(token) {
    if (token) {
        localStorage.setItem('token_acesso', token)
    }
}

// Remove token do localStorage (efetua logout)
export function removeToken() {
    localStorage.removeItem('token_acesso')
}

// Verifica se usuário está autenticado (usa !! para converter em boolean)
export function isAuthenticated() {
    return !!getToken()
}

// Faz requisição HTTP autenticada adicionando token no header Authorization
export async function authenticatedFetch(endpoint, options = {}) {
    const token = getToken()
    
    // Monta headers com Content-Type padrão e mescla com headers customizados
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    }

    // Adiciona Token Knox se usuário estiver autenticado
    // Knox espera o formato "Token <token>" ao invés de "Bearer <token>"
    if (token) {
        headers['Authorization'] = `Token ${token}`
    }

    // Constrói URL completa (suporta paths relativos e URLs absolutas)
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

    try {
        const response = await fetch(url, {
            ...options,
            headers
        })

        return response
    } catch (error) {
        console.error('Erro na requisição autenticada:', error)
        throw error
    }
}

// Retorna URL base da API (centralizando configuração)
export function getApiBaseUrl() {
    return API_BASE_URL
}
