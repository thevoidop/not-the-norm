import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext";

const poppins = Poppins({
    weight: ["200", "400", "600", "800"],
    subsets: ["latin"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "not-the-norm",
    description: "Post your unpopular opinions anonymously!",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${poppins.className} antialiased bg-gray-950 text-gray-50`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
