import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../../Context/constant";

interface Vet {
	_id: string;
	name: string;
}

interface Article {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	vet: Vet;
}

interface User {
	_id: string;
	name: string;
}

interface Comment {
	_id: string;
	user: User;
	article: string;
	content: string;
	createdAt: string;
}

export default function OneArticle() {
	const { article } = useParams();
	const { userId } = useAuth();
	const [articleData, setArticleData] = useState<Article | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentContent, setCommentContent] = useState("");
	const [loading, setLoading] = useState(true);

	async function fetchArticle() {
		setLoading(true);
		try {
			const response = await fetch(
				`${BASE_URL}/api/articles/getArticleById`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: article }),
				}
			);

			const data = await response.json();

			if (response.ok) {
				setArticleData(data);
			} else {
				toast.error(data.message || "Failed to fetch article.");
			}
		} catch (error) {
			toast.error("An error occurred while fetching the article.");
		}
		setLoading(false);
	}

	async function fetchComments() {
		try {
			const response = await fetch(`${BASE_URL}/api/comments/get`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ article }),
			});

			const data = await response.json();

			if (response.ok) {
				setComments(data);
			} else {
				toast.error(data.message || "Failed to fetch comments.");
			}
		} catch (error) {
			toast.error("An error occurred while fetching comments.");
		}
	}

	async function handleAddComment(e: React.FormEvent) {
		e.preventDefault();

		if (!commentContent) {
			toast.error("Comment cannot be empty.");
			return;
		}

		try {
			const response = await fetch(`${BASE_URL}/api/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user: userId,
					article,
					content: commentContent,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Comment added successfully!");
				setCommentContent("");
				fetchComments();
			} else {
				toast.error(data.message || "Failed to add comment.");
			}
		} catch (error) {
			toast.error("An error occurred while adding the comment.");
		}
	}

	async function handleDeleteComment(id: string) {
		try {
			const response = await fetch(`${BASE_URL}/api/comments`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Comment deleted successfully!");
				fetchComments();
			} else {
				toast.error(data.message || "Failed to delete comment.");
			}
		} catch (error) {
			toast.error("An error occurred while deleting the comment.");
		}
	}

	useEffect(() => {
		fetchArticle();
		fetchComments();
	}, [article]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spin size="large" />
			</div>
		);
	}

	if (!articleData) {
		return (
			<div className="text-center text-gray-600">
				<p>Article not found.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
			<div className="max-w-3xl mx-auto space-y-6">
				<div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
					<h1 className="text-2xl font-bold text-blue-600 mb-4">
						{articleData.title}
					</h1>
					<p className="text-gray-800">{articleData.content}</p>
					<p className="mt-4 text-sm text-gray-500">
						Published by: {articleData.vet.name} on{" "}
						{new Date(articleData.createdAt).toLocaleDateString()}
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="text-xl font-bold text-gray-800">
						Comments
					</h2>
					<form onSubmit={handleAddComment} className="space-y-4">
						<textarea
							className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							rows={3}
							value={commentContent}
							onChange={(e) => setCommentContent(e.target.value)}
							placeholder="Write your comment here..."
						></textarea>
						<button
							type="submit"
							className="px-6 py-2 text-lg font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition"
						>
							Add Comment
						</button>
					</form>

					{comments.length === 0 ? (
						<p className="text-gray-600">No comments yet.</p>
					) : (
						<div className="space-y-4">
							{comments.map((comment) => (
								<div
									key={comment._id}
									className="bg-white shadow-md rounded-lg p-4 border-l-4 border-yellow-400"
								>
									<p className="text-gray-800">
										{comment.content}
									</p>
									<p className="mt-2 text-sm text-gray-500">
										- {comment.user.name} on{" "}
										{new Date(
											comment.createdAt
										).toLocaleDateString()}
									</p>
									{comment.user._id === userId && (
										<button
											onClick={() =>
												handleDeleteComment(comment._id)
											}
											className="mt-2 text-sm text-red-500 hover:underline flex items-center"
										>
											<Trash2 className="w-4 h-4 mr-1" />
											Delete
										</button>
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
