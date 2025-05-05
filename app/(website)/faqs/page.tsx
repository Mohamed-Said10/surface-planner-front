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
    answer: `● Photos & floor plans: within 24–48 business hours
    <br />
    ● Videos: within 48-72 hours
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
    <br />● Turn on all lights
    <br />● Open curtains
    <br />● Hide personal belongings
    <br />● Ensure rooms are tidy
    <br />Note: photographers are not allowed to move furniture.
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
    <br />We’ll review your portfolio, run a short tech test, and onboard you within 3 days.`
  }
];

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <p className="text-[#B08968] font-medium">FAQs</p>
          <h1 className="text-4xl font-bold mt-2">Got Questions? We've Got Answers!</h1>
          <p className="text-gray-600 mt-4">
            Find quick solutions to common inquiries about our services, pricing, and process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                <div dangerouslySetInnerHTML={{__html: faq.answer}} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}