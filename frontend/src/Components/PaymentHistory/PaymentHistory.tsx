import { useState, useEffect } from "react";
import { BASE_URL } from "../../Context/constant";
import toast from "react-hot-toast";

interface Payment {
  _id: string;
  appointment_id: {
    _id: string;
    name: string;
    price: number;
    createdAt: string;
  };
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  billing_name: string;
  billing_email: string;
  billing_address: string;
  createdAt: string;
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please log in to view payment history");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/payments/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        toast.error("Failed to fetch payment history");
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Payment History
          </h1>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Payment History
              </h3>
              <p className="text-gray-500">
                You haven't made any payments yet. Your payment history will
                appear here after you complete your first appointment payment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {payment.appointment_id?.name || "Appointment Payment"}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Payment Method:</span>{" "}
                        {payment.payment_method || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Billing Name:</span>{" "}
                        {payment.billing_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Billing Email:</span>{" "}
                        {payment.billing_email || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Billing Address:</span>{" "}
                        {payment.billing_address || "N/A"}
                      </p>
                    </div>
                  </div>

                  {payment.appointment_id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Appointment:</span>{" "}
                        {payment.appointment_id.name} - $
                        {payment.appointment_id.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Appointment Date:</span>{" "}
                        {formatDate(payment.appointment_id.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

