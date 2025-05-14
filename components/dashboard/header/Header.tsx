"use client";

import { Button } from "@/components/ui/button";
import { Camera, HelpCircle, Home, LogOut, Settings, Video } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {

    const pathname = usePathname();
    const [pageTitle, setPageTitle] = useState('Dashboard');
    const [pageSubtitle, setPageSubtitle] = useState("Here's the overview of your latest bookings.");

    useEffect(() => {
        // Update title whenever pathname changes
        switch(pathname) {
            case '/dash':
                setPageTitle('Dashboard');
                setPageSubtitle("Here's the overview of your latest bookings.");
                break;
            case '/dash/bookings':
                setPageTitle('My Bookings');
                setPageSubtitle('View and manage your upcoming bookings.');
                break;
            case '/dash/completed':
                setPageTitle('Completed Projects');
                setPageSubtitle('Browse your completed projects and media.');
                break;
            case '/dash/settings':
                setPageTitle('Settings');
                setPageSubtitle('Manage your account settings and preferences.');
                break;
            default:
                setPageTitle('Dashboard');
                setPageSubtitle('');
        }
    }, [pathname]);


    return (
        <div className="border-b bg-white sticky top-0 z-10">
            <div className="flex justify-between items-center px-8 py-4">
                <div>
                    <h1 className="text-xl font-semibold">{pageTitle}</h1>
                    <p className="text-xs text-gray-500">{pageSubtitle}</p>
                </div>
                <a href="/booking">
                <Button className="font-normal text-xs bg-[#0F553E] hover:bg-[#0F553E]/90">
                    + Book a New Session
                </Button>
                </a>
            </div>
        </div>
    );
}