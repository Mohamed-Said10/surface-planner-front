'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import PhotographersTable from '@/components/shared/PhotographersTable';
import RequestsTable from '@/components/shared/RequestsTable';

export default function YourNewPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);
  
const staticData = [
  {
    id: "120894",
    photographerName: "Sarah Leslie",
    location: "Dubai, UAE",
    jobsDone: 12,
    contactNo: "+1 (555) 987-6543",
    status: "Available",
    avgRating: 4.5,
  },
  {
    id: "120895",
    photographerName: "John Doe",
    location: "New York, USA",
    jobsDone: 25,
    contactNo: "+1 (555) 123-4567",
    status: "Inactive",
    avgRating: 3.8,
  },
  // add more rows...
];
const requestData = [
  {
    id: "REQ001",
    photographerName: "Alice Johnson",
    experience: "5 years",
    email: "alice.johnson@example.com",
    contactNo: "+1 (555) 111-2222",
  },
  {
    id: "REQ002",
    photographerName: "Mark Stevens",
    experience: "3 years",
    email: "mark.stevens@example.com",
    contactNo: "+1 (555) 333-4444",
  },
  {
    id: "REQ003",
    photographerName: "Emma Williams",
    experience: "7 years",
    email: "emma.williams@example.com",
    contactNo: "+1 (555) 555-6666",
  }
];
  // No fetch or data logic yet

  return (
    <div className="p-4 space-y-4">
      {/* TABS */}
      <div className="flex w-full border-b">
        <button
          onClick={() => setActiveTab('tab1')}
          className={`flex-1 px-4 py-2 font-medium text-sm text-center rounded-t ${
            activeTab === 'tab1' ? 'border-b-2 border-[#2C2F36] text-black' : 'text-gray-500 border-b border-[#DDDDDE]'
          }`}
        >
          Active Photographers
        </button>
        <button
          onClick={() => setActiveTab('tab2')}
          className={`flex-1 px-4 py-2 font-medium text-sm text-center rounded-t ${
            activeTab === 'tab2' ? 'border-b-2 border-[#2C2F36] text-black' : 'text-gray-500 border-b border-[#DDDDDE]'
          }`}
        >
          Requests
        </button>
      </div>

      
      <div>
        {activeTab === 'tab1' ? (
        <PhotographersTable title="" data={staticData} />
        ) : (
            <RequestsTable data={requestData} />
            )}
      </div>
    </div>
  );
}
