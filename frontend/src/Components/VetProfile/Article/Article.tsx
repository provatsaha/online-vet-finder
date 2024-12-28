import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import { Spin } from "antd";
import { useAuth } from "../../../Context/AuthContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../Context/constant";

interface Article {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
}

export default function Article() {
	const { vetId: vet } = useAuth();
	const [formData, setFormData] = useState({ title: "", content: "" });
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);

	async function fetchArticles() {
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/api/articles/get`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vet }),
			});

			const data = await response.json();

			if (response.ok) {
				setArticles(data);
			} else {
				toast.error(data.message || "Failed to fetch articles.");
			}
		} catch (error) {
			toast.error("An error occurred while fetching articles.");
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchArticles();
	}, [vet]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	async function handleAddArticle(e: React.FormEvent) {
		e.preventDefault();

		if (!formData.title || !formData.content) {
			toast.error("Both title and content are required.");
			return;
		}

		try {
			const response = await fetch(`${BASE_URL}/api/articles`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...formData, vet }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Article added successfully!");
				setFormData({ title: "", content: "" });
				fetchArticles();
			} else {
				toast.error(data.message || "Failed to add article.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		}
	}

	async function handleDeleteArticle(id: string) {
		try {
			const response = await fetch(`${BASE_URL}/api/articles`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Article deleted successfully!");
				fetchArticles();
			} else {
				toast.error(data.message || "Failed to delete article.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
					<h1 className="text-xl font-bold text-blue-600 mb-4">
						Add New Article
					</h1>
					<form onSubmit={handleAddArticle} className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700"
							>
								Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter article title"
							/>
						</div>
						<div>
							<label
								htmlFor="content"
								className="block text-sm font-medium text-gray-700"
							>
								Content
							</label>
							<textarea
								id="content"
								name="content"
								value={formData.content}
								onChange={handleChange}
								rows={4}
								className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter article content"
							/>
						</div>
						<button
							type="submit"
							className="flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition"
						>
							<PlusCircle className="w-5 h-5 mr-2" />
							Add Article
						</button>
					</form>
				</div>

				<div>
					<h1 className="text-2xl font-bold text-blue-600 mb-4">
						Your Articles
					</h1>
					{articles.length === 0 ? (
						<p className="text-center text-gray-600">
							No articles found.
						</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{articles.map((article) => (
								<div
									key={article._id}
									className="bg-white shadow-md rounded-lg p-5 border-t-4 border-yellow-400"
								>
									<Link
										to={`/article/${article._id}`}
										className="text-lg font-bold text-gray-800 mb-2 hover:underline"
									>
										{article.title}
									</Link>
									<p className="mt-2 text-gray-700">
										{article.content.slice(0, 100)}
										{article.content.length > 100 && "..."}
									</p>
									<p className="mt-2 text-sm text-gray-500">
										{new Date(
											article.createdAt
										).toLocaleDateString()}
									</p>
									<button
										onClick={() =>
											handleDeleteArticle(article._id)
										}
										className="mt-4 flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Delete
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
