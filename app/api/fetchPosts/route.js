import connect from "@/utils/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const sort = searchParams.get("sort") || "latest";

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        let userId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                userId = decoded.id;
            } catch {}
        }

        const posts = await Post.find({}).lean().populate("reactions.user");

        posts.forEach((post) => {
            post.reactionCount = post.reactions.length;
            post.userReaction = userId
                ? post.reactions.find((r) => r.user?._id.toString() === userId)
                      ?.type || null
                : null;
        });

        let sortedPosts = posts;
        if (sort === "top") {
            sortedPosts = posts.sort(
                (a, b) =>
                    b.reactionCount - a.reactionCount ||
                    new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else {
            sortedPosts = posts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        return NextResponse.json({ posts: sortedPosts });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
