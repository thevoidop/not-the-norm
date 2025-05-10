import { NextResponse } from "next/server";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";
import connect from "@/utils/dbConnect";

export async function DELETE(request, { params }) {
    try {
        await connect();

        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        const parames = await params;
        const postId = parames.id;

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        if (!post.user || post.user.toString() !== decoded.id) {
            return NextResponse.json({ error: "Not allowed" }, { status: 403 });
        }

        await Post.findByIdAndDelete(postId);

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
