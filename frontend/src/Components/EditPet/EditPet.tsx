import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Upload,
	Trash2,
	PawPrint,
	Shield,
	Heart,
	Calendar,
	List,
	ArrowUpFromLine,
	Syringe,
	Group,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import { BASE_URL } from "../../Context/constant";

interface Pet {
	_id: string;
	name: string;
	owner: string;
	picture: string;
	species: string;
	breed: string;
	age: number;
	sex: string;
	vaccinations_status: string;
	last_vaccination_date: Date;
	health_status: string;
}

export default function EditPet() {
	const [formData, setFormData] = useState<Pet>({
		_id: "",
		name: "",
		owner: localStorage.getItem("user_id") || "",
		picture: "",
		species: "",
		breed: "",
		age: 0,
		sex: "",
		vaccinations_status: "",
		last_vaccination_date: new Date(),
		health_status: "",
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);

	async function fetchPet() {
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/pets/${id}`);
			const data = await response.json();
			if (response.ok) {
				data.owner = data.owner._id;
				data.last_vaccination_date = new Date(
					data.last_vaccination_date
				);
				delete data.__v;

				setFormData(data);
				setImagePreview(data.picture);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to fetch pet.");
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchPet();
	}, [id]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) =>
			name === "age"
				? { ...prev, age: parseInt(value, 10) || 0 }
				: { ...prev, [name]: value }
		);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData((prev) => ({
					...prev,
					picture: reader.result as string,
				}));
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			toast.error("Only JPG and PNG files are allowed.");
		}
	};

	const handleDeleteImage = () => {
		setFormData((prev) => ({ ...prev, picture: "" }));
		setImagePreview(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.picture) {
			toast.error("Please upload a picture.");
			return;
		}
		if (Object.values(formData).some((field) => !field)) {
			toast.error("Please fill out all fields2.");
			return;
		}
		formData.owner = localStorage.getItem("user_id") || "";
		try {
			const response = await fetch(`${BASE_URL}/api/pets`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Pet added successfully!");
				navigate("/mypets");
			} else {
				toast.error(data.message || "Failed to add pet.");
			}
		} catch (error) {
			toast.error("Failed to add pet.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			{loading && <Spin fullscreen size="large" />}
			<div className="bg-white rounded-lg shadow-xl p-8 max-w-5xl w-full">
				<h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
					Edit Pet
				</h2>
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-1 lg:grid-cols-2 gap-6"
				>
					<div className="space-y-2">
						<label
							htmlFor="name"
							className="block text-gray-700 font-medium"
						>
							<PawPrint className="inline w-5 h-5 text-blue-500 mr-1" />
							Pet Name
						</label>
						<input
							id="name"
							type="text"
							name="name"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="species"
							className="block text-gray-700 font-medium"
						>
							<Group className="inline w-5 h-5 text-blue-500 mr-1" />
							Species
						</label>
						<input
							id="species"
							type="text"
							name="species"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.species}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="breed"
							className="block text-gray-700 font-medium"
						>
							<List className="inline w-5 h-5 text-blue-500 mr-1" />
							Breed
						</label>
						<input
							id="breed"
							type="text"
							name="breed"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.breed}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="age"
							className="block text-gray-700 font-medium"
						>
							<ArrowUpFromLine className="inline w-5 h-5 text-blue-500 mr-1" />
							Age (in years)
						</label>
						<input
							id="age"
							type="number"
							name="age"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.age}
							onChange={handleInputChange}
							min="0"
							required
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="sex"
							className="block text-gray-700 font-medium"
						>
							<Shield className="inline w-5 h-5 text-blue-500 mr-1" />
							Sex
						</label>
						<select
							id="sex"
							name="sex"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.sex}
							onChange={handleInputChange}
							required
						>
							<option value="">Select Sex</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="vaccinations_status"
							className="block text-gray-700 font-medium"
						>
							<Syringe className="inline w-5 h-5 text-blue-500 mr-1" />
							Vaccination Status
						</label>
						<select
							id="vaccinations_status"
							name="vaccinations_status"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.vaccinations_status}
							onChange={handleInputChange}
							required
						>
							<option value="">Select Vaccination Status</option>
							<option value="Up to Date">Up to Date</option>
							<option value="Not Vaccinated">
								Not Vaccinated
							</option>
						</select>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="last_vaccination_date"
							className="block text-gray-700 font-medium"
						>
							<Calendar className="inline w-5 h-5 text-blue-500 mr-1" />
							Last Vaccination Date
						</label>
						<input
							id="last_vaccination_date"
							type="date"
							name="last_vaccination_date"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={
								formData.last_vaccination_date
									.toISOString()
									.split("T")[0]
							}
							onChange={(e) =>
								handleInputChange(
									e as React.ChangeEvent<HTMLInputElement>
								)
							}
							required
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="health_status"
							className="block text-gray-700 font-medium"
						>
							<Heart className="inline w-5 h-5 text-blue-500 mr-1" />
							Health Status
						</label>
						<select
							id="health_status"
							name="health_status"
							className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							value={formData.health_status}
							onChange={handleInputChange}
							required
						>
							<option value="">Select Health Status</option>
							<option value="Healthy">Healthy</option>
							<option value="Sick">Sick</option>
						</select>
					</div>

					<div className="lg:col-span-2">
						<label
							htmlFor="picture"
							className="block text-gray-700 font-medium"
						>
							<Upload className="inline w-5 h-5 text-blue-500 mr-1" />
							Picture (JPG/PNG)
						</label>
						{imagePreview ? (
							<div className="relative">
								<img
									src={imagePreview}
									alt="Selected"
									className="w-full h-48 rounded-md"
								/>
								<button
									title="Delete Image"
									type="button"
									className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
									onClick={handleDeleteImage}
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
						) : (
							<label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-48 cursor-pointer">
								<input
									type="file"
									accept="image/jpeg, image/png"
									className="hidden"
									onChange={handleFileChange}
									name="picture"
								/>
								<Upload className="w-10 h-10 text-gray-400 mb-2" />
								<span className="text-gray-500">
									Upload Picture
								</span>
							</label>
						)}
					</div>

					<div className="lg:col-span-2">
						<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
							<a
								href="/mypets"
								className="w-full text-center bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition"
							>
								Cancel
							</a>
							<button
								type="submit"
								className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
							>
								Update
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
