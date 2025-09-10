import { Link, useNavigate } from 'react-router-dom';

import { logoutClient } from '../api/authService';

import Logo from '../assets/SSC Logo.png';

export default function Sidebar() {
	const Navigate = useNavigate();

	// Enhanced click handler with animation effect (from navbar)
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

	const handleLogout = () => {
		logoutClient();
		Navigate('/');
	};
	return (
		<>
			<aside className="bg-highlight p-md z-100 flex h-screen flex-col justify-between shadow-md">
				<div className="space-y-4">
					<Link
						to="/gatepass"
						className="flex items-center space-x-4 font-semibold md:flex-col"
					>
						<img src={Logo} alt="SSC" className="logo" />
						<h1 className="text-light translate-y-2 md:text-2xl lg:text-4xl">
							GATEPASS
						</h1>
					</Link>

					<Link to="/gatepass" className="text-light block text-[20px]">
						<div className="bg-primary rounded-md px-5 py-2">
							<i className="fa-solid fa-house icon mr-2"></i>
							Gatepass
						</div>
					</Link>

					<Link to="/violates" className="text-light block text-[20px]">
						<div className="bg-primary rounded-md px-5 py-2">
							<i className="fa-solid fa-circle-exclamation mr-2"></i>
							Violates
						</div>
					</Link>

					<Link to="/history" className="text-light block text-[20px]">
						<div className="bg-primary rounded-md px-5 py-2">
							<i className="fa-solid fa-clock-rotate-left mr-2"></i>
							History
						</div>
					</Link>
				</div>

				<div className="space-y-4">
					{/* Logout Button */}
					<button
						onClick={(e) => handleButtonClick(e, handleLogout)}
						className="relative w-full transform cursor-pointer overflow-hidden rounded-md bg-red-500 px-4 py-2 text-white shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-red-600 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95"
					>
						<div className="ripple-container absolute inset-0"></div>
						<span className="relative z-10 flex items-center justify-center gap-2 text-lg">
							<i className="fa-solid fa-right-from-bracket"></i>
							Logout
						</span>
					</button>

					<div>
						<p className="text-light text-sm">
							ⓒ STI College Davao- Supreme Student Council.
						</p>
						<p className="text-light text-sm">Term 2024 - 2025.</p>
					</div>
				</div>
			</aside>
		</>
	);
}
