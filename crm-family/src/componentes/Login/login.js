import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './login.css';

function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		if (!email || !senha) {
			setError('Por favor, preencha todos os campos');
			setLoading(false);
			return;
		}

		const result = await login(email, senha);

		if (result.success) {
			navigate('/dashboard');
		} else {
			setError(result.error || 'Erro ao fazer login');
		}

		setLoading(false);
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<img src="/logoIgreja.png" alt="CRM Family Logo" className='logoIgreja' />
				<form className="login-form" onSubmit={handleSubmit}>
					{error && <div className="login-error">{error}</div>}
					<input
						className="login-input"
						type="email"
						placeholder="Email"
						aria-label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
					/>
					<input
						className="login-input"
						type="password"
						placeholder="Senha"
						aria-label="Senha"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						disabled={loading}
					/>
					<button className="login-button" type="submit" disabled={loading}>
						{loading ? 'Entrando...' : 'Confirmar'}
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
