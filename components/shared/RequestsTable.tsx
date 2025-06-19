"use client";

import React, { useState, useMemo } from "react";
import { Search } from "@/components/icons";

interface RequestData {
  id: string;
  photographerName: string;
  experience: string;
  email: string;
  contactNo: string;
  portfolioUrl?: string;
}

interface Props {
  data: RequestData[];
  title?: string;
}

const RequestsTable = ({ data, title = "" }: Props) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase();
    return data.filter((item) =>
      item.photographerName.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.contactNo.toLowerCase().includes(searchLower)
    );
  }, [data, search]);

  return (
    <div>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}

      <div className="flex items-center justify-between gap-4 mb-0 bg-[#F5F6F6] px-4 pt-3 pb-2 border border-b-0 border-[#E0E0E0] rounded-t-lg">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, contact..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4835]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
        </div>
        <select
          value="all"
          className="text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">View: All</option>
        </select>
      </div>

      <div className="bg-white rounded-b-lg">
        <div className="overflow-hidden border border-t-1 border-[#DBDCDF] rounded-b-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Photographer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Experience</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Contact No.</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#DBDCDF]">Portfolio</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-[#E0E0E0] hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{request.id}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{request.photographerName}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{request.experience}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{request.email}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">{request.contactNo}</td>
                  <td className="py-4 px-4 text-sm border-r border-[#DBDCDF]">
                    {/* Portfolio link */}
                    {request.id ? (
                      <a
                        href={request.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0D4835] underline hover:text-[#0D4835]/80"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm flex gap-4">
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => alert(`Rejected photographer ID: ${request.id}`)}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="text-green-600 hover:underline"
                      onClick={() => alert(`Approved photographer ID: ${request.id}`)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                    No requests match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;
