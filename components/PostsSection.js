"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const PostsSection = () => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("latest");

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/fetchPosts?sort=${sortBy}`);
            setPosts(response.data.posts);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [sortBy]);

    return (
        <section>
            <div className="mb-6 mt-3 px-3 max-md:flex justify-center items-center">
                <label
                    htmlFor="sort"
                    className="mr-3 text-gray-50 text-sm font-semibold"
                >
                    Sort by:
                </label>
                <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-950 text-gray-50 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150"
                >
                    <option value="latest">🕒 Latest</option>
                    <option value="top">🔥 Top (most reactions)</option>
                </select>
            </div>

            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    postID={post._id}
                    text={post.text}
                    createdAt={post.createdAt}
                    initialReaction={post.userReaction || null}
                />
            ))}
        </section>
    );
};

export default PostsSection;
