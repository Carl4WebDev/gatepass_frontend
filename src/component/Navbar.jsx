import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar(props) {
	const navigate = useNavigate();
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Check for saved dark mode preference on component mount
	useEffect(() => {
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
		setIsDarkMode(savedDarkMode);

		// Apply dark mode class to document
		if (savedDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	// Enhanced click handler with animation effect
	const handleButtonClick = (e, callback) => {
		// Add click animation effect
		const button = e.currentTarget;
		button.style.transform = 'scale(0.95)';

		// Add ripple effect
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
		if (rippleContainer) {
			rippleContainer.appendChild(ripple);
		}

		setTimeout(() => {
			button.style.transform = 'scale(1)';
			if (ripple && ripple.parentNode) {
				ripple.parentNode.removeChild(ripple);
			}
		}, 300);

		// Call the original callback
		callback();
	};

	const toggleDarkMode = () => {
		const newDarkMode = !isDarkMode;
		setIsDarkMode(newDarkMode);

		// Save preference to localStorage
		localStorage.setItem('darkMode', newDarkMode.toString());

		// Toggle dark class on document element
		if (newDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav className="bg-accent flex w-full items-center justify-between px-4 py-4 shadow-md transition-colors duration-200 sm:px-6 lg:px-10">
			<h1 className="text-primary translate-y-2 text-xl font-bold sm:text-2xl">
				{props.name}
			</h1>

			{/* Desktop Menu - Hidden on small/medium screens */}
			<div className="hidden items-center lg:flex">
				{/* Dark Mode Toggle Button */}
				<button
					onClick={(e) => handleButtonClick(e, toggleDarkMode)}
					className="text-dark hover:bg-primary/10 relative transform cursor-pointer overflow-hidden rounded-full p-2 text-3xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-110 focus:outline-none active:scale-95"
					aria-label="Toggle dark mode"
				>
					<div className="ripple-container absolute inset-0"></div>
					<i
						className={` ${isDarkMode ? 'fa-solid fa-lightbulb' : 'fa-regular fa-lightbulb'} relative z-10 transition-all duration-200 ${isDarkMode ? 'text-yellow-500' : 'text-gray-600'} hover:text-yellow-400`}
					></i>
				</button>
			</div>

			{/* Hamburger Menu Button - Visible on small/medium screens */}
			<div className="lg:hidden">
				<button
					onClick={(e) => handleButtonClick(e, toggleMenu)}
					className="text-dark hover:bg-primary/10 relative transform cursor-pointer overflow-hidden rounded-md p-2 text-2xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-110 focus:outline-none active:scale-95"
					aria-label="Toggle menu"
				>
					<div className="ripple-container absolute inset-0"></div>
					<i
						className={`fa-solid relative z-10 transition-all duration-300 ${
							isMenuOpen ? 'fa-times' : 'fa-bars'
						}`}
					></i>
				</button>
			</div>

			{/* Mobile Menu Overlay - Full Screen Sidebar */}
			{isMenuOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					{/* Background Overlay */}
					<div
						className="bg-opacity-50 absolute inset-0 bg-black transition-opacity duration-300"
						onClick={() => setIsMenuOpen(false)}
					></div>

					{/* Sidebar Menu */}
					<div
						className={`bg-highlight absolute top-0 left-0 h-full w-full transform shadow-xl transition-transform duration-300 ease-in-out ${
							isMenuOpen ? 'translate-x-0' : '-translate-x-full'
						}`}
					>
						<div className="flex h-full flex-col justify-between p-6">
							{/* Close Button */}
							<div className="mb-4 flex justify-end">
								<button
									onClick={(e) =>
										handleButtonClick(e, () => setIsMenuOpen(false))
									}
									className="text-light hover:bg-primary/20 relative transform cursor-pointer overflow-hidden rounded-full p-2 text-2xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-110 focus:outline-none active:scale-95"
									aria-label="Close menu"
								>
									<div className="ripple-container absolute inset-0"></div>
									<i className="fa-solid fa-times relative z-10"></i>
								</button>
							</div>

							{/* Top Section */}
							<div className="flex-1 space-y-6">
								{/* Logo and Title */}
								<div className="flex flex-col items-center space-y-4">
									<img
										src="/public/Logo/SSC Logo.png"
										alt="SSC"
										className="h-16 w-16"
									/>
									<h1 className="text-light text-2xl font-bold">GATEPASS</h1>
								</div>

								{/* Navigation Links */}
								<div className="space-y-3">
									<a
										href="/Gatepass"
										className="text-light block text-lg"
										onClick={() => setIsMenuOpen(false)}
									>
										<div className="bg-primary hover:bg-primary/80 rounded-md px-5 py-3 transition-colors">
											<i className="fa-solid fa-house mr-3"></i>
											Gatepass
										</div>
									</a>

									<a
										href="/Violates"
										className="text-light block text-lg"
										onClick={() => setIsMenuOpen(false)}
									>
										<div className="bg-primary hover:bg-primary/80 rounded-md px-5 py-3 transition-colors">
											<i className="fa-solid fa-circle-exclamation mr-3"></i>
											Violates
										</div>
									</a>

									<a
										href="/History"
										className="text-light block text-lg"
										onClick={() => setIsMenuOpen(false)}
									>
										<div className="bg-primary hover:bg-primary/80 rounded-md px-5 py-3 transition-colors">
											<i className="fa-solid fa-clock-rotate-left mr-3"></i>
											History
										</div>
									</a>

									{/* Dark Mode Toggle in Sidebar Style */}
									<button
										onClick={(e) =>
											handleButtonClick(e, () => {
												toggleDarkMode();
											})
										}
										className="text-light w-full text-left text-lg"
									>
										<div className="bg-primary hover:bg-primary/80 relative overflow-hidden rounded-md px-5 py-3 transition-colors">
											<div className="ripple-container absolute inset-0"></div>
											<span className="relative z-10 flex items-center">
												<i
													className={`mr-3 ${isDarkMode ? 'fa-solid fa-lightbulb text-yellow-400' : 'fa-regular fa-lightbulb'}`}
												></i>
												{isDarkMode ? 'Light Mode' : 'Dark Mode'}
											</span>
										</div>
									</button>
								</div>
							</div>

							{/* Bottom Section */}
							<div className="space-y-4">
								{/* Logout Button */}
								<button
									onClick={(e) =>
										handleButtonClick(e, () => {
											navigate('/');
											setIsMenuOpen(false);
										})
									}
									className="relative w-full transform cursor-pointer overflow-hidden rounded-md bg-red-500 px-4 py-3 text-white shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-red-600 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95"
								>
									<div className="ripple-container absolute inset-0"></div>
									<span className="relative z-10 flex items-center justify-center gap-2 text-lg">
										<i className="fa-solid fa-right-from-bracket"></i>
										Logout
									</span>
								</button>

								{/* Copyright */}
								<div className="text-center">
									<p className="text-light text-sm">
										ⓒ STI College Davao- Supreme Student Council.
									</p>
									<p className="text-light text-sm">Term 2024 - 2025.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

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
		</nav>
	);
}
