import { getApiBaseUrl, setToken } from '../../utils/api'

// Registra novo usuário e faz login automático
async function sendRegisterData(username, password, email) {
    const payload = { username: username || '', password: password || '', email: email || '' }
    try {
        // Envia requisição POST para endpoint de registro
        const res = await fetch(`${getApiBaseUrl()}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        let data = null
        try { data = await res.json() } catch (e) { data = null }

        if (!res.ok) {
            if (res.status >= 500 && res.status < 600) {
                return { success: false, status: res.status, message: 'Estamos tendo dificuldades. Falha na conexão.' };
            }

            // Se o erro não for interno, manda a mensagem do servidor
            const serverMsg = data?.body || 'Erro ao registrar.'
            return { success: false, status: res.status, message: String(serverMsg) }
        }

        // Armazena token (login automático após registro)
        const token = data?.token || null
        if (token) {
            setToken(token)
        }
        return { success: true, token }
    } catch (err) {
        // Captura falhas de conexão
        console.error('Erro de rede:', err)
        return { success: false, message: 'Estamos tendo dificuldades. Falha na conexão.' }
    }
}

export { sendRegisterData };