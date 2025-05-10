"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/auth/login", user, {
                withCredentials: true,
            });
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);

            let message = "Login failed";
            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                message = error.response.data.error;
            } else if (error.message) {
                message = error.message;
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 5 && user.password.length > 7) {
            setButtonDisabled(false);
        }
    }, [user]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    {loading ? "Logging you in.." : "Welcome Back"}
                </h2>

                <Toaster position="top-center" reverseOrder={false} />

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#23395B] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#23395B] focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-[#23395B] text-white rounded-md hover:bg-opacity-90 transition ${
                            buttonDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        disabled={buttonDisabled}
                    >
                        Log In
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Don’t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="text-gray-50 font-medium hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
