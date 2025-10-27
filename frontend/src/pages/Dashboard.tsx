import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
	monthlyIncome: number;
	monthlySavingsTarget: number;
	monthlyExpenseTarget: number;
}

export function Dashboard() {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/');
			return;
		}

		// Try to decode username from JWT token payload (if token is a JWT)
		try {
			const parts = token.split('.');
			if (parts.length >= 2) {
				const payload = JSON.parse(atob(parts[1]));
				// common claim names: 'sub' or 'username'
				setUsername((payload.username as string) || (payload.sub as string) || null);
			}
		} catch (e) {
			// ignore decode errors
		}

		// Fetch user profile
		fetch('http://localhost:8080/api/profile', {
			headers: { 'Authorization': `Bearer ${token}` }
		})
		.then(res => res.json())
		.then(data => {
			setProfile(data);
			setLoading(false);
		})
		.catch(() => {
			setLoading(false);
		});
	}, [navigate]);

	function handleLogout() {
		localStorage.removeItem('token');
		navigate('/');
	}

	if (loading) {
		return (
			<div style={{ 
				minHeight: '100vh', 
				display: 'flex', 
				alignItems: 'center', 
				justifyContent: 'center',
				background: '#f8fafc'
			}}>
				<div style={{ fontSize: '1.2rem', color: '#666' }}>Loading...</div>
			</div>
		);
	}

	return (
		<div style={{ 
			minHeight: '100vh', 
			background: '#f8fafc',
			fontFamily: 'system-ui, -apple-system, sans-serif'
		}}>
			{/* Header */}
			<header style={{
				background: 'white',
				padding: '1rem 2rem',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}>
				<h1 style={{ 
					margin: 0, 
					color: '#1a202c',
					fontSize: '1.5rem',
					fontWeight: 'bold'
				}}>
					💰 AI Expense Tracker
				</h1>
				<button 
					onClick={handleLogout}
					style={{
						background: '#e53e3e',
						color: 'white',
						border: 'none',
						padding: '0.5rem 1rem',
						borderRadius: '6px',
						cursor: 'pointer',
						fontSize: '0.9rem'
					}}
				>
					Logout
				</button>
			</header>

			{/* Main Content */}
			<main style={{ padding: '2rem' }}>
				<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
					{/* Welcome Section */}
					<div style={{ marginBottom: '2rem' }}>
						<h2 style={{ 
							color: '#2d3748', 
							margin: 0, 
							fontSize: '2rem',
							fontWeight: 'bold'
						}}>
							Welcome {username ?? (profile as any)?.username ?? 'User'}! 👋
						</h2>
						<p style={{ 
							color: '#718096', 
							margin: '0.5rem 0 0 0',
							fontSize: '1.1rem'
						}}>
							Track your finances and achieve your savings goals
						</p>
					</div>

					{/* Stats Grid */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
						gap: '1.5rem',
						marginBottom: '2rem'
					}}>
						{/* Monthly Income Card */}
						<div style={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							padding: '1.5rem',
							borderRadius: '12px',
							boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
						}}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
								<div style={{ 
									fontSize: '2rem', 
									marginRight: '0.75rem' 
								}}>💰</div>
								<div>
									<h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
										Monthly Income
									</h3>
									<p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
										Current target
									</p>
								</div>
							</div>
							<div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
								${profile?.monthlyIncome?.toLocaleString() || '0'}
							</div>
						</div>

						{/* Savings Target Card */}
						<div style={{
							background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
							color: 'white',
							padding: '1.5rem',
							borderRadius: '12px',
							boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
						}}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
								<div style={{ 
									fontSize: '2rem', 
									marginRight: '0.75rem' 
								}}>🎯</div>
								<div>
									<h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
										Savings Target
									</h3>
									<p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
										Monthly goal
									</p>
								</div>
							</div>
							<div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
								${profile?.monthlySavingsTarget?.toLocaleString() || '0'}
							</div>
						</div>

						{/* Expense Target Card */}
						<div style={{
							background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
							color: 'white',
							padding: '1.5rem',
							borderRadius: '12px',
							boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
						}}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
								<div style={{ 
									fontSize: '2rem', 
									marginRight: '0.75rem' 
								}}>💸</div>
								<div>
									<h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
										Expense Target
									</h3>
									<p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
										Monthly limit
									</p>
								</div>
							</div>
							<div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
								${profile?.monthlyExpenseTarget?.toLocaleString() || '0'}
							</div>
						</div>
					</div>

					{/* Quick Actions */}
					<div style={{
						background: 'white',
						padding: '2rem',
						borderRadius: '12px',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
						marginBottom: '2rem'
					}}>
						<h3 style={{ 
							margin: '0 0 1.5rem 0', 
							color: '#2d3748',
							fontSize: '1.3rem',
							fontWeight: '600'
						}}>
							Quick Actions
						</h3>
						<div style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '1rem'
						}}>
							<button style={{
								background: '#4299e1',
								color: 'white',
								border: 'none',
								padding: '1rem',
								borderRadius: '8px',
								cursor: 'pointer',
								fontSize: '1rem',
								fontWeight: '500',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '0.5rem'
							}}>
								<span>➕</span> Add Expense
							</button>
							<button style={{
								background: '#48bb78',
								color: 'white',
								border: 'none',
								padding: '1rem',
								borderRadius: '8px',
								cursor: 'pointer',
								fontSize: '1rem',
								fontWeight: '500',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '0.5rem'
							}}>
								<span>💰</span> Add Income
							</button>
							<button style={{
								background: '#9f7aea',
								color: 'white',
								border: 'none',
								padding: '1rem',
								borderRadius: '8px',
								cursor: 'pointer',
								fontSize: '1rem',
								fontWeight: '500',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '0.5rem'
							}}>
								<span>📊</span> View Reports
							</button>
							<button style={{
								background: '#ed8936',
								color: 'white',
								border: 'none',
								padding: '1rem',
								borderRadius: '8px',
								cursor: 'pointer',
								fontSize: '1rem',
								fontWeight: '500',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '0.5rem'
							}}>
								<span>⚙️</span> Settings
							</button>
						</div>
					</div>

					{/* Recent Activity */}
					<div style={{
						background: 'white',
						padding: '2rem',
						borderRadius: '12px',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}>
						<h3 style={{ 
							margin: '0 0 1.5rem 0', 
							color: '#2d3748',
							fontSize: '1.3rem',
							fontWeight: '600'
						}}>
							Recent Activity
						</h3>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '3rem',
							color: '#718096',
							fontSize: '1.1rem'
						}}>
							📈 No recent transactions yet. Start tracking your expenses!
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

