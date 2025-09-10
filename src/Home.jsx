import { useState } from 'react';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import Dashboard from './component/Dashboard';
import './index.css';

export default function App() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	return (
		<div className="bg-accent grid h-screen grid-cols-1 lg:grid-cols-10">
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
					onClick={closeSidebar}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 col-span-0 w-full transform transition-transform duration-300 ease-in-out lg:relative lg:col-span-2 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
			>
				<Sidebar onClose={closeSidebar} />
			</div>

			{/* Main Area */}
			<div className="col-span-1 min-w-0 flex-1 flex-col lg:col-span-8">
				<Navbar
					name="Gatepass System"
					onMenuClick={toggleSidebar}
					className="sticky top-0 z-30"
				/>

				{/* Content Area */}
				<main className="flex-1 lg:overflow-hidden">
					<div className="p-4 sm:p-6 lg:p-8">
						<Dashboard />
					</div>
				</main>
			</div>
		</div>
	);
}
