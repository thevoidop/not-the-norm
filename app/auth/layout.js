import { Poppins } from "next/font/google";
import "@/app/globals.css";

const poppins = Poppins({
    weight: ["200", "400", "600", "800"],
    subsets: ["latin"],
    variable: "--font-poppins",
});

export default function AuthLayout({ children }) {
    return (
        <div
            className={`${poppins.className} antialiased bg-gray-950 text-gray-50`}
        >
            {children}
        </div>
    );
}
