// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Home from './Home.jsx';
import Violates from './Violates.jsx';
import History from './History.jsx';

import './index.css';

import { ErrorProvider } from './context/Errors/ErrorProvider.jsx';
import { GatepassProvider } from './context/Gatepass/GatepassProvider.jsx';

import ErrorModal from './component/ErrorModal.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ErrorProvider>
			<GatepassProvider>
				<BrowserRouter>
					<Routes>
						{/* Public (guest only) */}
						<Route
							path="/"
							element={
								<ProtectedRoute guestOnly>
									<App />
								</ProtectedRoute>
							}
						/>

						{/* Admin protected routes */}
						<Route
							path="/gatepass"
							element={
								<ProtectedRoute allowedRole="admin">
									<Home />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/violates"
							element={
								<ProtectedRoute allowedRole="admin">
									<Violates />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/history"
							element={
								<ProtectedRoute allowedRole="admin">
									<History />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
				<ErrorModal />
			</GatepassProvider>
		</ErrorProvider>
	</StrictMode>
);
