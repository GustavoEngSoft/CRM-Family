import React from 'react';
import './login.css';

function Login() {
	return (
		<div className="login-page">
			<div className="login-card">
				<img src="/logoIgreja.png" alt="CRM Family Logo" className='logoIgreja' />
				<form className="login-form">
					<input
						className="login-input"
						type="email"
						placeholder="Email"
						aria-label="Email"
					/>
					<input
						className="login-input"
						type="password"
						placeholder="Senha"
						aria-label="Senha"
					/>
					<button className="login-button" type="submit">
						Confirmar
					</button>
				</form>
				<button className="login-forgot" type="button">
					Esqueceu a senha?
				</button>
			</div>
		</div>
	);
}

export default Login;
