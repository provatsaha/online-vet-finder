import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit3, Trash2, PlusCircle } from "lucide-react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Context/constant";

interface Pet {
	_id: string;
	name: string;
	picture: string;
	species: string;
	breed: string;
	age: number;
	sex: string;
	vaccinations_status: string;
	last_vaccination_date: Date;
	health_status: string;
}

export default function Mypets() {
	const user_id = localStorage.getItem("user_id");
	const [pets, setPets] = useState<Pet[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	async function fetchPets() {
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/mypets`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_id }),
			});
			const data = await response.json();
			if (response.ok) {
				setPets(data);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to fetch pets.");
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchPets();
	}, [user_id]);

	async function deletePet(id: string) {
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/pets/${id}`, {
				method: "DELETE",
			});
			const data = await response.json();
			if (response.ok) {
				toast.success(data.message);
				fetchPets();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to delete pet.");
		}
		setLoading(false);
	}

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			{loading && (
				<div className="flex items-center justify-center h-screen">
					<Spin size="large" fullscreen />
				</div>
			)}
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						My Pets
					</h1>
					<button
						onClick={() => navigate("/newpet")}
						title="Add New Pet"
						className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition"
					>
						<PlusCircle className="w-5 h-5" />
						Add New Pet
					</button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{pets.map((pet) => (
						<div
							key={pet._id}
							className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
						>
							<img
								src={pet.picture}
								alt={pet.name}
								className="w-full h-48 object-cover"
							/>
							<div className="p-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{pet.name}
								</h2>
								<p className="text-gray-600 text-sm mb-2">
									<span className="font-medium">
										Species:
									</span>{" "}
									{pet.species}
								</p>
								<p className="text-gray-600 text-sm mb-2">
									<span className="font-medium">Breed:</span>{" "}
									{pet.breed}
								</p>
								<p className="text-gray-600 text-sm mb-2">
									<span className="font-medium">Age:</span>{" "}
									{pet.age},{" "}
									<span className="font-medium">Sex:</span>{" "}
									{pet.sex}
								</p>
								<p className="text-gray-600 text-sm mb-2">
									<span className="font-medium">
										Health Status:
									</span>{" "}
									{pet.health_status}
								</p>
								<p className="text-gray-600 text-sm mb-2">
									<span className="font-medium">
										Vaccination Status:
									</span>{" "}
									{pet.vaccinations_status}
								</p>
								<p className="text-gray-600 text-sm mb-2">
									<span className="font-medium">
										Last Vaccination:
									</span>{" "}
									{new Date(
										pet.last_vaccination_date
									).toLocaleDateString()}
								</p>
								<div className="flex justify-end gap-4 mt-4">
									<button
										onClick={() =>
											navigate(`/editpet/${pet._id}`)
										}
										className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
									>
										<Edit3 className="w-4 h-4" />
										<span>Edit</span>
									</button>
									<button
										onClick={() => deletePet(pet._id)}
										className="flex items-center gap-1 text-gray-600 hover:text-red-500"
									>
										<Trash2 className="w-4 h-4" />
										<span>Delete</span>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
