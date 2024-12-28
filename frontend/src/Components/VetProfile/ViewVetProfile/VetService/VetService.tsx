import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Context/constant";

interface Service {
	_id: string;
	name: string;
	description: string;
	cost: number;
}

export default function VetService() {
	const { id } = useParams<{ id: string }>();
	const vet_id = id;
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState<Service[]>([]);
	const user_id = localStorage.getItem("user_id");
	const navigate = useNavigate();

	async function fetchServices() {
		setLoading(true);
		try {
			const response = await fetch(
				`${BASE_URL}/api/myservices`,
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

	async function handleGetAppointment(serviceId: string) {
		try {
			const response = await fetch(`${BASE_URL}/api/appointments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					vet_id,
					user_id,
					serviceId,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Appointment created successfully!");
				navigate(
					`/payment?amount=${
						services.find((s) => s._id === serviceId)?.cost
					}`
				);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to create appointment.");
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
							<button
								onClick={() =>
									handleGetAppointment(service._id)
								}
								className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition"
							>
								Get Appointment
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
