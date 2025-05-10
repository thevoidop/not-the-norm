"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/utils/AuthContext";

const reactions = [
    {
        name: "like",
        src: "/like.svg",
        bg: "bg-blue-500",
        hoverBg: "hover:bg-blue-400",
    },
    {
        name: "laugh",
        src: "/laugh.svg",
        bg: "bg-green-600",
        hoverBg: "hover:bg-green-400",
    },
    {
        name: "angry",
        src: "/angry.svg",
        bg: "bg-red-600",
        hoverBg: "hover:bg-red-400",
    },
    {
        name: "dislike",
        src: "/dislike.svg",
        bg: "bg-orange-500",
        hoverBg: "hover:bg-orange-300",
    },
];

const PostCard = ({ text, createdAt, postID, initialReaction = null }) => {
    const [selectedReaction, setSelectedReaction] = useState(initialReaction);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            setSelectedReaction(null);
        } else if (isLoggedIn && initialReaction) {
            setSelectedReaction(initialReaction);
        }
    }, [isLoggedIn, initialReaction]);

    const fetchCurrentReaction = async () => {
        if (!isLoggedIn) return;

        try {
            const res = await axios.get(
                `/api/posts/reaction?postID=${postID}`,
                {
                    withCredentials: true,
                }
            );

            if (res.data && res.data.reaction) {
                setSelectedReaction(res.data.reaction);
            } else {
                setSelectedReaction(null);
            }
        } catch (error) {
            console.error("Failed to fetch reaction", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchCurrentReaction();
        }
    }, [isLoggedIn, postID]);

    const handleReactionClick = async (reactionName) => {
        if (!isLoggedIn) {
            toast.error("Please log in to react to posts.");
            return;
        }

        const isRemoving = selectedReaction === reactionName;
        const newReaction = isRemoving ? null : reactionName;
        setSelectedReaction(newReaction);

        try {
            const res = await axios.post("/api/posts/reaction", {
                postID,
                reaction: reactionName,
            });

            const updated = res.data.reaction;
            setSelectedReaction(updated);
        } catch (error) {
            toast.error("Failed to react. Try again later.");
            console.error("Reaction error:", error);
            fetchCurrentReaction();
        }
    };

    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now - createdDate) / (1000 * 60 * 60);

    const formattedTime =
        diffInHours < 24
            ? formatDistanceToNow(createdDate, { addSuffix: true }).replace(
                  "about ",
                  ""
              )
            : format(createdDate, "dd MMMM yyyy");

    return (
        <div className="w-full border-b border-gray-600">
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 md:px-12 py-5 flex flex-col gap-4">
                <span className="font-semibold text-gray-400 text-sm sm:text-base">
                    {formattedTime}
                </span>
                <p className="text-justify text-base text-gray-200">{text}</p>

                <div className="flex flex-wrap justify-around gap-3 sm:gap-4 mt-2">
                    {reactions.map((reaction) => {
                        const isSelected = selectedReaction === reaction.name;
                        return (
                            <div
                                key={reaction.name}
                                onClick={() =>
                                    handleReactionClick(reaction.name)
                                }
                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                    isSelected ? reaction.bg : reaction.hoverBg
                                }`}
                            >
                                <Image
                                    alt={reaction.name}
                                    src={reaction.src}
                                    width={28}
                                    height={28}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
