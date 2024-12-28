import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../Context/constant";

interface Appointment {
  _id: string;
  vet_id: {
    _id: string;
    name: string; // Name of the vet (populated field)
  };
  serviceId: {
    _id: string;
    name: string; // Name of the service (populated field)
    cost: number; // Cost of the service (populated field)
  };
  createdAt: Date; // Creation date of the appointment
}

export default function AppointmentHistory() {
  const user_id = localStorage.getItem("user_id");
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

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
    fetchAppointments();
  }, [user_id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen-no-nav bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Appointment History
        </h1>

        {appointments ? (
          <div>
            {appointments.length > 0 ? (
              <ul className="space-y-4">
                {appointments.map((appointment) => (
                  <li
                    key={appointment._id}
                    className="p-4 bg-gray-50 border rounded"
                  >
                    <p className="font-semibold">
                      Service: {appointment.serviceId.name}
                    </p>
                    <p>Vet: {appointment.vet_id.name}</p>
                    <p>Price: ${appointment.serviceId.cost}</p>
                    <p>
                      Date:{" "}
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No appointments found.</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
