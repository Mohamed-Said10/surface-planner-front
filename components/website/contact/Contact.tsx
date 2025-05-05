"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Information */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              We're Here to Help!
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Have questions or need assistance? Reach out to us—we'd love to hear from you!
            </p>

            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B08968]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#B08968]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Send us an Email</h3>
                    <p className="text-gray-600">support@surfaceplanner.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B08968]/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#B08968]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+971 58 828 0596</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#B08968]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#B08968]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Our Office</h3>
                    <p className="text-gray-600">Office 123, Business Tower, Downtown Dubai, UAE</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-gray-600 italic">
              Business Hours: Monday – Friday | 9 AM – 6 PM (GMT+4)*
            </p>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-[#2F4F4F] rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-8">Contact Form</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Villa"
                  className="w-full bg-white"
                  {...form.register("name")}
                  // error={form.formState.errors.name?.message}
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-300">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  className="w-full bg-white"
                  {...form.register("email")}
                  // error={form.formState.errors.email?.message}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-300">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  placeholder="+971 56 123 4567"
                  className="w-full bg-white"
                  {...form.register("phone")}
                  // error={form.formState.errors.phone?.message}
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-300">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Type here...."
                  className="w-full bg-white h-32"
                  {...form.register("message")}
                  // error={form.formState.errors.message?.message}
                />
                {form.formState.errors.message && (
                  <p className="mt-1 text-sm text-red-300">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#B08968] hover:bg-[#B08968]/90 text-white py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}