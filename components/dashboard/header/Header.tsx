import { Button } from "@/components/ui/button";
import { Camera, HelpCircle, Home, LogOut, Settings, Video } from "lucide-react";

export default function Header() {
    return (
        <div className="border-b bg-white sticky top-0 z-10">
            <div className="flex justify-between items-center px-8 py-4">
                <div>
                    <h1 className="text-xl font-semibold">Welcome Back [User Name]</h1>
                    <p className="text-xs text-gray-500">Here's the overview of your latest bookings.</p>
                </div>
                <Button className="font-normal text-xs bg-[#0F553E] hover:bg-[#0F553E]/90">
                    + Book a New Session
                </Button>
            </div>
        </div>
    );
}