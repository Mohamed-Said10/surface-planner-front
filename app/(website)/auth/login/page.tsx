"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginAltPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      console.log("SignIn result:", result);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Fetch user session to get role information
      const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
        method: "GET",
        credentials: "include", // Make sure cookies are included in the request
      }); 
      const session = await sessionResponse.json();

      console.log("Session response:", session); // Add this log
      console.log(session?.user);
      

      if (!session?.user?.role) {
        throw new Error("No role assigned to user");
      }

      console.log("User role: ", session.user.role); 

      // Role-based redirection
      let redirectPath = "/dash"; // Default fallback
      
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
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-8">
            <img src="/icons/logo.svg" alt="Logo" />
          </div>

          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <p className="mt-2 text-gray-600 text-center">Please enter your details.</p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-center">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-[#0F553E] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0F553E] hover:bg-[#0F553E]/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              type="button"
              disabled={isLoading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
              Sign In with Google
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
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