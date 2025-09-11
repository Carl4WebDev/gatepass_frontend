import React, { useState, useEffect } from 'react';
import { useGatepass } from '../hooks/useGatepass'; // adjust the path

export default function Violates() {
	const { fetchSanctions, sanctions, loading, editGatepass } = useGatepass(); // use the provider
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedSanction, setSelectedSanction] = useState(null);
	const [editedReason, setEditedReason] = useState('');
	const [editedType, setEditedType] = useState(''); // LATE or DNR

	const [searchTerm, setSearchTerm] = useState('');

	const filteredSanctions = sanctions.filter((s) =>
		s.student_name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		// fetch all sanctions on mount
		fetchSanctions(); // ✅ implement in provider
	}, []);

	const handleButtonClick = (e, sanction) => {
		// ripple effect
		const button = e.currentTarget;
		button.style.transform = 'scale(0.95)';
		const ripple = document.createElement('span');
		const rect = button.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;

		ripple.style.width = ripple.style.height = size + 'px';
		ripple.style.left = x + 'px';
		ripple.style.top = y + 'px';
		ripple.classList.add('ripple');

		const rippleContainer = button.querySelector('.ripple-container');
		if (rippleContainer) rippleContainer.appendChild(ripple);

		setTimeout(() => {
			button.style.transform = 'scale(1)';
			if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple);
		}, 300);

		// open modal
		setSelectedSanction(sanction);
		setEditedReason(sanction.sanction_reason || '');
		setEditedType(sanction.sanction_type || 'LATE');
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedSanction(null);
	};

	const handleSave = async () => {
		if (selectedSanction) {
			console.log(
				'Saving sanction with ID:',
				selectedSanction.gatepass_id,
				'Type:',
				typeof selectedSanction.gatepass_id
			);
			console.log('Updates:', {
				sanction_type: editedType,
				sanction_reason: editedReason,
			});

			await editGatepass(selectedSanction.gatepass_id, {
				sanction_type: editedType,
				sanction_reason: editedReason,
			});
			closeModal();
		}
	};

	if (loading) return <p className="mt-4 text-center">Loading...</p>;

	return (
		<div className="table-container h-[76vh]">
			{/* Search Input */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Search by student name..."
					className="focus:ring-primary w-full rounded-md border p-2 focus:ring-2 focus:outline-none"
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			<table className="bg-accent scrollable-table w-full overflow-scroll overflow-x-visible overflow-y-visible rounded-md shadow-sm">
				<thead className="bg-primary text-light">
					<tr>
						<th className="px-10 py-3 text-center font-semibold">
							Student Name
						</th>
						<th className="px-10 py-3 text-center font-semibold">Section</th>
						<th className="px-10 py-3 text-center font-semibold">Code</th>
						<th className="px-10 py-3 text-center font-semibold">
							Sanction Type
						</th>
						<th className="px-10 py-3 text-center font-semibold">
							Late Minutes
						</th>
						<th className="px-10 py-3 text-center font-semibold">
							Timeout-Timein
						</th>
						<th className="px-10 py-3 text-center font-semibold">
							Expected Return Time
						</th>
						<th className="px-10 py-3 text-center font-semibold">Reason</th>
						<th className="px-10 py-3 text-center font-semibold">Action</th>
					</tr>
				</thead>
				<tbody>
					{filteredSanctions.length > 0 ? (
						filteredSanctions.map((s, index) => (
							<tr
								key={s.gatepass_id}
								className={`${
									index % 2 === 0 ? 'bg-danger/20' : 'bg-danger/10'
								} hover:bg-secondary/30 transition-colors`}
							>
								<td className="px-4 py-3 text-center">{s.student_name}</td>
								<td className="px-4 py-3 text-center">{s.section}</td>
								<td className="px-4 py-3 text-center">{s.gatepass_code}</td>
								<td className="px-4 py-3 text-center">{s.sanction_type}</td>
								<td className="px-4 py-3 text-center">
									{s.late_minutes || '-'}
								</td>
								<td className="px-4 py-3 text-center">
									{s.time_out && s.time_in
										? `${new Date(s.time_out).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})} - ${new Date(s.time_in).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}`
										: '-'}
								</td>
								<td className="px-4 py-3 text-center">
									{s.expected_return_time
										? new Date(s.expected_return_time).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})
										: '-'}
								</td>

								<td className="px-4 py-3 text-center">
									{s.sanction_reason || '-'}
								</td>
								<td className="px-4 py-3 text-center">
									<button
										onClick={(e) => handleButtonClick(e, s)}
										className="bg-primary text-light relative transform cursor-pointer overflow-hidden rounded px-2 py-1 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-95"
									>
										<div className="ripple-container absolute inset-0"></div>
										<span className="relative z-10">Edit</span>
									</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan="9"
								className="px-4 py-6 text-center text-gray-500 italic"
							>
								No data found
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Modal */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-accent w-96 rounded-lg p-6">
						<h2 className="mb-4 text-lg font-semibold">Edit Sanction</h2>
						<label className="mb-4 block">
							Type:
							<select
								value={editedType}
								onChange={(e) => setEditedType(e.target.value)}
								className="mt-1 w-full rounded border p-2"
							>
								<option value="DNR">DNR</option>
								<option value="LATE">LATE</option>
							</select>
						</label>
						<label className="mb-4 block">
							Reason:
							<textarea
								value={editedReason}
								onChange={(e) => setEditedReason(e.target.value)}
								className="mt-1 w-full rounded border p-2"
							/>
						</label>
						<div className="flex justify-end gap-2">
							<button
								onClick={handleSave}
								className="bg-primary rounded px-4 py-2 text-white hover:bg-blue-600"
							>
								Save
							</button>
							<button
								onClick={closeModal}
								className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
