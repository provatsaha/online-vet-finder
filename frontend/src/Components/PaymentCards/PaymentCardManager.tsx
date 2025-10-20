import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../Context/constant";

interface PaymentCard {
  id: string;
  card_holder_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  billing_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  is_default: boolean;
  created_at: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

const PaymentCardManager: React.FC = () => {
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    card_holder_name: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    billing_address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US",
    } as BillingAddress,
    is_default: false,
  });


  useEffect(() => {
    fetchPaymentCards();
  }, []);

  const fetchPaymentCards = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("Please login to view payment cards");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/payment-cards/${userId}`);
      if (response.ok) {
        const cardsData = await response.json();
        setCards(cardsData);
      } else {
        console.error("Failed to fetch payment cards");
      }
    } catch (error) {
      console.error("Error fetching payment cards:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith("billing_address.")) {
      const addressField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("Please login to add payment card");
      return;
    }

    setLoading(true);

    try {
      // Validate form data
      if (!formData.card_holder_name || !formData.card_number || !formData.expiry_month || 
          !formData.expiry_year || !formData.cvv) {
        toast.error("All card fields are required");
        setLoading(false);
        return;
      }

      // Validate billing address
      const { street, city, state, zip_code } = formData.billing_address;
      if (!street || !city || !state || !zip_code) {
        toast.error("Complete billing address is required");
        setLoading(false);
        return;
      }

      const cardData = {
        user_id: userId,
        card_holder_name: formData.card_holder_name,
        card_number: formData.card_number,
        expiry_month: formData.expiry_month,
        expiry_year: formData.expiry_year,
        cvv: formData.cvv,
        billing_address: formData.billing_address,
        is_default: formData.is_default,
      };

      const response = await fetch(`${BASE_URL}/api/payment-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      });

      if (response.ok) {
        toast.success("Payment card added successfully!");
        setShowAddForm(false);
        setFormData({
          card_holder_name: "",
          card_number: "",
          expiry_month: "",
          expiry_year: "",
          cvv: "",
          billing_address: {
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: "US",
          },
          is_default: false,
        });
        fetchPaymentCards();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add payment card");
      }
    } catch (error) {
      console.error("Error adding payment card:", error);
      toast.error("Failed to add payment card");
    }

    setLoading(false);
  };

  const setDefaultCard = async (cardId: string) => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await fetch(`${BASE_URL}/api/payment-cards/${cardId}/default`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        toast.success("Default card updated!");
        fetchPaymentCards();
      } else {
        toast.error("Failed to update default card");
      }
    } catch (error) {
      console.error("Error setting default card:", error);
      toast.error("Failed to update default card");
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/payment-cards/${cardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Payment card deleted!");
        fetchPaymentCards();
      } else {
        toast.error("Failed to delete payment card");
      }
    } catch (error) {
      console.error("Error deleting payment card:", error);
      toast.error("Failed to delete payment card");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Cards</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {showAddForm ? "Cancel" : "Add New Card"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Payment Card</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="card_holder_name"
                  value={formData.card_holder_name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="card_number"
                  value={formData.card_number}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Month
                </label>
                <select
                  name="expiry_month"
                  value={formData.expiry_month}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Year
                </label>
                <select
                  name="expiry_year"
                  value={formData.expiry_year}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3">Billing Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="billing_address.street"
                    value={formData.billing_address.street}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="billing_address.city"
                    value={formData.billing_address.city}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="New York"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="billing_address.state"
                    value={formData.billing_address.state}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="NY"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="billing_address.zip_code"
                    value={formData.billing_address.zip_code}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="10001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="billing_address.country"
                    value={formData.billing_address.country}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Set as default payment method</span>
              </label>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Adding..." : "Add Card"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {cards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No payment cards added yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-indigo-600 hover:text-indigo-700 underline"
              >
                Add your first card
              </button>
            </div>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className={`border rounded-lg p-4 ${
                  card.is_default ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-lg font-semibold text-gray-800">
                        {card.card_number}
                      </div>
                      {card.is_default && (
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Cardholder:</strong> {card.card_holder_name}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Expires:</strong> {card.expiry_month}/{card.expiry_year}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>Billing:</strong> {card.billing_address.street}, {card.billing_address.city}, {card.billing_address.state} {card.billing_address.zip_code}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!card.is_default && (
                      <button
                        onClick={() => setDefaultCard(card.id)}
                        className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCardManager;
