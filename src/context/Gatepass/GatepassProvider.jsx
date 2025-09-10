import { useState } from 'react';
import { GatepassContext } from './GatepassContext';
import axios from 'axios';
import { useError } from '../../hooks/useError';
const API_BASE = import.meta.env.VITE_API_BASE;

export const GatepassProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);
	const [activeGatepasses, setActiveGatepasses] = useState([]); // ✅ store active gatepasses
	const [sanctions, setSanctions] = useState([]); // ✅ store sanctions
	const [allGatepasses, setAllGatepasses] = useState([]); // ✅ Add state for all gatepa

	const { showError } = useError();

	// Function to add gatepass
	const addGatepass = async (student_name, section, gatepass_code) => {
		setLoading(true);
		// clear previous success but don't clear error yet
		setSuccess(null);

		try {
			const res = await axios.post(`${API_BASE}/gatepass/add-gatepass`, {
				student_name,
				section,
				gatepass_code,
			});

			if (res.data.success) {
				setSuccess('✅ Gatepass added successfully');
				// Refresh active gatepasses after adding
				await fetchActiveGatepasses();
			} else {
				showError('❌ Failed to add gatepass');
			}
		} catch (err) {
			showError(err.response?.data?.error || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	// Inside Dashboard component
	const returnGatepass = async (gatepass_code, student_name) => {
		try {
			// Send POST request to backend
			await axios.post(`${API_BASE}/gatepass/return-gatepass`, {
				gatepass_code: gatepass_code,
				student_name: student_name,
			});

			// Make sure we refresh properly
			await fetchActiveGatepasses();

			// Optional: show a success message
			console.log(`${student_name}'s gatepass returned successfully.`);
		} catch (error) {
			console.error('Error returning gatepass:', error);
		}
	};

	// Function to fetch all active gatepasses
	const fetchActiveGatepasses = async () => {
		setLoading(true);

		try {
			const res = await axios.get(`${API_BASE}/gatepass/active`);
			if (res.data.success) {
				setActiveGatepasses(res.data.data);
			} else {
				showError('❌ Failed to fetch active gatepasses');
			}
		} catch (err) {
			showError(err.response?.data?.error || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	// ✅ Fetch sanctions
	const fetchSanctions = async () => {
		try {
			const res = await axios.get(`${API_BASE}}/gatepass/sanctions`);
			if (res.data.success) {
				setSanctions(res.data.data);
			} else {
				showError('❌ Failed to fetch sanctions');
			}
			console.log(res.data);
		} catch (err) {
			showError(err.response?.data?.error || 'Something went wrong');
		}
	};

	// 🔹 Edit Gatepass (e.g., add sanction)
	const editGatepass = async (id, updates) => {
		try {
			console.log('Sending request to edit gatepass:', id, updates);

			const res = await axios.put(
				`${API_BASE}/gatepass/edit-gatepass/${id}`,
				updates
			);

			console.log('Response received:', res.data);

			if (res.data.success) {
				setSuccess('✅ Gatepass updated successfully');
				await fetchSanctions();
			} else {
				showError('❌ Failed to update gatepass');
			}
		} catch (err) {
			console.error('Error details:', err);
			console.error('Response error:', err.response);

			showError(err.response?.data?.error || 'Something went wrong');
		}
	};

	// ✅ Fetch all gatepasses
	const fetchAllGatepasses = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${API_BASE}/gatepass/all-gatepass`);
			if (res.data.success) {
				setAllGatepasses(res.data.data);
			} else {
				showError('❌ Failed to fetch all gatepasses');
			}
		} catch (err) {
			showError(err.response?.data?.error || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	const deleteAllGatepasses = async () => {
		// First confirmation
		if (!confirm('⚠️ Are you sure? This will delete ALL gatepasses!')) return;

		// Second confirmation
		if (
			!confirm(
				'❗ This is your LAST CHANCE! Do you REALLY want to delete ALL gatepasses?'
			)
		)
			return;

		setLoading(true);
		try {
			const res = await axios.delete(`${API_BASE}/gatepass/delete-all`);
			if (res.data.success) {
				setActiveGatepasses([]);
				setAllGatepasses([]);
				setSuccess('✅ All gatepasses deleted successfully');
			} else {
				showError('❌ Failed to delete all gatepasses');
			}
		} catch (err) {
			showError(err.response?.data?.error || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<GatepassContext.Provider
			value={{
				addGatepass,
				returnGatepass,
				fetchSanctions,
				sanctions,
				loading,
				success,
				activeGatepasses, // ✅ expose active gatepasses
				fetchActiveGatepasses, // optional: allow manual refresh
				setActiveGatepasses,
				editGatepass,
				fetchAllGatepasses,
				allGatepasses,
				deleteAllGatepasses,
			}}
		>
			{children}
		</GatepassContext.Provider>
	);
};
