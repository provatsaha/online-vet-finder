import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Context/constant";

interface SavedCard {
  id: string;
  card_holder_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
}

const stripePromise = loadStripe(
  "pk_test_51QZYpiKnNOn5akGABWkSrXEZQmfijVRJhWZvdodjc6urMbhLFj1VcVH3cioIJMShn7rGfrdKsr21nIez9NbIEOEg00Z2hVSYVx"
);

function Payment({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [useNewCard, setUseNewCard] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Debug: Check if user_id and appointment_id are available
    const userId = localStorage.getItem("user_id");
    const appointmentId = localStorage.getItem("currentAppointmentId");
    console.log("Payment component loaded - User ID:", userId, "Appointment ID:", appointmentId);
    
    if (!userId) {
      console.error("No user_id found in localStorage");
      toast.error("User session not found. Please login again.");
    }
    
    if (!appointmentId) {
      console.error("No currentAppointmentId found in localStorage");
      toast.error("Appointment not found. Please book appointment again.");
    }

    // Fetch saved payment cards
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const response = await fetch(`${BASE_URL}/api/payment-cards/${userId}`);
      if (response.ok) {
        const cards = await response.json();
        setSavedCards(cards);
        
        // Auto-select default card if available
        const defaultCard = cards.find((card: SavedCard) => card.is_default);
        if (defaultCard) {
          setSelectedCard(defaultCard.id);
          setUseNewCard(false);
        }
      }
    } catch (error) {
      console.error("Error fetching saved cards:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    if (!formData.name || !formData.email || !formData.address) {
      toast.error("All fields are required.");
      return;
    }

    if (!useNewCard && !selectedCard) {
      toast.error("Please select a saved card or use a new card.");
      return;
    }

    // Clear any previous card errors
    setCardError("");

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }),
      });

      const { clientSecret } = await response.json();

      let result;
      
      if (useNewCard) {
        // Use new card via Stripe Elements
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: formData.name,
              email: formData.email,
              address: {
                line1: formData.address,
              },
            },
          },
        });
      } else {
        // Use saved card - get card details and create payment method
        const savedCard = savedCards.find(card => card.id === selectedCard);
        if (!savedCard) {
          toast.error("Selected card not found");
          setLoading(false);
          return;
        }

        // For saved cards, we'll create a payment method using the stored card details
        // Note: In a real implementation, you'd use Stripe's saved payment methods
        // For now, we'll simulate using the saved card data
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: savedCard.card_holder_name,
              email: formData.email,
              address: {
                line1: formData.address,
              },
            },
          },
        });
      }

      if (result.error) {
        setCardError(result.error.message || "Payment failed");
        toast.error(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        // Store payment history
        try {
          const userId = localStorage.getItem("user_id");
          const appointmentId = localStorage.getItem("currentAppointmentId");

          console.log("Debug - User ID:", userId);
          console.log("Debug - Appointment ID:", appointmentId);

          if (!userId || !appointmentId) {
            console.error(
              "Missing user_id or appointment_id for payment storage"
            );
            toast.error(
              "Payment successful but failed to store payment history"
            );
            return;
          }

          const paymentData = {
            user_id: userId,
            appointment_id: appointmentId,
            amount: amount,
            stripe_payment_intent_id: result.paymentIntent.id,
            status: "succeeded",
            payment_method: `**** **** **** ${
              result.paymentIntent.charges?.data[0]?.payment_method_details
                ?.card?.last4 || "****"
            }`,
            billing_name: formData.name,
            billing_email: formData.email,
            billing_address: formData.address,
          };

          console.log("Debug - Payment data being sent:", paymentData);

          const response = await fetch(`${BASE_URL}/api/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          });

          if (response.ok) {
            console.log("Payment history stored successfully");
          } else {
            console.error(
              "Failed to store payment history:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Failed to store payment history:", error);
        }

        toast.success("Payment successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Complete Your Payment
      </h1>
      <p className="text-gray-600 text-center">
        Please provide your details and payment information.
      </p>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your full name"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your email address"
          required
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your billing address"
          required
        />
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        
        {savedCards.length > 0 && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="use-saved-card"
                name="payment-method"
                checked={!useNewCard}
                onChange={() => setUseNewCard(false)}
                className="mr-2"
              />
              <label htmlFor="use-saved-card" className="text-sm font-medium text-gray-700">
                Use saved card
              </label>
            </div>
            
            {!useNewCard && (
              <div className="ml-6 space-y-2">
                {savedCards.map((card) => (
                  <div key={card.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`card-${card.id}`}
                      name="saved-card"
                      value={card.id}
                      checked={selectedCard === card.id}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`card-${card.id}`} className="text-sm text-gray-600">
                      {card.card_holder_name} - **** **** **** {card.card_number.slice(-4)} 
                      {card.is_default && <span className="text-green-600 font-semibold ml-2">(Default)</span>}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="radio"
            id="use-new-card"
            name="payment-method"
            checked={useNewCard}
            onChange={() => setUseNewCard(true)}
            className="mr-2"
          />
          <label htmlFor="use-new-card" className="text-sm font-medium text-gray-700">
            Use new card
          </label>
        </div>
      </div>

      {useNewCard && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Card Details
          </label>
          <div
            className={`mt-1 border p-4 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 ${
              cardError ? "border-red-500" : ""
            }`}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          {cardError && <p className="mt-1 text-sm text-red-600">{cardError}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 text-white bg-indigo-600 rounded-md shadow-md font-bold text-lg ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
        }`}
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export function PaymentPage() {
  const [searchParams] = useSearchParams();
  const amount = parseFloat(searchParams.get("amount") || "0");

  if (amount <= 0) {
    return (
      <div className="text-center text-red-600">
        Error: Invalid payment amount
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Elements stripe={stripePromise}>
        <Payment amount={amount} />
      </Elements>
    </div>
  );
}
