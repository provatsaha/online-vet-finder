import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { BASE_URL } from "../../../Context/constant";

interface User {
	_id: string;
	name: string;
	email: string;
	address: string;
	createdAt: Date;
}

export interface Vet {
	_id: string;
	name: string;
	location: string;
	specialization: string;
	certifications: string[];
	createdAt: Date;
	user: User;
}

export default function ViewVetProfile() {
	const { id } = useParams<{ id: string }>();
	const vetId = id;
	const [vet, setVet] = useState<Vet | null>(null);
	const [loading, setLoading] = useState(true);
	const { vetId: myVetID } = useAuth();

	async function fetchVet() {
		setLoading(true);
		try {
			const response = await fetch(
				`${BASE_URL}/api/vets/${vetId}`
			);
			const data = await response.json();
			if (response.ok) {
				setVet(data);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to fetch vet information");
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchVet();
	}, [vetId]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-50">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="bg-gray-100 min-h-screen p-6">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<h1 className="text-3xl font-bold text-indigo-600 mb-4">
					Vet Profile
				</h1>
				{vet ? (
					<div>
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-700">
								Name:
							</h2>
							<p className="text-lg text-gray-600">{vet.name}</p>
						</div>
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-700">
								Location:
							</h2>
							<p className="text-lg text-gray-600">
								{vet.location}
							</p>
						</div>
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-700">
								Specialization:
							</h2>
							<p className="text-lg text-gray-600">
								{vet.specialization}
							</p>
						</div>
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-700">
								Certifications:
							</h2>
							<ul className="list-disc list-inside text-lg text-gray-600">
								{vet.certifications.map((cert, index) => (
									<li key={index}>{cert}</li>
								))}
							</ul>
						</div>
						<div>
							<h2 className="text-xl font-semibold text-gray-700">
								Created At:
							</h2>
							<p className="text-lg text-gray-600">
								{new Date(vet.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
				) : (
					<p className="text-lg text-gray-600">Vet not found</p>
				)}
				<div className="mt-8 flex justify-end">
					<Link
						to={`/vet-profile/${vetId}/service`}
						className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
					>
						View Services
					</Link>
					{myVetID !== vetId && (
						<Link
							to={`/rate-vet/${vetId}`}
							className="px-6 py-2 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition ml-4"
						>
							Rate Vet
						</Link>
					)}
					<Link
						to={`/view-ratings/${vetId}`}
						className="px-6 py-2 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition ml-4"
					>
						View Ratings
					</Link>
					<Link
						to={`/view-article/${vetId}`}
						className="px-6 py-2 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition ml-4"
					>
						View Articles
					</Link>
				</div>
			</div>
		</div>
	);
}
