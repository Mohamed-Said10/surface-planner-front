"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "lucide-react";

export default function SignupAltPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-8">
            <img src="/icons/logo.svg" alt="" />
          </div>

          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          <p className="mt-2 text-gray-600 text-center">Enter your details to sign up</p>

          <form className="mt-8 space-y-6">
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
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#0F553E] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}