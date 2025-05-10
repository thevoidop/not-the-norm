import connect from "@/utils/dbConnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        await connect();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        let userId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                userId = decoded.id;
            } catch {}
        }

        if (!userId) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const posts = await Post.find({ user: userId })
            .lean()
            .populate("reactions.user");

        posts.forEach((post) => {
            post.reactionCount = post.reactions.length;
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
