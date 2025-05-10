import connect from "@/utils/dbConnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connect();

        const body = await request.json();
        const { postID, reaction } = body;

        if (!postID || !reaction) {
            return NextResponse.json(
                { error: "Missing postID or reaction" },
                { status: 400 }
            );
        }

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "User not logged in" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(postID);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const existingIndex = post.reactions.findIndex(
            (r) => r.user.toString() === userId
        );

        let updatedReaction = null;

        if (existingIndex !== -1) {
            const existingReaction = post.reactions[existingIndex];

            if (existingReaction.type === reaction) {
                // Remove reaction (toggle off)
                post.reactions.splice(existingIndex, 1);
            } else {
                // Update reaction
                post.reactions[existingIndex].type = reaction;
                post.reactions[existingIndex].createdAt = new Date();
                updatedReaction = reaction;
            }
        } else {
            post.reactions.push({
                type: reaction,
                user: userId,
                createdAt: new Date(),
            });
            updatedReaction = reaction;
        }

        await post.save();

        return NextResponse.json({
            success: true,
            reaction: updatedReaction || null,
        });
    } catch (error) {
        console.error("Error handling reaction:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const postID = searchParams.get("postID");

        if (!postID) {
            return NextResponse.json(
                { error: "postID is required" },
                { status: 400 }
            );
        }

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;

        const post = await Post.findById(postID);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const reaction = post.reactions.find(
            (r) => r.user.toString() === userId
        );

        return NextResponse.json({ reaction: reaction?.type || null });
    } catch (err) {
        console.error("Error in GET reaction:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
