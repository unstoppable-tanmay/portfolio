"use client";

import { TANMAY } from "@/data/portfolio";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";

export default function ChatView() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Rate limiting with localStorage
    const RATE_LIMIT_KEY = 'chat_rate_limit';
    const MAX_REQUESTS = 10;
    const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

    const checkRateLimit = (): { allowed: boolean; remaining: number; resetTime: number } => {
        const now = Date.now();
        const stored = localStorage.getItem(RATE_LIMIT_KEY);

        if (!stored) {
            const data = { count: 0, resetTime: now + WINDOW_MS };
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
            return { allowed: true, remaining: MAX_REQUESTS, resetTime: data.resetTime };
        }

        const data = JSON.parse(stored);

        // Reset if window expired
        if (now > data.resetTime) {
            const newData = { count: 0, resetTime: now + WINDOW_MS };
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newData));
            return { allowed: true, remaining: MAX_REQUESTS, resetTime: newData.resetTime };
        }

        // Check if limit exceeded
        if (data.count >= MAX_REQUESTS) {
            return { allowed: false, remaining: 0, resetTime: data.resetTime };
        }

        return { allowed: true, remaining: MAX_REQUESTS - data.count, resetTime: data.resetTime };
    };

    const incrementRateLimit = () => {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            data.count += 1;
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChatSubmit = async () => {
        if (!input.trim()) return;

        // Check rate limit
        const { allowed, remaining, resetTime } = checkRateLimit();

        if (!allowed) {
            const hoursLeft = Math.ceil((resetTime - Date.now()) / (1000 * 60 * 60));
            const limitMessage = {
                role: "assistant",
                content: `You've reached the daily limit of ${MAX_REQUESTS} messages. This helps manage API costs. Your limit will reset in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}. Thank you for understanding!`
            };
            setMessages((prev) => [...prev, limitMessage]);
            setInput("");
            return;
        }

        // Limit to 10 message pairs (20 total messages) per conversation
        if (messages.length >= 20) {
            const limitMessage = {
                role: "assistant",
                content: "We've reached the conversation limit. To continue chatting, please refresh the page to start a new session. Thank you for your interest in my work!"
            };
            setMessages((prev) => [...prev, limitMessage]);
            setInput("");
            return;
        }

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setChatLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: "chat", messages: [...messages, userMessage] }),
            });

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();
            setMessages((prev) => [...prev, data]);

            // Increment rate limit counter after successful request
            incrementRateLimit();
        } catch (error) {
            console.error("Error in chat:", error);
            const errorMessage = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again after some time."
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setChatLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleClear = () => {
        setMessages([]);
        setInput("");
    };

    const getProjectById = (id: number) => TANMAY.projects.find((p) => p.id === id);
    const getExperienceById = (id: number) => TANMAY.experience.find((e) => e.id === id);
    const getSkillById = (id: number) => TANMAY.skills.find((s) => s.id === id);

    const renderUIAction = (uiActions: any[]) => {
        if (!uiActions || uiActions.length === 0) return null;

        return (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                {uiActions.map((uiAction, index) => (
                    <div key={index}>
                        {uiAction.type === "show_project" && (() => {
                            const project = getProjectById(uiAction.id);
                            if (!project) return null;
                            return (
                                <div className="bg-black/40 p-4 border border-white/10 hover:border-white/30 transition-colors">
                                    <h4 className="font-bold mb-1 text-white">{project.title}</h4>
                                    <p className="text-xs text-gray-400 mb-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.stacks.slice(0, 4).map((stack, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-white/10 text-white/70">
                                                {stack}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs underline hover:text-white transition-colors"
                                    >
                                        VIEW GITHUB →
                                    </a>
                                </div>
                            );
                        })()}

                        {uiAction.type === "show_experience" && (() => {
                            const experience = getExperienceById(uiAction.id);
                            if (!experience) return null;
                            return (
                                <div className="bg-black/40 p-4 border border-white/10 hover:border-white/30 transition-colors">
                                    <div className="flex items-start gap-3 mb-2">
                                        <img src={experience.logo} alt={experience.company} className="w-8 h-8 object-contain bg-white rounded" />
                                        <div>
                                            <h4 className="font-bold text-white">{experience.role}</h4>
                                            <p className="text-xs text-gray-400">{experience.company}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-300 mb-2">{experience.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {experience.technologies.slice(0, 5).map((tech, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-white/10 text-white/70">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {uiAction.type === "show_skill" && (() => {
                            const skill = getSkillById(uiAction.id);
                            if (!skill) return null;
                            return (
                                <div className="bg-black/40 p-3 border border-white/10 hover:border-white/30 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                                    </div>
                                    <div className="mt-2 text-xs text-white/50">
                                        {skill.description}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col py-3 max-md:pt-1 gap-3">
            <div className="result flex-1 w-[clamp(200px,900px,94vw)] self-center overflow-y-auto px-4 no-scrollbar" data-lenis-prevent>
                {messages.length === 0 && !chatLoading && (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-xl text-white/60 font-medium">Hello.</p>
                            <p className="text-xs text-white/40 mt-2">I am Digital Avatar of Tanmay, you can ask me anything <br />about me or my projects?</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4 py-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-2 text-sm ${msg.role === "user"
                                    ? "bg-white text-black border border-black/10"
                                    : "bg-white/10 border border-white/20 text-white"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                {renderUIAction(msg.uiActions || [])}
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 border border-white/20 text-white p-4 text-sm">
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-[clamp(200px,640px,94vw)] pointer-events-auto self-center"
            >
                <div
                    className="bg-white border p-2 relative cursor-text"
                    onClick={(e) => inputRef.current?.focus()}
                >
                    {/* Input Area */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border-none outline-none transition-colors font-Poppins max-md:text-xs text-sm leading-3 font-normal"
                            autoFocus
                            ref={inputRef}
                            disabled={chatLoading}
                            onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
                        />
                        <button
                            className="bg-black text-white py-1 px-2 border-none outline-none transition-colors font-Poppins cursor-pointer disabled:opacity-50"
                            onClick={handleChatSubmit}
                            disabled={chatLoading || !input.trim() || messages.length >= 20}
                        >
                            {chatLoading ? "Sending..." : messages.length >= 20 ? "Limit Reached" : "Send ✦"}
                        </button>
                        {messages.length > 0 && (
                            <button
                                className="bg-black text-white border-none px-1 outline-none transition-colors font-Poppins flex items-center justify-center cursor-pointer"
                                onClick={handleClear}
                            >
                                <IoIosClose className="text-xl" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-[10px] text-white/40 text-center mt-2">This Is LLM Inferance, You Can Chat With My Digital Avatar</p>
            </motion.div>
        </div>
    );
}
