import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditService() {
	const vet_id = localStorage.getItem("vet_id") || "";
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		cost: "",
	});
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	async function fetchService() {
		try {
			const response = await fetch(
				`http://localhost:5000/api/services/${id}`
			);
			const data = await response.json();
			if (response.ok) {
				setFormData({
					name: data.name,
					description: data.description,
					cost: data.cost.toString(),
				});
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to fetch service information.");
		}
	}

	useEffect(() => {
		fetchService();
	}, [id]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.description || !formData.cost) {
			toast.error("All fields are required.");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("http://localhost:5000/api/services", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					_id: id,
					vet: vet_id,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Service updated successfully!");
				navigate("/vet-profile/manage");
			} else {
				toast.error(data.message || "Failed to update service.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
			<div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border-t-4 border-indigo-500/50">
				<h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">
					Edit Service
				</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Service Name
						</label>
						<div className="mt-1">
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Enter service name"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<div className="mt-1">
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								rows={4}
								className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Provide a brief description"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="cost"
							className="block text-sm font-medium text-gray-700"
						>
							Cost ($)
						</label>
						<div className="mt-1">
							<input
								type="number"
								id="cost"
								name="cost"
								value={formData.cost}
								onChange={handleChange}
								className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Enter service cost"
							/>
						</div>
					</div>

					<div className="flex justify-center gap-4">
						<Link
							className="flex items-center px-6 py-3 text-lg font-semibold bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 transition"
							to={`/vet-profile/manage`}
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={loading}
							className={`flex items-center px-6 py-3 text-lg font-semibold text-white bg-indigo-500 rounded-md shadow-md hover:bg-indigo-600 transition ${
								loading ? "opacity-75 cursor-not-allowed" : ""
							}`}
						>
							{loading ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="w-5 h-5 mr-2" />
									Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
