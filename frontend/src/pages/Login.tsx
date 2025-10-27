import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		
		try {
			const response = await fetch('http://localhost:8080/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ usernameOrEmail: email, password })
			});
			
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('token', data.token);
				navigate('/dashboard');
			} else {
				// Try to parse server response for a helpful message
				let body: any = null;
				try {
					body = await response.json();
				} catch (e) {
					// ignore JSON parse errors
				}
				// If server indicates user not found (404) or message contains clues, show friendly text
				if (response.status === 404 || (body && /not found|user not found|does not exist/i.test(body.message || body.error || ''))) {
					alert('User does not exist. Sign in to create an account.');
				} else if (response.status === 401) {
					alert('Invalid credentials. Please check your username and password.');
				} else {
					alert(body?.message || 'Login failed');
				}
			}
		} catch (error) {
			// Network or unexpected error
			alert('Login failed. Please check your network connection and try again.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div style={{ 
			minHeight: '100vh', 
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 20
		}}>
			<div style={{
				background: 'white',
				padding: '2rem',
				borderRadius: '12px',
				boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
				width: '100%',
				maxWidth: '400px'
			}}>
				<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
					<h1 style={{ 
						color: '#333', 
						margin: 0, 
						fontSize: '2rem',
						fontWeight: 'bold'
					}}>
						💰 AI Expense Tracker
					</h1>
					<p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
						Sign in to your account
					</p>
				</div>
				
				<form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
					<div>
						<label style={{ 
							display: 'block', 
							marginBottom: '0.5rem', 
							color: '#333',
							fontWeight: '500'
						}}>
							Email or Username
						</label>
						<input 
							placeholder="Enter your email or username" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.75rem',
								border: '2px solid #e1e5e9',
								borderRadius: '8px',
								fontSize: '1rem',
								boxSizing: 'border-box',
								transition: 'border-color 0.2s'
							}}
						/>
					</div>
					
					<div>
						<label style={{ 
							display: 'block', 
							marginBottom: '0.5rem', 
							color: '#333',
							fontWeight: '500'
						}}>
							Password
						</label>
						<input 
							placeholder="Enter your password" 
							type="password" 
							value={password} 
							onChange={(e) => setPassword(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.75rem',
								border: '2px solid #e1e5e9',
								borderRadius: '8px',
								fontSize: '1rem',
								boxSizing: 'border-box',
								transition: 'border-color 0.2s'
							}}
						/>
					</div>
					
					<button 
						type="submit" 
						disabled={loading}
						style={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							border: 'none',
							padding: '0.75rem',
							borderRadius: '8px',
							fontSize: '1rem',
							fontWeight: '600',
							cursor: loading ? 'not-allowed' : 'pointer',
							opacity: loading ? 0.7 : 1,
							transition: 'transform 0.2s'
						}}
					>
						{loading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>
				
				<div style={{ textAlign: 'center', marginTop: '1rem' }}>
					<p style={{ color: '#666', margin: 0 }}>
						Don't have an account?{' '}
						<a href="/register" style={{ 
							color: '#667eea', 
							textDecoration: 'none',
							fontWeight: '500'
						}}>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}


