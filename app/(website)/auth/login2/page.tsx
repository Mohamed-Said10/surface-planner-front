"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="mt-2 text-gray-600">Please enter your details to continue.</p>
          </div>

          <form className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember for 30 days
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-[#0F553E] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button className="w-full bg-[#0F553E] hover:bg-[#0F553E]/90">
              Sign In
            </Button>

            <Button
              variant="outline"
              className="w-full"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              Sign In with Google
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-[#0F553E] hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}