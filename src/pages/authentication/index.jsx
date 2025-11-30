import React, { useState } from 'react'

import LoginForm from "./login"
import RegisterScreen from "../registration"

export default function AuthenticationPage() {
	
	
	const [showRegister, setShowRegister] = useState(false)

	const renderRegisterScreen = () => {
		setShowRegister(true)
	}

	return (
		<main className="login-page flex bg-black w-screen h-screen flex-row justify-center items-center">
            
			{showRegister ? (
				<RegisterScreen setShowRegister={setShowRegister} showRegister={showRegister}/>	
			) : (
				<LoginForm setShowRegister={setShowRegister} showRegister={showRegister}/>
			)
			}
		</main>
	)
}
