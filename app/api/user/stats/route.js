// /app/api/user/stats/route.js
import connect from "@/utils/dbConnect";
import Post from "@/models/Post";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
    await connect();

    const getCookies = await cookies();
    const token = getCookies.get("token")?.value;
    if (!token)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const posts = await Post.find({ author: decoded.id }).lean();

        const totalReactions = posts.reduce(
            (acc, post) => acc + (post.reactions?.length || 0),
            0
        );

        return NextResponse.json({
            postCount: posts.length,
            reactionCount: totalReactions,
            posts,
        });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to load stats" },
            { status: 500 }
        );
    }
}
