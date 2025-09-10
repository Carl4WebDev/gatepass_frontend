// src/hooks/useError.js
import { useContext } from 'react';
import { ErrorContext } from '../context/Errors/ErrorContext';

export const useError = () => {
	return useContext(ErrorContext);
};
