import { LogoutButton } from "@/components/ui/LogoutButton";
import { Camera, HelpCircle, Home, LogOut, Settings, Video } from "lucide-react";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r">
            <div className="p-4 border-b">
                <div className="flex items-center">

                    <img src="/icons/logo.svg" alt="" />
                    <span className="ml-2 text-xl font-semibold">Surface Planner</span>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                <a href="/dash" className="flex items-center text-sm px-4 py-2 bg-gray-100 text-[##0F553E] rounded-lg">
                    <Home className="h-5 w-5 mr-3" />
                    Dashboard
                </a>
                <a href="/dash/bookings" className="flex items-center text-sm px-4 py-2 text-[#646973] hover:bg-gray-100 rounded-lg">
                    <Camera className="h-5 w-5 mr-3" />
                    My Bookings
                </a>
                <a href="/dash/completed" className="flex items-center text-sm px-4 py-2 text-[#646973] hover:bg-gray-100 rounded-lg">
                    <Video className="h-5 w-5 mr-3" />
                    Completed Projects
                </a>
            </nav>

            <div className="absolute bottom-0 w-64 border-t">
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium">Profile</p>
                            <p className="text-xs text-gray-500">profile@email.com</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <a href="/dash/settings" className="w-full text-sm flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                        </a>
                        <a href="/dash/support" className="w-full text-sm flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-100 rounded-lg">
                            <HelpCircle className="h-4 w-4 mr-3" />
                            Help & Support
                        </a>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}