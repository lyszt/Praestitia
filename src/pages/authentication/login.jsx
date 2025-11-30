import React, { useState, useRef, useEffect } from 'react'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login';
import FlareOutlinedIcon from '@mui/icons-material/FlareOutlined';

import { sendLoginData } from './utils'

export default function LoginForm({setShowRegister, showRegister}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setErrorMessage('')
		const res = await sendLoginData(username, password)
		if (!res?.success) {
			setErrorMessage(res?.message || 'Erro desconhecido')
			return res
		}
		if (res?.token) {
			localStorage.setItem('token_acesso', res.token)
			window.location.assign('/dashboard')
		}
		return res
	}

    const renderRegisterScreen = () => {
        setShowRegister(true)
    }

    return (    
    <div className="w-[60%] h-[70%] flex
			 flex-row items-center 
			justify-center
			bg-gradient-to-r 
			from-zinc-950
			to-black
			border
			border-zinc-900
			text-zinc-200 rounded-xl">
				<div className="w-1/2 
				bg-emerald-700
				 h-full
				 items-start
				 gap-2
				 justify-center
				 flex flex-col
				p-10">

					<h2 className="text-2xl font-bold">Potencialize sua gestão</h2>
					<br/>
					<p className="text-sm">
						O Praestitia reúne em um único ambiente os 
						recursos essenciais para organizar, acompanhar e 
						otimizar cada etapa da sua operação. Ao acessar sua conta, 
						você encontra ferramentas que fortalecem a tomada de decisão,
						agilizam rotinas e ampliam a eficiência do seu trabalho. 
						Conecte-se para aproveitar uma gestão mais integrada, segura e inteligente.
					</p>
					<br/>
					
				</div>
				<form className="flex-col 
				 flex w-1/2 justify-center
				 h-full
				 items-left p-10" onSubmit={handleSubmit}>
					<span className="text-xl font-bold">Acesse sua conta</span>
					<TextField
						label="Usuário"
						value={username}
						onChange={(e) => { setUsername(e.target.value); setErrorMessage('') }}
						style={{ fontSize: '1em' }}
						margin="normal"
						variant="outlined"
					/>
					<TextField
						label="Senha"
						value={password}
						onChange={(e) => { setPassword(e.target.value); setErrorMessage('') }}
						type="password"
						style={{ fontSize: '1em' }}
						margin="normal"
						variant="outlined"
					/>
					<div className='flex items-center justify-center gap-1 mt-3'>
						<Button 
						variant="contained" 
						color="primary" 
						className="rounded-md p-2 w-1/3"
						type="submit"
						startIcon={<LoginIcon/>}>
							Entrar
						</Button>

						<Button variant="contained" 
						color="primary" 
						className="rounded-md p-2" 
						onClick={renderRegisterScreen}
						startIcon={<FlareOutlinedIcon/>}
						>
								Cadastrar-se
						</Button>
						
					</div>
					{errorMessage && <span className="text-sm mt-4 text-red-400 font-medium">{errorMessage}</span>}
				</form>
            </div>
    )
}