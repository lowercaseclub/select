'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components/accordion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Supabase Select?',
    answer:
      "Supabase Select is our first user conference, built for everyone building with Supabase—from weekend hackers to production-scale teams. If you're shipping software, this event is for you.",
  },
  {
    question: "What's the difference between the in-person and virtual experience?",
    answer:
      'The in-person experience offers networking opportunities, hands-on workshops, and direct interaction with speakers and the Supabase team. Virtual attendees will have access to live streams of all sessions and Q&A opportunities.',
  },
  {
    question: 'When will the full agenda be announced?',
    answer:
      "The full agenda will be announced closer to the event date. We're currently finalizing our speaker lineup and session topics to ensure we deliver the most valuable content for our community.",
  },
  {
    question: 'Can I participate as a sponsor of the event?',
    answer:
      'Yes! We have various sponsorship opportunities available. Please reach out to our events team (help-events@supabase.com) for more information about sponsorship packages and benefits.',
  },
  {
    question: "What's the refund and cancellation policy?",
    answer:
      'We understand plans can change. Full refunds are available up to 30 days before the event. After that, the tickets are non-refundable. Please reach out to help-events@supabase.com for assistance.',
  },
  {
    question: 'Can I request an accommodation to attend the event?',
    answer:
      "Absolutely. We're committed to making Supabase Select accessible to everyone. You have an opportunity to select accessibility accommodations during the checkout process and a member of our team will be in touch with you.",
  },
  {
    question: 'Do you have any travel and hotel recommendations?',
    answer:
      'Yes! The venue is easily accessible by public transit and rideshare. We recommend staying in downtown San Francisco or the Dogpatch area for easy access to Y Combinator.',
  },
  {
    question: 'Do you offer free or discounted passes?',
    answer:
      'We are working with several local communities to offer discounted passes. We do not offer discounts directly. Contact a local developer community organization and ask them to contact us. Typically, we work with community organizations to distribute a minimum number of tickets.',
  },
]

export function FAQSection() {
  return (
    <section className="relative z-10 bg-background flex flex-col lg:flex-row border-t">
      {/* Left content block with FAQ header */}
      <div className="w-full lg:w-[50%] px-8 py-16 lg:py-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-3 sm:mb-4">
          FAQ
        </h2>
      </div>

      {/* Divider - horizontal on mobile, vertical on desktop */}
      <div className="h-px lg:h-auto lg:w-px bg-column-lines"></div>

      {/* Right content block with FAQ items */}
      <div className="w-full lg:w-[50%] px-8 py-16 lg:py-24">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-column-lines"
            >
              <AccordionTrigger className="text-lg sm:text-xl lg:text-2xl font-medium py-4 sm:py-8 hover:no-underline hover:opacity-80">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 sm:pb-8">
                <div className="pt-0">
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
