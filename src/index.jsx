/* @refresh reload */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>
)
