// /app/api/user/update-password/route.js
import connect from "@/utils/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    await connect();

    const getCookies = await cookies();
    const token = getCookies.get("token")?.value;
    const { oldPassword, newPassword } = await req.json();

    if (!token || !oldPassword || !newPassword)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch)
            return NextResponse.json(
                { error: "Incorrect old password" },
                { status: 401 }
            );

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
