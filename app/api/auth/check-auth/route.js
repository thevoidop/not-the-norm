import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connect from "@/utils/dbConnect";

export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        await connect();

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user._id,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 401 }
        );
    }
}
