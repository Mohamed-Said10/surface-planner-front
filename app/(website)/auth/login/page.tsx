"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "lucide-react";

export default function LoginAltPage() {
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< Updated upstream
=======
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // In your handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      // Handle specific error messages from backend
      let errorMessage = result.error;
      
      // Map raw error messages to user-friendly ones if needed
      const errorMapping: Record<string, string> = {
        "CredentialsSignin": "Invalid email or password",
        "Email and password are required": "Please enter both email and password",
        "No account found with this email address": "No account found with this email",
        "Incorrect password": "The password you entered is incorrect",
        "Please verify your email before logging in": "Please check your email for a verification link",
      };
      
      errorMessage = errorMapping[result.error] || result.error;
      throw new Error(errorMessage);
    }

    if (!result?.ok) {
      throw new Error("Login failed. Please try again.");
    }

    // Fetch user session with error handling
    let session;
    try {
      const sessionResponse = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      }); 
      
      if (!sessionResponse.ok) {
        throw new Error("Failed to verify your session");
      }

      session = await sessionResponse.json();

      if (!session?.user?.role) {
        throw new Error("Your account is missing required information. Please contact support.");
      }
    } catch (sessionError) {
      console.error("Session fetch error:", sessionError);
      throw new Error("We couldn't complete your login. Please try again.");
    }

    // Role-based redirection
    let redirectPath = "/dash";
    
    if (callbackUrl) {
      redirectPath = callbackUrl;
    } else {
      switch (session.user.role) {
        case "ADMIN":
          redirectPath = "/admin/dashboard";
          break;
        case "PHOTOGRAPHER":
          redirectPath = "/photographer/dashboard";
          break;
        case "CLIENT":
          redirectPath = "/dash";
          break;
        default:
          redirectPath = "/dash";
      }
    }

    toast.success("Login successful!");
    router.push(redirectPath);
    router.refresh();
  } catch (error: any) {
    console.error("Login error:", error);
    const displayError = error.message || "An unexpected error occurred during login";
    setError(displayError);
    toast.error(displayError);
  } finally {
    setIsLoading(false);
  }
};
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-8">
            <img src="/icons/logo.svg" alt="" />
          </div>

          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <p className="mt-2 text-gray-600 text-center">Please enter your details.</p>

          <form className="mt-8 space-y-6">
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
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-[#0F553E] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}