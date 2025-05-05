"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/helpers/send-email";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const req = await sendEmail({ name, email, message, phone }, 'email')
    // Add form submission logic here
    console.log(req);

    setTimeout(() => {
      setIsSubmitting(false); setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              We're Here to Help!
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Have questions or need assistance? Reach out to us—we'd love to hear from you!
            </p>

            <div className="mt-12 space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0F553E]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#0F553E]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Send us an Email</h3>
                    <p className="text-gray-600">info@surfaceplanner.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0F553E]/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#0F553E]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Call Us</h3>
                    <p className="text-gray-600">+971 58 828 0596</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-gray-600 italic">
              Business Hours: Monday – Friday | 9 AM – 6 PM (GMT+4)*
            </p>
          </div>

          <div className="bg-[#0F553E] rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-8">Contact Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@email.com"
                  className="w-full bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="+971 56 123 4567"
                  className="w-full bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type here...."
                  className="w-full bg-white h-32"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ffffff] hover:bg-[#0F553E]/90 text-black h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}