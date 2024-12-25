import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Context/constant";

export default function ForgotPassword() {
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const sendOtp = async () => {
		if (!email) {
			toast.error("Please enter your email.");
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/send-otp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("OTP sent to your email.");
				setStep(2);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to send OTP.");
		}
		setLoading(false);
	};

	const verifyOtp = async () => {
		if (!otp) {
			toast.error("Please enter the OTP.");
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/verify-otp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, otp }),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("OTP verified.");
				setStep(3);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to verify OTP.");
		}
		setLoading(false);
	};

	const resetPassword = async () => {
		if (!newPassword) {
			toast.error("Please enter a new password.");
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/set-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, newPassword }),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("Password reset successfully.");
				navigate("/login");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to reset password.");
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
					Forgot Password
				</h2>
				{step === 1 && (
					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							Enter your email to receive an OTP.
						</p>
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<button
							onClick={sendOtp}
							className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
								loading ? "opacity-75 cursor-not-allowed" : ""
							}`}
							disabled={loading}
						>
							{loading ? (
								<Loader2 className="animate-spin w-5 h-5 mx-auto" />
							) : (
								"Send OTP"
							)}
						</button>
					</div>
				)}
				{step === 2 && (
					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							Enter the OTP sent to your email.
						</p>
						<input
							type="text"
							placeholder="Enter OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<button
							onClick={verifyOtp}
							className={`w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${
								loading ? "opacity-75 cursor-not-allowed" : ""
							}`}
							disabled={loading}
						>
							{loading ? (
								<Loader2 className="animate-spin w-5 h-5 mx-auto" />
							) : (
								"Verify OTP"
							)}
						</button>
					</div>
				)}
				{step === 3 && (
					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							Enter your new password.
						</p>
						<input
							type="password"
							placeholder="Enter new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<button
							onClick={resetPassword}
							className={`w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition ${
								loading ? "opacity-75 cursor-not-allowed" : ""
							}`}
							disabled={loading}
						>
							{loading ? (
								<Loader2 className="animate-spin w-5 h-5 mx-auto" />
							) : (
								"Reset Password"
							)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
