import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../../Context/constant";

interface Article {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
}

export default function VetArticle() {
	const { vet } = useParams();
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

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
					Articles by the Vet
				</h1>
				{articles.length === 0 ? (
					<p className="text-center text-gray-600">
						No articles found.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{articles.map((article) => (
							<div
								key={article._id}
								className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-yellow-400"
							>
								<Link
									to={`/article/${article._id}`}
									className="text-lg font-bold text-gray-800 mb-2 hover:underline"
								>
									{article.title}
								</Link>
								<p className="text-gray-600 mb-4">
									{article.content.slice(0, 150)}
									{article.content.length > 150 && "..."}
								</p>
								<p className="text-sm text-gray-500">
									Published on:{" "}
									{new Date(
										article.createdAt
									).toLocaleDateString()}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
