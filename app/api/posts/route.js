import Post from "@/models/Post";
import User from "@/models/User";
import connect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connect();

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "User not logged in" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        let text;
        const contentType = request.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const reqBody = await request.json();
            text = reqBody.text;
        } else if (
            contentType &&
            contentType.includes("application/x-www-form-urlencoded")
        ) {
            const formData = await request.formData();
            text = formData.get("text");
        } else if (contentType && contentType.includes("text/plain")) {
            text = await request.text();
        } else {
            try {
                const reqBody = await request.json();
                text = reqBody.text;
            } catch (error) {
                try {
                    const formData = await request.formData();
                    text = formData.get("text");
                } catch (e) {
                    try {
                        text = await request.text();
                    } catch (err) {
                        return NextResponse.json(
                            {
                                error: "Unsupported content type or invalid request body",
                            },
                            { status: 400 }
                        );
                    }
                }
            }
        }

        if (!text || text.length < 1 || text.length > 1000) {
            return NextResponse.json(
                {
                    error: "Content length should be between 1 and 1000 characters",
                },
                { status: 400 }
            );
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const today = new Date();
        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );

        const todayPostCount = await Post.countDocuments({
            user: user._id,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        if (todayPostCount >= 2) {
            return NextResponse.json(
                {
                    error: "Daily post limit reached. You can only create 2 posts per day.",
                    postsToday: todayPostCount,
                    maxPosts: 2,
                },
                { status: 429 }
            );
        }

        const newPost = new Post({
            text,
            user: user._id,
        });

        await newPost.save();

        user.posts.push(newPost._id);
        await user.save();

        return NextResponse.json(
            {
                message: "Post created successfully",
                post: newPost,
                postsToday: todayPostCount + 1,
                remainingPosts: 2 - (todayPostCount + 1),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Something went wrong", details: error.message },
            { status: 500 }
        );
    }
}
