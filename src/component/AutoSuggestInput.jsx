import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AutoSuggestInput({
	label,
	placeholder,
	value,
	onSelect,
	searchField,
	type = 'name',
}) {
	const [query, setQuery] = useState(value || '');
	const [results, setResults] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [loading, setLoading] = useState(false);
	const [justSelected, setJustSelected] = useState(false);

	useEffect(() => {
		setQuery(value || '');
	}, [value]);

	useEffect(() => {
		if (type !== 'name') return;
		if (query.trim().length < 1 || justSelected) {
			setResults([]);
			return;
		}

		const fetchResults = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`http://localhost:5000/student/search?q=${query}`
				);
				setResults(res.data.data || []);
				setShowDropdown(true);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		const delay = setTimeout(fetchResults, 200);
		return () => clearTimeout(delay);
	}, [query, justSelected, type]);

	return (
		<div className="relative w-full">
			<label className="text-dark mb-2 block text-sm font-semibold">
				{label}
			</label>
			<input
				type="text"
				placeholder={placeholder}
				value={query}
				onChange={(e) => {
					const typedValue = e.target.value;
					setJustSelected(false);
					setQuery(typedValue);

					// Check if typed value matches a student in results
					const match = results.find((s) =>
						s.student_name.toLowerCase().startsWith(typedValue.toLowerCase())
					);

					if (match) {
						onSelect(match); // full object → auto-fills section & ID
					} else {
						onSelect({ student_name: typedValue }); // only typed name
					}
				}}
				className="bg-primary/20 hover:bg-primary/30 w-full rounded-md border-0 px-4 py-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-base"
				onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
				onFocus={() => {
					if (type === 'name' && query.length >= 1 && !justSelected) {
						setShowDropdown(true);
					}
				}}
			/>

			{type === 'name' && showDropdown && (
				<ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow">
					{loading && (
						<li className="p-2 text-sm text-gray-400">Searching...</li>
					)}
					{!loading && results.length === 0 && query.length >= 1 && (
						<li className="p-2 text-sm text-gray-400">No results</li>
					)}
					{results.map((student) => (
						<li
							key={student.student_id}
							className="cursor-pointer p-2 hover:bg-gray-200"
							onClick={() => {
								onSelect(student); // full object
								setQuery(student[searchField]);
								setShowDropdown(false);
								setJustSelected(true);
							}}
						>
							<div className="font-medium">{student.student_name}</div>
							<div className="text-xs text-gray-500">
								{student.section} — ID: {student.student_id}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
