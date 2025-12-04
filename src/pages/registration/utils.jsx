import { getApiBaseUrl, setToken } from '../../utils/api'

async function sendRegisterData(username, password, email) {
    const payload = { username: username || '', password: password || '', email: email || '' }
    try {
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

        const token = data?.token || null
        if (token) {
            setToken(token)
        }
        return { success: true, token }
    } catch (err) {
        console.error('Erro de rede:', err)
        return { success: false, message: 'Estamos tendo dificuldades. Falha na conexão.' }
    }
}

export { sendRegisterData };