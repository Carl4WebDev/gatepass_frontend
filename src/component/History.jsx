import React, { useEffect } from 'react';
import { useGatepass } from '../hooks/useGatepass'; // adjust the path

export default function History() {
	const { fetchAllGatepasses, allGatepasses, loading } = useGatepass();

	useEffect(() => {
		fetchAllGatepasses();
	}, []);

	if (loading) return <p className="mt-4 text-center">Loading...</p>;

	return (
		<div className="table-container">
			<table className="bg-accent scrollable-table w-full overflow-hidden rounded-md shadow-sm">
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
					</tr>
				</thead>
				<tbody>
					{allGatepasses.map((gatepass, index) => (
						<tr
							key={gatepass.gatepass_id}
							className={`${
								index % 2 === 0 ? 'bg-danger/20' : 'bg-danger/10'
							} hover:bg-secondary/30 transition-colors`}
						>
							<td className="px-4 py-3 text-center">{gatepass.student_name}</td>
							<td className="px-4 py-3 text-center">{gatepass.section}</td>
							<td className="px-4 py-3 text-center">
								{gatepass.gatepass_code}
							</td>
							<td className="px-4 py-3 text-center">
								{gatepass.sanction_type || '-'}
							</td>
							<td className="px-4 py-3 text-center">
								{gatepass.late_minutes || '-'}
							</td>
							<td className="px-4 py-3 text-center">
								{gatepass.time_out && gatepass.time_in
									? `${new Date(gatepass.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(gatepass.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
									: '-'}
							</td>
							<td className="px-4 py-3 text-center">
								{gatepass.expected_return_time
									? new Date(gatepass.expected_return_time).toLocaleTimeString(
											[],
											{
												hour: '2-digit',
												minute: '2-digit',
											}
										)
									: '-'}
							</td>
							<td className="px-4 py-3 text-center">
								{gatepass.sanction_reason || '-'}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<style jsx>{`
				.table-container {
					max-height: 70vh;
					max-width: 100%;
					overflow-x: auto;
					overflow-y: auto;
				}
				.scrollable-table {
					min-width: 800px;
					border-collapse: collapse;
				}
				.scrollable-table thead {
					position: sticky;
					top: 0;
					z-index: 10;
				}
			`}</style>
		</div>
	);
}
