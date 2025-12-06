import { getApiBaseUrl, setToken } from '../../utils/api'

// Envia credenciais para a API e gerencia autenticação
async function sendLoginData(username, password) {
	// Monta payload com credenciais fornecidas
	const payload = { username: username || '', password: password || '' }
		try {
			// Faz requisição POST para endpoint de login
			const res = await fetch(`${getApiBaseUrl()}/auth/login/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})
			// Tenta parsear resposta JSON (retorna null se falhar)
			const data = await res.json().catch(() => null)
			
			// Trata erros da API
			if (!res.ok) {
				const serverMsg = data?.body || 'Erro no servidor.'
				// Erros 5xx: mensagem genérica de falha
				if (res.status >= 500 && res.status < 600) {
					return { success: false, status: res.status, message: 'Estamos tendo dificuldades. Falha na conexão.' }
				}
				// Outros erros: retorna mensagem do servidor
				return { success: false, status: res.status, message: String(serverMsg) }
			}
			
			// Armazena token no localStorage para manter sessão
			const token = data?.token || null
			if (token) {
				setToken(token)
			}
			return { success: true, token, username: data?.username }
		} catch (err) {
			// Captura erros de rede (conexão falhou)
			console.error('Erro de rede:', err)
			return { success: false, message: 'Estamos tendo dificuldades. Falha na conexão.' }
	}
}

export { sendLoginData };