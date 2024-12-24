import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
	"pk_test_51QZYpiKnNOn5akGABWkSrXEZQmfijVRJhWZvdodjc6urMbhLFj1VcVH3cioIJMShn7rGfrdKsr21nIez9NbIEOEg00Z2hVSYVx"
);

function Payment({ amount }: { amount: number }) {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		address: "",
	});
	const navigate = useNavigate();

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

		setLoading(true);

		try {
			const response = await fetch(
				"http://localhost:5000/api/create-payment-intent",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ amount: amount * 100 }),
				}
			);

			const { clientSecret } = await response.json();

			const result = await stripe.confirmCardPayment(clientSecret, {
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

			if (result.error) {
				toast.error(result.error.message || "Payment failed");
			} else if (result.paymentIntent?.status === "succeeded") {
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

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Card Details
				</label>
				<div className="mt-1 border p-4 rounded-md shadow-sm">
					<CardElement />
				</div>
			</div>

			<button
				type="submit"
				disabled={!stripe || loading}
				className={`w-full py-3 text-white bg-indigo-600 rounded-md shadow-md font-bold text-lg ${
					loading
						? "opacity-50 cursor-not-allowed"
						: "hover:bg-indigo-700"
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
