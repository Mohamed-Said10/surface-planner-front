import Hero from '@/components/website/home/Hero';
import Photography from '@/components/website/home/Photography';
import Services from '@/components/website/home/Services';
import Portfolio from '@/components/website/home/Portfolio';
import Testimonials from '@/components/website/home/Testimonials';
import FAQ from '@/components/website/home/FAQ';
import Packages from '@/components/website/home/Packages';
import HowItWorks from '@/components/website/home/HowItWorks';
import CTA from '@/components/website/home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Photography />
      <Services />
      <HowItWorks />
      <Portfolio />
      <Testimonials />
      <Packages />
      <FAQ />
      <CTA />
    </>
  );
}