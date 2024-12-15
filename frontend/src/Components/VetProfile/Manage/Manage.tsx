import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus } from "lucide-react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface Service {
	_id: string;
	name: string;
	description: string;
	cost: number;
}

export default function Manage() {
	const vet_id = localStorage.getItem("vet_id") || "";
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState<Service[]>([]);
	const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
	const navigate = useNavigate();

	async function fetchServices() {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:5000/api/myservices`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ vet_id }),
				}
			);
			const data = await response.json();
			if (response.ok) {
				setServices(data);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to fetch services.");
		}
		setLoading(false);
	}

	async function confirmDelete() {
		if (deleteServiceId) {
			try {
				const response = await fetch(
					`http://localhost:5000/api/services/${deleteServiceId}`,
					{
						method: "DELETE",
					}
				);
				const data = await response.json();
				if (response.ok) {
					toast.success("Service deleted successfully.");
					fetchServices();
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error("Failed to delete service.");
			} finally {
				setDeleteServiceId(null);
			}
		}
	}

	useEffect(() => {
		fetchServices();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-50">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
			<div className="max-w-5xl mx-auto">
				<div className="flex justify-end mb-6">
					<button
						className="flex items-center px-6 py-2 bg-indigo-500 text-white text-lg font-semibold rounded-md shadow-md hover:bg-indigo-600 transition"
						onClick={() =>
							navigate("/vet-profile/manage/new-service")
						}
					>
						<Plus className="w-5 h-5 mr-2" />
						Add New Service
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map((service) => (
						<div
							key={service._id}
							className="bg-white rounded-lg shadow-md p-5 relative hover:shadow-lg transition"
						>
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								{service.name.slice(0, 20)}
							</h3>
							<p className="text-gray-600 mb-4">
								{service.description
									.split(" ")
									.slice(0, 40)
									.join(" ")}
								{service.description.length > 40 && "..."}
							</p>
							<p className="text-indigo-500 font-semibold text-lg">
								${service.cost.toFixed(2)}
							</p>

							<div className="absolute top-4 right-4 flex space-x-2">
								<Link
									title="Edit Service"
									className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
									to={`/vet-profile/manage/${service._id}`}
								>
									<Edit3 className="w-5 h-5" />
								</Link>
								<button
									title="Delete Service"
									className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
									onClick={() =>
										setDeleteServiceId(service._id)
									}
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{deleteServiceId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
						<h2 className="text-lg font-bold text-gray-800">
							Confirm Deletion
						</h2>
						<p className="text-gray-600 mt-2">
							Are you sure you want to delete this service? This
							action cannot be undone.
						</p>
						<div className="mt-4 flex justify-end space-x-4">
							<button
								className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
								onClick={() => setDeleteServiceId(null)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
								onClick={confirmDelete}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
