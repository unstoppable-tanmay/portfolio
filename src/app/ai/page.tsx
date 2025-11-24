"use client";

import ChatView from "@/components/pages/ai/chat-view";
import RecruiterView from "@/components/pages/ai/recruiter-view";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function AiPage() {
    const [activeTab, setActiveTab] = useState<"recruiter" | "chat">("recruiter");

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
                    onClick={() => setActiveTab("recruiter")}
                    className={`px-3 py-1 appearance-none border-none bg-transparent text-sm transition-all duration-300 cursor-pointer ${activeTab === "recruiter"
                        ? "text-white font-medium"
                        : "text-white/50"
                        }`}
                >
                    Check If I am Eligible
                </button>
                <button
                    onClick={() => setActiveTab("chat")}
                    className={`px-3 py-1 appearance-none border-none bg-transparent text-sm transition-all duration-300 cursor-pointer ${activeTab === "chat"
                        ? "text-white font-medium"
                        : "text-white/50"
                        }`}
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