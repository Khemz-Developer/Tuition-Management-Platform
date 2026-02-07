import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'What are the batch sizes?',
    answer: 'We maintain small batch sizes of maximum 25-30 students to ensure personalized attention for each student. This helps in addressing individual doubts effectively.',
  },
  {
    question: 'Do you provide study materials?',
    answer: 'Yes, comprehensive study materials including notes, practice worksheets, previous year papers, and video recordings of lectures are provided to all enrolled students.',
  },
  {
    question: 'What is the fee structure?',
    answer: 'Fee varies by class and subject. Generally, monthly fees range from ₹3,000 to ₹7,000. Detailed fee structure is available on individual class pages. We also offer sibling discounts.',
  },
  {
    question: 'How can I enroll?',
    answer: 'You can enroll directly through our website by selecting your desired class and completing the registration form. Alternatively, you can contact us directly for assistance.',
  },
  {
    question: 'Are online classes available?',
    answer: 'Yes, we offer both online and offline batches. Online classes are conducted via Zoom/Google Meet with interactive sessions and screen sharing.',
  },
  {
    question: 'Do you offer doubt clearing sessions?',
    answer: 'Yes, dedicated doubt clearing sessions are held every Saturday. Students can also reach out via our messaging system for quick clarifications.',
  },
  {
    question: 'What is the refund policy?',
    answer: 'If a student wishes to discontinue within the first week, 80% of the fee is refunded. After the first week, fees are non-refundable but can be adjusted for future batches.',
  },
  {
    question: 'How can I track my progress?',
    answer: 'Students have access to a personal dashboard showing attendance, test scores, assignments, and overall progress. Parents also receive monthly progress reports.',
  },
]

export default function FAQSection({ faqs = defaultFAQs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background rounded-lg border overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className="px-4 pb-4 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
