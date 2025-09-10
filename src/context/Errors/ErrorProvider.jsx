// src/context/ErrorProvider.jsx
import { useState } from 'react';
import { ErrorContext } from './ErrorContext';

export const ErrorProvider = ({ children }) => {
	const [error, setError] = useState('');

	const showError = (msg) => setError(msg); // Show modal
	const clearError = () => setError(''); // Hide modal

	return (
		<ErrorContext.Provider value={{ error, showError, clearError }}>
			{children}
		</ErrorContext.Provider>
	);
};
