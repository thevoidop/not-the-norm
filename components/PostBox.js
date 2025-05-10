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
                toast.success("Post uploaded");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Error creating post:", error);
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
            <textarea
                name="text-box"
                id="text-box"
                className="border rounded-lg w-full max-w-3xl resize-none h-32 p-3"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!isLoggedIn}
            />
            <button
                onClick={handlePost}
                className={`w-full max-w-3xl rounded-lg ${
                    isLoggedIn
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                } text-white text-center uppercase font-bold py-2 text-lg transition`}
                disabled={!isLoggedIn || isLoading}
            >
                {isLoading ? "Posting..." : "Post"}
            </button>
        </section>
    );
};

export default PostBox;
