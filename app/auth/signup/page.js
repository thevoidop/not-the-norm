"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/auth/signup", user, {
                withCredentials: true,
            });
            toast.success("Signup successful");
            router.push("/auth/login");
        } catch (error) {
            console.error("Signup Error: ", error);

            let message = "Signup failed";
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
        if (
            user.email.length > 5 &&
            user.password.length > 7 &&
            user.name.length > 3
        ) {
            setButtonDisabled(false);
        }
    }, [user]);
    // async function handleSignup(e) {
    //     e.preventDefault();
    //     const name = e.target.name.value;
    //     const email = e.target.email.value;
    //     const password = e.target.password.value;

    //     const res = await fetch("/api/auth/signup", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name, email, password }),
    //     });

    //     const data = await res.json();
    //     if (res.ok) {
    //         alert("Signup successful");
    //         window.location.href = "/auth/login";
    //     } else {
    //         alert(data.error || "Something went wrong");
    //     }
    // }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    {loading ? "Signing you up.." : "Create an Account"}
                </h2>

                <Toaster position="top-center" reverseOrder={false} />

                <form className="space-y-5" onSubmit={handleSignup}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            onChange={(e) =>
                                setUser({ ...user, name: e.target.value })
                            }
                            className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#23395B] focus:border-transparent"
                            required
                        />
                    </div>

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
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{" "}
                    <a
                        href="/auth/login"
                        className="text-gray-50 font-medium hover:underline"
                    >
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
