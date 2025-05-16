"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { CreditCard, PencilLine, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  image: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  day: string;
  month: string;
  year: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "",
    day: "",
    month: "",
    year: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchUserData = async () => {
    if (session?.user?.id) {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/users/${session.user.id}`,
          { credentials: "include" }
        );
  
        if (!response.ok) throw new Error("Failed to fetch user data");
  
        const data = await response.json();
        setUserData(data);
  
        const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
        const fullImageUrl = data.image ? `http://localhost:3000${data.image}` : null;
  
        // Get month name from date (0-indexed)
        const monthName = dob ? months[dob.getMonth()] : "";
  
        setFormData({
          firstName: data.firstname || "",
          lastName: data.lastname || "",
          email: data.email || "",
          day: dob ? dob.getDate().toString() : "",
          month: monthName,
          year: dob ? dob.getFullYear().toString() : "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipcode || "",
          phoneNumber: data.phoneNumber || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
  
        setSelectedImage(fullImageUrl);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [session]);

  const handleUpdateUser = async () => {
    if (!session?.user?.id) return;
  
    try {
      const formPayload = new FormData();
      formPayload.append('firstname', formData.firstName);
      formPayload.append('lastname', formData.lastName);
      //formPayload.append('email', formData.email);
      formPayload.append('address', formData.address);
      formPayload.append('city', formData.city || '');
      formPayload.append('state', formData.state || '');
      formPayload.append('zipcode', formData.zipCode || '');
      formPayload.append('phoneNumber', formData.phoneNumber || '');

      if (formData.day && formData.month && formData.year) {
        const monthNumber = months.indexOf(formData.month) + 1;
        const dateString = `${formData.year}-${String(monthNumber).padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
        formPayload.append('dateOfBirth', dateString);
      }

      if (fileInputRef.current?.files?.[0]) {
        formPayload.append('image', fileInputRef.current.files[0]);
      }

      const response = await fetch(`http://localhost:3000/api/users/${session.user.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formPayload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      alert('Profile updated successfully!');
      await fetchUserData();
    } catch (error) {
      console.error('Update error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      alert("Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${session?.user?.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      alert('Password updated successfully!');
    } catch (error) {
      console.error('Password update error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => fileInputRef.current?.click();

  const renderAccountInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Photo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Emailaddress@email.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          value={formData.email}
          readOnly  
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <div className="grid grid-cols-3 gap-4">
          <select
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-300 px-4 py-2"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          >
            <option value="">Year</option>
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={2024 - i}>
                {2024 - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
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
              name="zipcode"
              placeholder="Zip Code"
              className="rounded-lg border border-gray-300 px-4 py-2"
              value={formData.zipcode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button 
          className="bg-[#0F553E] hover:bg-[#0F553E]/90"
          onClick={handleUpdateUser}
        >
          Save
        </Button>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
        <p className="text-sm text-gray-500 mt-1">
          Must contain at least 8 characters, 1 uppercase, 1 lowercase, 1
          number, 1 special character.
        </p>
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
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
        <Button 
          className="bg-[#0F553E] hover:bg-[#0F553E]/90"
          onClick={handleUpdatePassword}
        >
          Update Password
        </Button>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment Methods
          </h3>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Billing History
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">
                  Description
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                {
                  date: "Feb 13, 2024",
                  description: "Diamond Package",
                  amount: "AED 2,500.00",
                },
                {
                  date: "Jan 28, 2024",
                  description: "Gold Package",
                  amount: "AED 1,800.00",
                },
                {
                  date: "Jan 15, 2024",
                  description: "Silver Package",
                  amount: "AED 1,200.00",
                },
              ].map((invoice, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm">{invoice.date}</td>
                  <td className="py-4 text-sm">{invoice.description}</td>
                  <td className="py-4 text-sm">{invoice.amount}</td>
                  <td className="py-4 text-right">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
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
              className={`py-4 text-sm font-medium border-b-2 -mb-px ${
                activeTab === "account" ? "text-[#0F553E] border-[#0F553E]" : "text-gray-500 border-transparent"
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
