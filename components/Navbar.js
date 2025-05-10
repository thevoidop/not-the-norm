"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, userID, loading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        router.refresh();
    };

    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-gray-700 text-white text-lg px-6 py-4 md:px-28 md:py-5 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl">
                    not-the-norm
                </Link>
                <div>...</div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 bg-gray-700 text-white text-lg px-6 py-4 md:px-28 md:py-5 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
                not-the-norm
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex gap-10">
                <Link
                    href={isLoggedIn ? `/profile` : "/auth/login"}
                    className="hover:underline transition"
                >
                    Profile
                </Link>
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="hover:underline transition cursor-pointer"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/auth/login"
                        className="hover:underline transition"
                    >
                        Login/SignUp
                    </Link>
                )}
            </div>

            {/* Mobile menu toggle */}
            <button
                className="md:hidden text-2xl"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Mobile menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-gray-700 px-6 py-4 flex flex-col gap-4 md:hidden z-50">
                    <Link
                        href={isLoggedIn ? "/profile" : "/auth/login"}
                        onClick={() => setIsOpen(false)}
                    >
                        Profile
                    </Link>

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-left hover:underline transition cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/auth/login"
                            onClick={() => setIsOpen(false)}
                        >
                            Login/SignUp
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
