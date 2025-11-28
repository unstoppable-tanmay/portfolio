"use client";

import ChatView from "@/components/pages/ai/chat-view";
import RecruiterView from "@/components/pages/ai/recruiter-view";
import { Link } from "next-view-transitions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function AiPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AiPageContent />
        </Suspense>
    );
}

function AiPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = searchParams.get("tab") === "recruiter" ? "recruiter" : "chat";

    useEffect(() => {
        if (!searchParams.has("tab")) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", "chat");
            router.replace(`${pathname}?${params.toString()} `);
        }
    }, [searchParams, router, pathname]);

    const handleTabChange = (tab: "recruiter" | "chat") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.replace(`${pathname}?${params.toString()} `);
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="tab-options flex gap-2 py-2 items-center">
                <Link
                    prefetch={true}
                    className="inline-flex p-2 text-white"
                    href="/"
                    onClick={() => {
                        document.documentElement.dataset.transition = "back";
                    }}
                >
                    <FiArrowLeft className="text-lg" />
                </Link>
                <button
                    onClick={() => handleTabChange("recruiter")}
                    className={`px-3 py-1 appearance-none border-none bg-transparent text-sm transition-all duration-300 cursor-pointer ${activeTab === "recruiter"
                        ? "text-white font-medium"
                        : "text-white/50"
                        } `}
                >
                    Recruiter&apos;s AI
                </button>
                <button
                    onClick={() => handleTabChange("chat")}
                    className={`px-3 py-1 appearance-none border-none bg-transparent text-sm transition-all duration-300 cursor-pointer ${activeTab === "chat"
                        ? "text-white font-medium"
                        : "text-white/50"
                        } `}
                >
                    Chat With Me &#10022;
                </button>
            </div>
            <div className="w-full flex-1 h-full overflow-hidden">
                {activeTab === "recruiter" ? <RecruiterView /> : <ChatView />}
            </div>
        </div >
    );
}