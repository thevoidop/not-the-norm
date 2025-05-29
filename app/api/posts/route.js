import Post from "@/models/Post";
import User from "@/models/User";
import connect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

        const dailyKey = `${user._id.toString()}_${
            startOfDay.toISOString().split("T")[0]
        }`;

        const dailyCounter = await mongoose.connection.db
            .collection("daily_post_counters")
            .findOneAndUpdate(
                {
                    userId: user._id,
                    date: startOfDay,
                },
                {
                    $inc: { count: 1 },
                    $setOnInsert: {
                        userId: user._id,
                        date: startOfDay,
                        createdAt: new Date(),
                    },
                },
                {
                    upsert: true,
                    returnDocument: "after",
                }
            );

        if (dailyCounter.count > 2) {
            await mongoose.connection.db
                .collection("daily_post_counters")
                .findOneAndUpdate(
                    {
                        userId: user._id,
                        date: startOfDay,
                    },
                    { $inc: { count: -1 } }
                );

            return NextResponse.json(
                {
                    error: "Daily post limit reached. You can only create 2 posts per day.",
                    postsToday: 2,
                    maxPosts: 2,
                    attackPrevented: true,
                },
                { status: 429 }
            );
        }

        if (Math.random() < 0.01) {
            setTimeout(async () => {
                try {
                    const twoDaysAgo = new Date();
                    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                    twoDaysAgo.setHours(0, 0, 0, 0);

                    const result = await mongoose.connection.db
                        .collection("daily_post_counters")
                        .deleteMany({ date: { $lt: twoDaysAgo } });

                    if (result.deletedCount > 0) {
                        console.log(
                            `Auto cleanup: Removed ${result.deletedCount} old counter records`
                        );
                    }
                } catch (cleanupError) {
                    console.error("Auto cleanup failed:", cleanupError);
                }
            }, 0);
        }

        const newPost = new Post({
            text,
            user: user._id,
        });

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                await newPost.save({ session });

                await User.findByIdAndUpdate(
                    user._id,
                    { $push: { posts: newPost._id } },
                    { session }
                );
            });

            return NextResponse.json(
                {
                    message: "Post created successfully",
                    post: newPost,
                    postsToday: dailyCounter.count,
                    remainingPosts: 2 - dailyCounter.count,
                },
                { status: 201 }
            );
        } catch (transactionError) {
            await mongoose.connection.db
                .collection("daily_post_counters")
                .findOneAndUpdate(
                    {
                        userId: user._id,
                        date: startOfDay,
                    },
                    { $inc: { count: -1 } }
                );

            throw transactionError;
        } finally {
            await session.endSession();
        }
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Something went wrong", details: error.message },
            { status: 500 }
        );
    }
}
