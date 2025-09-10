import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

import { useError } from '../hooks/useError';
import { loginClient } from '../api/authService';

export default function Login() {
	const { showError } = useError();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await loginClient(email, password);
			navigate('/gatepass');
		} catch (err) {
			setError(err.message);
			showError(err.message);
		}
	};

	return (
		<div className="bg-accent flex min-h-screen items-center justify-center">
			<div className="bg-accebt w-full max-w-md rounded-lg p-8 shadow-lg">
				<h2 className="mb-6 text-center text-2xl font-bold">Login</h2>
				<img
					src="/public/Logo/SSC Logo.png"
					alt="SSC"
					className="mx-auto h-40 w-40"
				/>

				{error && (
					<div className="border-danger/20 bg-danger/10 mb-4 rounded-md border p-3">
						<p className="text-danger text-sm">{error}</p>
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="focus:ring-primary border-gray w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
							required
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="focus:ring-primary border-gray w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
							required
						/>
					</div>
					<button
						type="submit"
						className={`w-full rounded-md bg-blue-600 py-2 text-2xl font-bold text-white transition duration-200`}
					>
						Log In
					</button>
				</form>
			</div>
		</div>
	);
}
