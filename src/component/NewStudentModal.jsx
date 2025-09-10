import React, { useState } from 'react';

import { useGatepass } from '../hooks/useGatepass';

export default function NewStudentModal({ isOpen, onClose }) {
	const { addGatepass } = useGatepass();

	const [student, setStudent] = useState({
		student_name: '',
		section: '',
		gatepass_code: '',
	});

	const handleChange = (e) => {
		setStudent({ ...student, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!student.student_name || !student.section) return;
		console.log('Submitting:', student); // ✅ see exactly what’s being sent
		await addGatepass(
			student.student_name,
			student.section,
			student.gatepass_code
		);
		setStudent({
			student_name: '',
			section: '',
			gatepass_code: '',
		});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
				>
					&times;
				</button>

				<h2 className="mb-4 text-lg font-bold">Add New Student</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Student Name (Ex: Last Name, First Name)
						</label>
						<input
							type="text"
							name="student_name"
							value={student.student_name}
							onChange={handleChange}
							placeholder="Enter student name"
							className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Section (Ex: BSCS 501)
						</label>
						<input
							type="text"
							name="section"
							value={student.section}
							onChange={handleChange}
							placeholder="Enter section"
							className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Gatepass Code (Ex: 1)
						</label>
						<input
							type="text"
							name="gatepass_code"
							value={student.gatepass_code}
							onChange={handleChange}
							placeholder="Enter code"
							className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-md bg-green-500 py-2 font-semibold text-white transition-colors hover:bg-green-600"
					>
						Add Student
					</button>
				</form>
			</div>
		</div>
	);
}
