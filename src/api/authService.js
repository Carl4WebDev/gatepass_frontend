const API_BASE = import.meta.env.VITE_API_BASE;

export const loginClient = async (email, password) => {
	const res = await fetch(`${API_BASE}/auth/admin/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});

	const data = await res.json(); // Parse once

	if (!res.ok) {
		throw { status: res.status, message: data.message || 'Login failed' };
	}
	localStorage.setItem('token', data.token);
	localStorage.setItem('role', data.role);

	return data;
};
export const logoutClient = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('role');
	localStorage.clear();
	sessionStorage.clear();
	window.location.href = '/';
};
