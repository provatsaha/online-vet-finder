import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../Context/constant";

interface User {
	_id: string;
	name: string;
	email: string;
	address: string;
	createdAt: Date;
}

interface Appointment {
	_id: string; // MongoDB document ID
	vet_id: {
		_id: string;
		name: string; // Name of the vet (populated field)
	};
	user_id: string; // ID of the user
	serviceId: {
		_id: string;
		name: string; // Name of the service (populated field)
		cost: number; // Cost of the service (populated field)
	};
	createdAt: Date; // Creation date of the appointment
	name: string; // Name of the service
	price: number; // Price of the service
}

export default function Profile() {
	const user_id = localStorage.getItem("user_id");
	const [user, setUser] = useState<User | null>(null);
	const [appointments, setAppointments] = useState<Appointment[] | null>(
		null
	);
	const [showAppointments, setShowAppointments] = useState(false);

	async function fetchProfile() {
		const response = await fetch(`${BASE_URL}/api/users/${user_id}`);
		const data = await response.json();
		if (response.ok) {
			setUser(data);
		} else {
			toast.error(data.message);
		}
	}
	async function fetchAppointments() {
		const response = await fetch(`${BASE_URL}/api/appointments/${user_id}`);
		const data = await response.json();
		if (response.ok) {
			setAppointments(data);
		} else {
			toast.error(data.message);
		}
	}

	useEffect(() => {
		fetchProfile();
	}, [user_id]);
	return (
		<div className="flex flex-col items-center justify-center h-screen-no-nav bg-gray-100 p-4">
			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
				{user ? (
					<div>
						<p className="text-lg font-semibold">
							Name: {user.name}
						</p>
						<p className="text-lg font-semibold">
							Email: {user.email}
						</p>
						<p className="text-lg font-semibold">
							Address: {user.address}
						</p>
						<p className="text-sm text-gray-500 mt-2">
							Joined:{" "}
							{new Date(user.createdAt).toLocaleDateString()}
						</p>
						<a
							href="/mypets"
							className="mt-4 w-full block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							My pets
						</a>
						<button
							onClick={() => {
								setShowAppointments(!showAppointments);
								if (!showAppointments) fetchAppointments();
							}}
							className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
						>
							{showAppointments
								? "Hide Appointment History"
								: "Appointment History"}
						</button>
						{showAppointments && appointments && (
							<div className="mt-4">
								<h2 className="text-xl font-semibold mb-2">
									Appointment History
								</h2>
								{appointments.length > 0 ? (
									<ul className="space-y-4">
										{appointments.map((appointment) => (
											<li
												key={appointment._id}
												className="p-4 bg-gray-50 border rounded"
											>
												<p className="font-semibold">
													Service:{" "}
													{appointment.serviceId.name}
												</p>
												<p>
													Vet:{" "}
													{appointment.vet_id.name}
												</p>
												<p>
													Price: $
													{appointment.serviceId.cost}
												</p>
												<p>
													Date:{" "}
													{new Date(
														appointment.createdAt
													).toLocaleDateString()}
												</p>
											</li>
										))}
									</ul>
								) : (
									<p className="text-gray-500">
										No appointments found.
									</p>
								)}
							</div>
						)}
					</div>
				) : (
					<p className="text-center text-gray-500">Loading...</p>
				)}
			</div>
		</div>
	);
}
