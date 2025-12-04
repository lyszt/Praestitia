import { getApiBaseUrl, setToken } from '../../utils/api'

async function sendLoginData(username, password) {
	const payload = { username: username || '', password: password || '' }
		try {
			const res = await fetch(`${getApiBaseUrl()}/auth/login/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})
			const data = await res.json().catch(() => null)
			if (!res.ok) {
				const serverMsg = data?.body || 'Erro no servidor.'
				if (res.status >= 500 && res.status < 600) {
					return { success: false, status: res.status, message: 'Estamos tendo dificuldades. Falha na conexão.' }
				}
				return { success: false, status: res.status, message: String(serverMsg) }
			}
			const token = data?.token || null
			if (token) {
				setToken(token)
			}
			return { success: true, token, username: data?.username }
		} catch (err) {
			console.error('Erro de rede:', err)
			return { success: false, message: 'Estamos tendo dificuldades. Falha na conexão.' }
	}
}

export { sendLoginData };