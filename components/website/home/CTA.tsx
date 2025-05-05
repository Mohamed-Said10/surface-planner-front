'use client';
import { Button } from '@/components/ui/button';
import { IS_AUTHENTICATION_ACTIVE } from '@/constants/is-authentication-active.constant';

export default function CTA() {
  const authRedirect = (page: string, e: any) => {
    window.location.assign(`${page}`);
  }

  return (
    <section className="py-12 relative">
      <div
        className="bg-[#0F553E] w-[70%] py-4 rounded-lg max-w-7xl mx-auto px-3 
      sm:px-6 lg:px-8 absolute top-1/3 sm:top-1/2 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-4 md:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold">Ready to Elevate Your Listings?</h2>
            <p className="mt-2">Maximize Your Property's Appeal</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={(event: any) => { authRedirect('/booking', event) }} variant="outline" className="bg-white text-[#0F553E] hover:bg-gray-100">
              Get a Quote
            </Button>
            {IS_AUTHENTICATION_ACTIVE && <Button onClick={(event: any) => { authRedirect('/auth/signup', event) }} className="bg-[#3A7461] hover:bg-[#3A7461]/90">
              Sign Up
            </Button>}
          </div>
        </div>
      </div>
    </section>
  );
}