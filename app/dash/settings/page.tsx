"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Box, Camera, Video, Home, Settings, HelpCircle, LogOut, CreditCard, PencilLine, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    day: "",
    month: "",
    year: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const renderAccountInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            {selectedImage ? (
              <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <button
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={triggerImageUpload}
            >
              <Upload className="h-4 w-4" />
              Change
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <PencilLine className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Emailaddress@email.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
        <div className="grid grid-cols-3 gap-4">
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>Month</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select className="rounded-lg border border-gray-300 px-4 py-2">
            <option>Year</option>
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={2024 - i}>{2024 - i}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <div className="space-y-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              className="rounded-lg border border-gray-300 px-4 py-2"
              value={formData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              className="rounded-lg border border-gray-300 px-4 py-2"
              value={formData.state}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              className="rounded-lg border border-gray-300 px-4 py-2"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-[#0F553E] hover:bg-[#0F553E]/90">Save</Button>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          value={formData.currentPassword}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
        <p className="text-sm text-gray-500 mt-1">
          Must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#0F553E] hover:bg-[#0F553E]/90">Update Password</Button>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/24</p>
                </div>
              </div>
              <Button variant="outline">Remove</Button>
            </div>
          </div>
          <Button className="mt-4">+ Add Payment Method</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Description</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { date: "Feb 13, 2024", description: "Diamond Package", amount: "AED 2,500.00" },
                { date: "Jan 28, 2024", description: "Gold Package", amount: "AED 1,800.00" },
                { date: "Jan 15, 2024", description: "Silver Package", amount: "AED 1,200.00" },
              ].map((invoice, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm">{invoice.date}</td>
                  <td className="py-4 text-sm">{invoice.description}</td>
                  <td className="py-4 text-sm">{invoice.amount}</td>
                  <td className="py-4 text-right">
                    <Button variant="outline" size="sm">Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex gap-8 px-6">
            <button
              className={`py-4 text-sm font-medium border-b-2 -mb-px ${activeTab === "account"
                  ? "text-[#0F553E] border-[#0F553E]"
                  : "text-gray-500 border-transparent"
                }`}
              onClick={() => setActiveTab("account")}
            >
              Account Information
            </button>
            <button
              className={`py-4 text-sm font-medium border-b-2 -mb-px ${activeTab === "password"
                  ? "text-[#0F553E] border-[#0F553E]"
                  : "text-gray-500 border-transparent"
                }`}
              onClick={() => setActiveTab("password")}
            >
              Password
            </button>
            <button
              className={`py-4 text-sm font-medium border-b-2 -mb-px ${activeTab === "billing"
                  ? "text-[#0F553E] border-[#0F553E]"
                  : "text-gray-500 border-transparent"
                }`}
              onClick={() => setActiveTab("billing")}
            >
              Billing
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "account" && renderAccountInfo()}
          {activeTab === "password" && renderPassword()}
          {activeTab === "billing" && renderBilling()}
        </div>
      </div>
    </div>
  );
}