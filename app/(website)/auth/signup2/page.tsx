"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left Section - Image */}
      <div className="relative bg-[#0F553E]">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
          alt="Modern interior"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Right Section - Signup Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold">Sign Up</h2>
            <p className="mt-2 text-gray-600">Enter your details to sign up</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
            </div>

            <Input type="email" placeholder="Email" />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <Button className="w-full bg-[#0F553E] hover:bg-[#0F553E]/90">
              Sign Up
            </Button>

            <Button
              variant="outline"
              className="w-full"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              Join with Google
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#0F553E] hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}