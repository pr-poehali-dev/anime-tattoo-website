import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  faq: FAQItem[];
}

function FAQSection({ faq }: FAQSectionProps) {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 max-w-3xl">
        <h3 className="text-5xl font-black text-center mb-4 text-gradient">Вопросы и ответы</h3>
        <p className="text-center text-gray-400 mb-12 text-lg">Ответы на популярные вопросы</p>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faq.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="bg-black border-gray-800 rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-primary font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQSection;
