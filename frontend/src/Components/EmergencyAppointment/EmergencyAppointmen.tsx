import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../Context/constant";

interface User {
  _id: string;
  name: string;
  address: string;
}

interface Vet {
  name: string;
  location: string;
  specialization: string;
}

export default function EmergencyAppointment() {
  const [user, setUser] = useState<User | null>(null);
  const [vet, setVet] = useState<Vet | null>(null); // Store found vet
  const [noVet, setNoVet] = useState<string | null>(null); // No vet found message
  const user_id = localStorage.getItem("user_id");

  async function fetchUser() {
    const response = await fetch(`${BASE_URL}/api/users/${user_id}`);
    const data = await response.json();
    if (response.ok) {
      setUser(data);
    } else {
      toast.error(data.message);
    }
  }

  async function handleEmergencyAppointment() {
    if (!user || !user.address) {
      toast.error("User address not available");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/vets/emergency?address=${encodeURIComponent(
          user.address
        )}`
      );
      const data = await response.json();

      if (response.ok) {
        setVet(data.vets[0]); // Set the first matched vet
        setNoVet(null); // Clear the no-vet message
      } else {
        setVet(null); // Clear any previously found vet
        setNoVet(data.message); // Show no-vet message or tips
      }
    } catch (error) {
      console.error("Error fetching emergency info:", error);
      toast.error("Failed to fetch emergency appointment info");
    }
  }

  useEffect(() => {
    fetchUser();
  }, [user_id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen-no-nav bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Emergency Appointment
        </h1>

        {user ? (
          <div>
            <p className="text-lg font-semibold">Name: {user.name}</p>
            <p className="text-lg font-semibold">Address: {user.address}</p>

            <button
              onClick={handleEmergencyAppointment}
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Find Emergency Vet
            </button>

            {vet && (
              <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
                <h2 className="text-lg font-bold">Emergency Vet Found</h2>
                <p className="text-md">Name: {vet.name}</p>
                <p className="text-md">Location: {vet.location}</p>
                <p className="text-md">Specialization: {vet.specialization}</p>
              </div>
            )}

            {noVet && (
              <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
                <h2 className="text-lg font-bold">
                  No Vets Found in Your Location
                </h2>
                <p className="text-md">{noVet}</p>
                <p className="text-md mt-2 font-semibold">
                  Emergency Care Tips:
                </p>
                <ul className="list-disc pl-5 text-md">
                  <li>Stay calm and assess the situation.</li>
                  <li>
                    Contact an emergency vet or animal hospital immediately.
                  </li>
                  <li>Keep your pet warm and transport them carefully.</li>
                  <li>
                    If necessary, perform first aid on your pet until help
                    arrives.
                  </li>
                </ul>
                <p className="text-md mt-4 font-semibold">
                  Emergency Hotlines in Bangladesh:
                </p>
                <ul className="list-disc pl-5 text-md">
                  <li>Animal Emergency Services: 01900-00000</li>
                  <li>Pet Care Emergency Line: 01800-11111</li>
                </ul>
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
