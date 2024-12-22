import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

interface Service {
	_id: string;
	name: string;
	description: string;
	cost: number;
	vet: {
		_id: string;
		name: string;
		location: string;
	};
}

export default function SearchPage() {
	const [searchText, setSearchText] = useState("");
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(false);
	const { vetId } = useAuth();

	const handleSearch = async () => {
		if (!searchText.trim()) {
			toast.error("Please enter a search term");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/services/search",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ searchText }),
				}
			);

			const data = await response.json();
			if (response.ok) {
				setServices(data);
			} else {
				toast.error(data.message || "Failed to fetch services.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-3xl mx-auto">
				<div className="flex mb-6">
					<input
						type="text"
						placeholder="Search for services..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={handleKeyDown}
						className="w-full p-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
					<button
						onClick={handleSearch}
						className="px-6 bg-indigo-600 text-white font-bold rounded-r-lg hover:bg-indigo-700 transition"
					>
						{loading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<Search className="w-5 h-5" />
						)}
					</button>
				</div>

				{services.length > 0 ? (
					<div className="space-y-4">
						{services.map((service) => (
							<div
								key={service._id}
								className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
							>
								<h2 className="text-2xl font-bold text-gray-800">
									{service.name}
								</h2>
								<p className="text-gray-600">
									{service.description}
								</p>
								<Link
									to={
										service.vet._id === vetId
											? "/vet-profile"
											: `/vet-profile/${service.vet._id}`
									}
									className="mt-2 text-indigo-500 font-semibold"
								>
									${service.cost} - {service.vet.name} (
									{service.vet.location})
								</Link>
							</div>
						))}
					</div>
				) : (
					!loading && (
						<p className="text-gray-500 text-center mt-8">
							No services found. Try another search term.
						</p>
					)
				)}
			</div>
		</div>
	);
}
