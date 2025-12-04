// Utilitários para gerenciamento de API e token de autenticação

const API_BASE_URL = 'http://127.0.0.1:5000'

export function getToken() {
    /**
     * Retorna o token de autenticação armazenado no localStorage
     */
    return localStorage.getItem('token_acesso')
}


export function setToken(token) {
    /**
     * Armazena o token de autenticação no localStorage
     */
    if (token) {
        localStorage.setItem('token_acesso', token)
    }
}

export function removeToken() {
    /**
     * Remove o token de autenticação do localStorage (logout)
     */
    localStorage.removeItem('token_acesso')
}


export function isAuthenticated() {
    /**
     * Verifica se o usuário está autenticado (tem token válido)
     */
    return !!getToken()
}


export async function authenticatedFetch(endpoint, options = {}) {
    /**
     * Faz uma requisição autenticada à API
     * endpoint - Endpoint da API (ex: '/api/users')
     * options - Opções do fetch (method, body, headers, etc.)
     */
    const token = getToken()
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

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


export function getApiBaseUrl() {
    /**
     * Retorna a URL base da API
     */
    return API_BASE_URL
}
