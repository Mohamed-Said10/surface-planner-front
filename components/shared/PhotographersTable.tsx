"use client";

import React, { useState, useMemo } from "react";
import { Search } from "@/components/icons";
import {StarFull} from '@/components/icons';
import { useRouter } from "next/navigation";

interface PhotographerData {
  id: string ;
  photographerName: string;
  location: string;
  jobsDone: number;
  contactNo: string;
  status: "Available" | "Inactive" | string;
  avgRating: number;
}

interface Props {
  data: PhotographerData[];
  title: string;
}

const statusColors: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export function PhotographersTable({ data, title }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase();
    return data.filter((item) => {
      const matchSearch =
        item.photographerName.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.contactNo.toLowerCase().includes(searchLower);
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="flex items-center justify-between gap-4 mb-0 bg-[#F5F6F6] px-4 pt-3 pb-2 border border-b-0 border-[#E0E0E0] rounded-t-lg">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, location, contact..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4835]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">View: All</option>
          {Object.keys(statusColors).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-b-lg">
        <div className="overflow-hidden border border-t-1 border-[#DBDCDF] rounded-b-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Photographer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Jobs Done</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6]">Avg. Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((photographer, index) => (
                <tr
                  key={photographer.id}
                  onClick={() => router.push(`/dash/admin/photographers-portfolio/${photographer.id}`)}
                  className="border-t border-[#E0E0E0] hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{photographer.id.slice(0,8)}...</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">
                    <span className="text-[#0D4835] underline hover:text-[#0D4835]/80 block">
                      {photographer.photographerName}
                    </span>
                    <span className="text-xs text-gray-500">{photographer.location}</span>
                  </td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{photographer.jobsDone}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{photographer.contactNo}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">
                    <StatusBadge status={photographer.status} />
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center gap-1">
                        <StarFull size={18} className="text-yellow-500" />
                        {photographer.avgRating.toFixed(1)}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                    No photographers match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PhotographersTable;
