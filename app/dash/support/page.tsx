"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const messages = [
    {
        id: 1,
        helper: "Helper Name",
        message: "This will be last Message",
        time: "01:08 pm",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: 2,
        helper: "Helper Name",
        message: "This will be last Message",
        time: "10:41 pm",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: 3,
        helper: "Helper Name",
        message: "This will be last Message",
        time: "02:02 am",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
];

const chat = [
    { id: 1, message: "Hi, I need help with booking a session.", time: "11:17AM", isUser: true },
    { id: 2, message: "Hi! I'd be happy to assist. Are you looking to book photography, a video tour, or a full package?", time: "11:17AM", isUser: false },
    { id: 3, message: "I need a full package with 3D floor plans and a video tour.", time: "11:17AM", isUser: true },
    { id: 4, message: "Great! Our Diamond Package includes 30 photos, 20 AI room stagings, 2D & 3D floor plans, a full video tour (2-4 mins), and a 360° virtual tour. Would you like to proceed with booking?", time: "11:17AM", isUser: false },
    { id: 5, message: "Yes, how soon can I schedule it?", time: "11:17AM", isUser: true },
    { id: 6, message: "We have availability as early as tomorrow morning. What date and time work best for you?", time: "11:17AM", isUser: false },
    { id: 7, message: "Tomato at 10 AM works.", time: "11:17AM", isUser: true },
    { id: 8, message: "Tomorrow*", time: "11:17AM", isUser: true },
    { id: 9, message: "Perfect! I've scheduled your session for tomorrow at 10 AM. You'll receive a confirmation email shortly. Anything else I can help with?", time: "11:17AM", isUser: false },
    { id: 10, message: "Nope, that's all. Thanks!", time: "11:17AM", isUser: true },
    { id: 11, message: "You're welcome! 😊 Have a great day!", time: "11:17AM", isUser: false }
];

export default function HelpPage() {
    const [message, setMessage] = useState("");

    return (
        <div className="flex h-[85%] m-4 border-2 border-solid rounded-xl">
            {/* Left Panel - Help History */}
            <div className="w-80 border-r bg-white rounded-tl-xl rounded-bl-xl">
                <div className="p-4 border-b">
                    <h2 className="text-md font-semibold">Help History</h2>
                </div>
                <div className="overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={msg.avatar}
                                    alt={msg.helper}
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                        {msg.helper}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                                </div>
                                <span className="text-xs text-gray-500">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Chat */}
            <div className="flex-1 flex flex-col bg-gray-50 rounded-tr-xl rounded-br-xl">
                <div className="p-4 border-b bg-white rounded-tr-xl">
                    <h1 className="text-md font-semibold">Helper Name</h1>
                    <div className="mt-1 text-xs text-gray-500">Session #</div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chat.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.isUser
                                        ? "bg-gray-100 text-gray-900"
                                        : "bg-white text-gray-900"
                                    }`}
                            >
                                <p className="text-xs">{msg.message}</p>
                                <span className="text-xs text-gray-500 mt-1 block text-right">
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white rounded-br-xl">
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Type Message Here"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Button className="bg-[#2F4F4F] hover:bg-[#2F4F4F]/90">
                            Send
                            <Send className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}