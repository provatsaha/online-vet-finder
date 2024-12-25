import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../Context/constant";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Please fill in all fields.");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Login successful!");
				setAuth(data.user.id, data.user.vetId);
				navigate("/profile");
			} else {
				toast.error(data.message || "Invalid credentials.");
			}
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
				<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Login to Your Account
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm text-gray-600"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm text-gray-600"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition ${
							loading ? "opacity-75 cursor-not-allowed" : ""
						}`}
						disabled={loading}
					>
						{loading ? (
							<span className="flex items-center justify-center">
								<Loader2 className="w-5 h-5 animate-spin mr-2" />
								Logging in...
							</span>
						) : (
							"Login"
						)}
					</button>
				</form>
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/signup"
							className="text-blue-500 hover:underline"
						>
							Sign up
						</Link>
					</p>
					<p className="text-sm text-gray-600 mt-2">
						<Link
							to="/forgot-password"
							className="text-blue-500 hover:underline"
						>
							Forgot your password?
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
