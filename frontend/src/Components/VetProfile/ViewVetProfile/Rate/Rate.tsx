import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import { Star, Send } from "lucide-react";

export default function Rate() {
	const { vet } = useParams();
	const { userId } = useAuth();
	const navigate = useNavigate();
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0); // For hover effect
	const [review, setReview] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!rating || !review) {
			toast.error("Please provide both a rating and a review.");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("http://localhost:5000/api/rate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ vet, user: userId, rating, review }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Rating submitted successfully!");
				navigate(`/vet-profile/${vet}`);
			} else {
				toast.error(data.message || "Failed to submit rating.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-100 to-white p-6">
			<div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-blue-500/50 max-w-lg w-full">
				<h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
					Rate Your Experience
				</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Your Rating
						</label>
						<div className="flex items-center space-x-2">
							{Array.from({ length: 5 }).map((_, index) => (
								<button
									title="Rate"
									key={index}
									type="button"
									onClick={() => setRating(index + 1)}
									onMouseEnter={() =>
										setHoverRating(index + 1)
									}
									onMouseLeave={() => setHoverRating(0)}
									className="p-1"
								>
									<Star
										size={24}
										className={`${
											(hoverRating || rating) > index
												? "text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								</button>
							))}
						</div>
					</div>

					<div>
						<label
							htmlFor="review"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Your Review
						</label>
						<textarea
							id="review"
							name="review"
							value={review}
							onChange={(e) => setReview(e.target.value)}
							rows={5}
							className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="Write your review here..."
						></textarea>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition ${
							loading ? "opacity-75 cursor-not-allowed" : ""
						}`}
					>
						{loading ? "Submitting..." : "Submit Review"}
						<Send className="inline ml-2" size={20} />
					</button>
				</form>
			</div>
		</div>
	);
}
