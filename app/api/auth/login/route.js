import User from "@/models/User";
import connect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connect();
        const reqBody = await request.json();
        const { email, password } = reqBody;

        if (!email || email.length < 5) {
            return NextResponse.json(
                { error: "Provide a valid email" },
                { status: 400 }
            );
        }

        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: "Provide a valid password" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 }
            );
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Incorrect Password" },
                { status: 400 }
            );
        }

        const tokenData = { id: user._id, email: user.email };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "7d",
        });

        const response = NextResponse.json(
            { message: "User Logged in successfully" },
            { success: true }
        );

        response.cookies.set("token", token, { httpOnly: true });
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
