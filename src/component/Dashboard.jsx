import React, { useState, useEffect, useRef } from 'react';
import AutoSuggestInput from './AutoSuggestInput';

import { useGatepass } from '../hooks/useGatepass';
import { useError } from '../hooks/useError';

import NewStudentModal from './NewStudentModal';

export default function Dashboard() {
	// const [isModalOpen, setIsModalOpen] = useState(false);

	const { showError } = useError();

	const {
		addGatepass,
		returnGatepass,
		activeGatepasses,
		fetchActiveGatepasses,
		setActiveGatepasses,
		loading,
	} = useGatepass();

	const [newStudent, setNewStudent] = useState({
		student_name: '',
		section: '',
		gatepass_code: '', // user inputs manually
	});

	useEffect(() => {
		// Fetch active gatepasses when component mounts
		fetchActiveGatepasses();
	}, []);

	const handleAddStudent = async (e) => {
		e.preventDefault();
		await addGatepass(
			newStudent.student_name,
			newStudent.section,
			newStudent.gatepass_code
		);
		setNewStudent({
			student_name: '',
			section: '',
			gatepass_code: '', // user inputs manually
		});
	};

	const handleReturnGatepass = async (student) => {
		await returnGatepass(student.gatepass_code, student.student_name);
	};

	const activeGatepassesRef = useRef(activeGatepasses);

	useEffect(() => {
		activeGatepassesRef.current = activeGatepasses;
	}, [activeGatepasses]);

	useEffect(() => {
		const interval = setInterval(() => {
			checkOverdueGatepasses();
		}, 60000);

		fetchActiveGatepasses(); // initial fetch
		return () => clearInterval(interval);
	}, []);

	const checkOverdueGatepasses = async () => {
		const now = new Date();

		for (const student of activeGatepassesRef.current) {
			const expectedReturn = new Date(student.expected_return_time);

			if (now > expectedReturn) {
				try {
					await returnGatepass(student.gatepass_code, student.student_name);

					// Remove from UI immediately
					setActiveGatepasses((prev) =>
						prev.filter((gp) => gp.gatepass_id !== student.gatepass_id)
					);
				} catch (err) {
					showError('Error auto-returning:', student.student_name, err);
				}
			}
		}
	};

	if (loading) return <p className="mt-4 text-center">Loading...</p>;
	return (
		<div className="bg-accent flex p-4 sm:p-6 lg:max-h-[70vh]">
			<div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-10">
				{/* Left Side - Form */}
				<div className="bg-accent w-full rounded-lg p-4 shadow-md sm:p-6 lg:w-96 lg:max-w-96 lg:min-w-96">
					<form onSubmit={handleAddStudent} className="space-y-4">
						{/* Student Name */}
						<div className="mb-4">
							<label className="mb-1 block text-sm font-medium">
								Student Name (Ex: LAST NAME FIRST NAME)
							</label>
							<input
								type="text"
								placeholder="Search student..."
								value={newStudent.student_name}
								onChange={(e) =>
									setNewStudent({ ...newStudent, student_name: e.target.value })
								}
								className="w-full rounded border px-3 py-2 focus:ring focus:ring-blue-500"
							/>
						</div>

						{/* Section */}
						<div className="mb-4">
							<label className="mb-1 block text-sm font-medium">
								Section (Ex: BSCS501)
							</label>
							<input
								type="text"
								placeholder="Enter section..."
								value={newStudent.section}
								onChange={(e) =>
									setNewStudent({ ...newStudent, section: e.target.value })
								}
								className="w-full rounded border px-3 py-2 focus:ring focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium">
								Gatepass Code (Ex: 1 or 2)
							</label>
							<input
								type="text"
								placeholder="Enter code..."
								value={newStudent.gatepass_code}
								onChange={(e) =>
									setNewStudent({
										...newStudent,
										gatepass_code: e.target.value,
									})
								}
								className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
							/>
						</div>

						<div className="mt-4 flex justify-center sm:justify-start">
							<button
								type="submit"
								disabled={!newStudent.student_name}
								className={`w-full rounded-md px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 ease-in-out focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:scale-95 sm:w-auto ${
									!newStudent.student_name
										? 'cursor-not-allowed bg-gray-400 opacity-60'
										: 'cursor-pointer bg-green-500 hover:-translate-y-0.5 hover:bg-green-600'
								}`}
							>
								<span className="flex items-center justify-center gap-2">
									Start
								</span>
							</button>
						</div>
					</form>

					{/* <button
						onClick={() => setIsModalOpen(true)}
						className="mt-4 w-full rounded-md bg-blue-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-600"
					>
						Add Student Not in List
					</button> */}
					{/* <NewStudentModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/> */}
				</div>

				<div className="bg-secondary/70 max-h-[75vh] w-full flex-1 overflow-y-auto rounded-lg p-4 sm:p-6">
					<h2 className="text-dark mb-6 text-lg font-bold sm:text-xl">
						Active
					</h2>

					{activeGatepasses.length === 0 ? (
						<div className="text-dark/50 mt-8 text-center text-sm sm:text-base">
							No active gatepass entries
						</div>
					) : (
						<div className="overflow-x-auto overflow-y-auto">
							{/* Desktop Table View */}
							<div className="hidden sm:block">
								<table className="bg-accent h-auto w-full overflow-hidden rounded-md shadow-sm">
									<thead className="bg-primary text-light">
										<tr>
											<th className="px-3 py-2 text-left text-sm font-semibold lg:px-4 lg:py-3 lg:text-base">
												Student Name
											</th>
											<th className="px-3 py-2 text-left text-sm font-semibold lg:px-4 lg:py-3 lg:text-base">
												Section
											</th>
											<th className="px-3 py-2 text-left text-sm font-semibold lg:px-4 lg:py-3 lg:text-base">
												Code
											</th>
											<th className="px-3 py-2 text-left text-sm font-semibold lg:px-4 lg:py-3 lg:text-base">
												Time out
											</th>
											<th className="px-3 py-2 text-left text-sm font-semibold lg:px-4 lg:py-3 lg:text-base">
												Expected Return
											</th>
											<th className="px-3 py-2 text-center text-sm font-semibold lg:px-4 lg:py-3 lg:text-base">
												Action
											</th>
										</tr>
									</thead>
									<tbody>
										{activeGatepasses.map((student, index) => (
											<tr
												key={student.gatepass_id}
												className={`${
													index % 2 === 0 ? 'bg-primary/20' : 'bg-primary/10'
												} hover:bg-secondary/30 transition-colors`}
											>
												<td className="text-dark px-3 py-2 text-sm font-medium lg:px-4 lg:py-3 lg:text-base">
													{student.student_name}
												</td>
												<td className="text-dark px-3 py-2 text-sm lg:px-4 lg:py-3 lg:text-base">
													{student.section}
												</td>
												<td className="text-dark px-3 py-2 text-sm lg:px-4 lg:py-3 lg:text-base">
													{student.gatepass_code}
												</td>
												<td className="text-dark px-3 py-2 font-mono text-sm lg:px-4 lg:py-3 lg:text-base">
													{new Date(student.time_out).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</td>
												<td className="text-dark px-3 py-2 font-mono text-sm lg:px-4 lg:py-3 lg:text-base">
													{new Date(
														student.expected_return_time
													).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</td>
												<td className="px-3 py-2 text-center lg:px-4 lg:py-3">
													<button
														onClick={() => handleReturnGatepass(student)}
														className="bg-danger relative transform cursor-pointer overflow-hidden rounded px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-red-500 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
													>
														<div className="ripple-container absolute inset-0"></div>
														<span className="relative z-10 flex items-center justify-center gap-1">
															Return
														</span>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Mobile Card View */}
							<div className="block space-y-4 sm:hidden">
								{activeGatepasses.map((student, index) => (
									<div
										key={student.gatepass_id}
										className={`${
											index % 2 === 0 ? 'bg-primary/20' : 'bg-primary/10'
										} bg-accent rounded-lg p-4 shadow-sm`}
									>
										<div className="space-y-2">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h3 className="text-dark text-sm font-semibold">
														{student.student_name}
													</h3>
													<p className="text-dark/70 text-xs">
														{student.section}
													</p>
												</div>
												<div className="text-right">
													<p className="text-dark font-mono text-xs">
														{new Date(student.time_out).toLocaleTimeString([], {
															hour: '2-digit',
															minute: '2-digit',
														})}
													</p>
													<p className="text-dark font-mono text-xs">
														{new Date(
															student.expected_return_time
														).toLocaleTimeString([], {
															hour: '2-digit',
															minute: '2-digit',
														})}
													</p>
													<p className="text-dark/70 text-xs">
														Code: {student.gatepass_code}
													</p>
												</div>
											</div>
											<div className="pt-2">
												<button
													onClick={() => handleReturnGatepass(student)}
													className="bg-danger relative w-full transform cursor-pointer overflow-hidden rounded px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-red-500 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95"
												>
													<div className="ripple-container absolute inset-0"></div>
													<span className="relative z-10 flex items-center justify-center gap-1">
														Return
													</span>
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<style jsx>{`
				@keyframes ripple {
					0% {
						transform: scale(0);
						opacity: 0.6;
					}
					100% {
						transform: scale(4);
						opacity: 0;
					}
				}

				.ripple {
					position: absolute;
					border-radius: 50%;
					background-color: rgba(255, 255, 255, 0.6);
					animation: ripple 0.6s linear;
					pointer-events: none;
				}
			`}</style>
		</div>
	);
}
