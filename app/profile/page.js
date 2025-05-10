"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { FaHeart } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({ postCount: 0, reactionCount: 0 });
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    // Delete post handler
    const deletePost = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (!confirmed) return;

        try {
            await axios.delete(`/api/posts/${id}`);
            setPosts((prev) => prev.filter((post) => post._id !== id));
            setStats((prev) => ({
                ...prev,
                postCount: prev.postCount - 1,
            }));
            toast.success("Post deleted successfully.");
        } catch (err) {
            toast.error("Failed to delete post.");
        }
    };

    // Password update handler
    const updatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        try {
            await axios.patch("/api/user/update-password", {
                oldPassword,
                newPassword,
            });
            toast.success("Password updated successfully.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to update password."
            );
        }
    };

    // Fetch posts for the user
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/user/posts"); // Get posts for the logged-in user
                if (res.data.error) {
                    setMessage(res.data.error);
                } else {
                    setPosts(res.data.posts); // Set posts data here
                    setStats({
                        postCount: res.data.posts.length,
                        reactionCount: res.data.posts.reduce(
                            (acc, post) => acc + post.reactionCount,
                            0
                        ),
                    });
                }
            } catch (err) {
                setMessage("Failed to fetch posts");
                console.error(err);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto py-10 px-4">
                <Toaster />
                <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

                {/* Stats */}
                <div className="mb-6">
                    <p>
                        📄 Posts: <strong>{stats.postCount}</strong>
                    </p>
                    <p>
                        ❤️ Reactions Received:{" "}
                        <strong>{stats.reactionCount}</strong>
                    </p>
                </div>

                {/* Password change form */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-2">
                        Change Password
                    </h2>

                    <input
                        type="password"
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="block w-full bg-gray-950 border border-gray-700 px-3 py-2 mb-3 rounded"
                    />

                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full bg-gray-950 border border-gray-700 px-3 py-2 mb-3 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full bg-gray-950 border border-gray-700 px-3 py-2 mb-3 rounded"
                    />

                    <button
                        onClick={updatePassword}
                        className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded"
                    >
                        Update Password
                    </button>

                    {message && (
                        <p className="mt-2 text-sm text-red-400">{message}</p>
                    )}
                </div>

                {/* User's Posts */}
                <div className="posts-section space-y-6">
                    {posts.length === 0 ? (
                        <p className="text-center text-lg text-gray-500">
                            No posts to show.
                        </p>
                    ) : (
                        posts
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                            )
                            .map((post) => (
                                <div
                                    key={post._id}
                                    className="post-card bg-gray-800 text-gray-50 p-5 rounded-lg shadow-lg"
                                >
                                    <div className="post-header flex justify-between items-center mb-4">
                                        <div className="user-info flex items-center">
                                            <span className="font-semibold">
                                                {post.user.username ||
                                                    "Anonymous"}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-400">
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="post-actions">
                                            <button
                                                onClick={() =>
                                                    deletePost(post._id)
                                                }
                                                className="text-gray-400 hover:text-gray-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="post-text text-lg mb-4">
                                        {post.text}
                                    </p>
                                    <div className="post-footer flex justify-between items-center">
                                        <div className="reaction-count flex items-center">
                                            <FaHeart className="mr-2 text-red-400" />
                                            <span>
                                                {post.reactionCount} Reactions
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
