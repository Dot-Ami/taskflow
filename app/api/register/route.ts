import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { userRegisterSchema } from "@/lib/validation/auth";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = userRegisterSchema.parse(body);

        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { user: null, message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                name,
                password_hash: hashedPassword,
            },
        });

        const { password_hash: newUserPassword, ...rest } = newUser;

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return NextResponse.json(
            { user: rest, message: "Confirmation email sent" },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { user: null, message: "Invalid request data", errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { user: null, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
