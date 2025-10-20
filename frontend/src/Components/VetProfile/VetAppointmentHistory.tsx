import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../Context/constant";

interface Appointment {
  _id: string;
  user_id: { _id: string; name: string };
  serviceId: { _id: string; name: string; cost: number };
  notes?: string;
  symptoms?: string;
  createdAt: Date;
}

export default function VetAppointmentHistory() {
  const { vetId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(`[VetAppointmentHistory] Component loaded with vetId: ${vetId}`);

  async function fetchAppointments() {
    setLoading(true);
    console.log(
      `[VetAppointmentHistory] Fetching appointments for vetId: ${vetId}`
    );
    console.log(
      `[VetAppointmentHistory] API URL: ${BASE_URL}/api/appointments/vet/${vetId}`
    );

    if (!vetId) {
      console.error(`[VetAppointmentHistory] No vetId found!`);
      toast.error("No vet ID found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/appointments/vet/${vetId}`);
      console.log(
        `[VetAppointmentHistory] Response status: ${response.status}`
      );

      const data = await response.json();
      console.log(`[VetAppointmentHistory] Response data:`, data);

      if (response.ok) {
        setAppointments(data);
      } else {
        console.error(`[VetAppointmentHistory] Error response:`, data);
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error(`[VetAppointmentHistory] Fetch error:`, error);
      toast.error("Failed to fetch appointment history");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAppointments();
  }, [vetId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen-no-nav bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Appointment History
        </h1>
        {appointments && appointments.length > 0 ? (
          <ul>
            {appointments.map((appt) => (
              <li key={appt._id} className="mb-4 border-b pb-2">
                <div>
                  <strong>User:</strong> {appt.user_id.name}
                </div>
                <div>
                  <strong>Service:</strong> {appt.serviceId.name} ($
                  {appt.serviceId.cost})
                </div>
                <div>
                  <strong>Notes:</strong> {appt.notes || "-"}
                </div>
                <div>
                  <strong>Symptoms:</strong> {appt.symptoms || "-"}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(appt.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
}
