import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "1. How does it work?",
    answer: `Choose your package, select a time slot, and confirm.
    A certified photographer will capture the property, and you’ll receive fully edited content
    digitally within 24–48 hours.`
  },
  {
    question: "2. How fast do I receive my content?",
    answer: `● 📸 Photos & floor plans: within 24–48 business hours
    ● 🎥 Videos: within 48-72 hours
    Plan your listings with confidence — no delays, no guesswork.`
  },
  {
    question: "3. Can I reschedule if needed?",
    answer: `Yes — totally free if you let us know at least 24 hours in advance.
    Less than 24 hours? A penalty fee will be applied`
  },
  {
    question: "4. Do I need to prepare the property before the shoot?",
    answer: `Yes. Please:
    ● Turn on all lights
    ● Open curtains
    ● Hide personal belongings
    ● Ensure rooms are tidy
    Note: photographers are not allowed to move furniture.
    `
  },
  {
    question: "5. Do you offer discounts for multiple properties?",
    answer: `Absolutely. If you're listing regularly:
    Enjoy volume discounts starting from just 3 bookings.
    Contact us for more details.`
  },
  {
    question: "6. How do I apply to shoot for Surfaceplanner?",
    answer: `Photographers can apply via "Join as Photographer".
    We’ll review your portfolio, run a short tech test, and onboard you within 3 days.`
  }
];


export default function FAQ() {
  return (
    <section className="py-24">
      <div className="sm:w-[70%] w-[90%] max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#B08968] font-medium">FAQs</p>
          <h2 className="text-3xl font-bold mt-2">Got Questions? We've Got Answers!</h2>
          <p className="text-gray-600 mt-4">
            Find quick answers to common questions about our services, packages, and policies.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem className="bg-gray-50 my-2 px-3 rounded-lg w-[100%] max-w-7xl mx-auto" key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}