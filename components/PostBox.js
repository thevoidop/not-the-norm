"use client";

import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/utils/AuthContext";

const PostBox = () => {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { isLoggedIn } = useAuth();

    const handlePost = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            toast.error("Please log in to post.");
            return;
        }

        if (!text.trim()) {
            toast.error("Please enter some text for your post");
            return;
        }

        if (text.length > 1000) {
            toast.error("Post must be 1000 characters or less");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "/api/posts",
                { text },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                setText("");
                const { remainingPosts } = response.data;

                if (remainingPosts === 1) {
                    toast.success(
                        "Post created! You have 1 post remaining today"
                    );
                } else if (remainingPosts === 0) {
                    toast.success(
                        "Post created! Daily limit reached - no more posts today"
                    );
                } else {
                    toast.success("Post uploaded successfully!");
                }

                window.location.href = "/";
            }
        } catch (error) {
            console.error("Error creating post:", error);

            if (error.response?.status === 429) {
                toast.error(
                    "Daily post limit reached! You can only create 2 posts per day. Try again tomorrow.",
                    {
                        duration: 6000,
                        icon: "🚫",
                        style: {
                            borderRadius: "10px",
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #fecaca",
                            fontSize: "14px",
                            padding: "16px",
                        },
                    }
                );
            } else if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else if (error.response?.status === 400) {
                toast.error(
                    error.response.data.error || "Invalid post content"
                );
            } else {
                toast.error(
                    error.response?.data?.error ||
                        "Something went wrong. Please try again."
                );
            }

            setError(
                error.response?.data?.error ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            id="post-box"
            className="flex flex-col items-center gap-4 border-b-4 px-4 sm:px-10 md:px-20 lg:px-36 xl:px-64 py-6"
        >
            <Toaster />
            <div className="w-full max-w-3xl">
                <textarea
                    name="text-box"
                    id="text-box"
                    className="border rounded-lg w-full resize-none h-32 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={!isLoggedIn || isLoading}
                    maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>{text.length}/1000 characters</span>
                    <span className="text-xs">Daily limit: 2 posts</span>
                </div>
            </div>

            {error && (
                <div className="w-full max-w-3xl text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                </div>
            )}

            <button
                onClick={handlePost}
                className={`w-full max-w-3xl rounded-lg ${
                    isLoggedIn && text.trim() && !isLoading
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                } text-white text-center uppercase font-bold py-2 text-lg transition`}
                disabled={!isLoggedIn || isLoading || !text.trim()}
            >
                {isLoading ? "Posting..." : "Post"}
            </button>
        </section>
    );
};

export default PostBox;
