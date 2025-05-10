import Navbar from "@/components/Navbar";
import PostBox from "@/components/PostBox";
import PostsSection from "@/components/PostsSection";
import { AuthProvider } from "@/utils/AuthContext";

export default function Home() {
    return (
        <>
            <AuthProvider>
                <Navbar />
                <main className="py-5">
                    <PostBox />
                    <PostsSection />
                </main>
            </AuthProvider>
        </>
    );
}
