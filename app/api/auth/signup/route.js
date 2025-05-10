import User from "@/models/User";
import connect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request) {
    try {
        await connect();

        const reqBody = await request.json();
        const { name, email, password } = reqBody;

        if (!name || name.length < 3) {
            return NextResponse.json(
                { error: "Provide a valid name" },
                { status: 400 }
            );
        }

        if (!email || email.length < 5) {
            return NextResponse.json(
                { error: "Provide a valid email" },
                { status: 400 }
            );
        }

        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully", user: savedUser },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
