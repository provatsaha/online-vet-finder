import { useNavigate } from "react-router-dom";
import { Menu, Home, User2, Phone, Briefcase } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="bg-gray-200">
			<nav className="container mx-auto px-4 py-2 flex justify-between items-center">
				<a href="/" className="text-lg font-bold text-gray-800">
					VetFinder
				</a>
				<div className="hidden md:flex items-center space-x-4">
					<a
						href="/"
						className="text-gray-600 hover:text-gray-800 flex items-center"
					>
						<span className="lg:hidden mr-2">
							<Home />
						</span>
						Home
					</a>
					<a
						href="/profile"
						className="text-gray-600 hover:text-gray-800 flex items-center"
					>
						<span className="lg:hidden mr-2">
							<User2 />
						</span>
						Profile
					</a>
					<a
						href="/vet-profile"
						className="text-gray-600 hover:text-gray-800 flex items-center"
					>
						<span className="lg:hidden mr-2">
							<Briefcase />
						</span>
						VetProfile
					</a>
					<a
						href="/contact"
						className="text-gray-600 hover:text-gray-800 flex items-center"
					>
						<span className="lg:hidden mr-2">
							<Phone />
						</span>
						Contact
					</a>
				</div>
				<button
					onClick={() => navigate("/login")}
					className="hidden md:block px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
				>
					Login
				</button>
				<button
					title="Toggle Menu"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="md:hidden text-gray-600"
				>
					<Menu size={24} />
				</button>
			</nav>
			{isMobileMenuOpen && (
				<div className="md:hidden bg-gray-50 shadow-lg">
					<ul className="flex flex-col space-y-2 p-4">
						<li>
							<a
								href="/"
								className="text-gray-600 hover:text-gray-800 flex items-center"
							>
								<Home className="mr-2" />
								Home
							</a>
						</li>
						<li>
							<a
								href="/profile"
								className="text-gray-600 hover:text-gray-800 flex items-center"
							>
								<User2 className="mr-2" />
								Profile
							</a>
						</li>
						<li>
							<a
								href="/vet-profile"
								className="text-gray-600 hover:text-gray-800 flex items-center"
							>
								<Briefcase className="mr-2" />
								VetProfile
							</a>
						</li>
						<li>
							<a
								href="/contact"
								className="text-gray-600 hover:text-gray-800 flex items-center"
							>
								<Phone className="mr-2" />
								Contact
							</a>
						</li>
						<li>
							<button
								onClick={() => {
									setIsMobileMenuOpen(false);
									navigate("/login");
								}}
								className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 flex items-center justify-center"
							>
								Login
							</button>
						</li>
					</ul>
				</div>
			)}
		</header>
	);
};

export default Navbar;
