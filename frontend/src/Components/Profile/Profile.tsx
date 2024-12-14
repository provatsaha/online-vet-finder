import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
	_id: string;
	name: string;
	email: string;
	address: string;
	createdAt: Date;
}

export default function Profile() {
	const user_id = localStorage.getItem("user_id");
	const [user, setUser] = useState<User | null>(null);

	async function fetchProfile() {
		const response = await fetch(
			`http://localhost:5000/api/users/${user_id}`
		);
		const data = await response.json();
		if (response.ok) {
			setUser(data);
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
					</div>
				) : (
					<p className="text-center text-gray-500">Loading...</p>
				)}
			</div>
		</div>
	);
}
