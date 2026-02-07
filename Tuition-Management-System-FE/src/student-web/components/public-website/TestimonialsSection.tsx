import { Card, CardContent } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Star, Quote } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Class 12 Student',
    content: 'The teaching methodology is exceptional. I improved my math scores from 65% to 92% in just 3 months. Highly recommended!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    role: 'JEE Aspirant',
    content: 'Clear concept explanations and excellent problem-solving techniques. The doubt clearing sessions are very helpful.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ananya Singh',
    role: 'Class 11 Student',
    content: 'Best physics teacher I\'ve ever had! The way complex topics are simplified makes learning so much easier.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Arjun Patel',
    role: 'NEET Aspirant',
    content: 'The structured approach to Chemistry preparation helped me crack NEET with an excellent score. Forever grateful!',
    rating: 5,
  },
  {
    id: '5',
    name: 'Meera Gupta',
    role: 'Parent',
    content: 'As a parent, I appreciate the regular progress updates and the personal attention given to my child.',
    rating: 5,
  },
  {
    id: '6',
    name: 'Vikram Joshi',
    role: 'Class 10 Student',
    content: 'Made learning fun and interactive. The online materials and practice tests are extremely useful.',
    rating: 4,
  },
]

export default function TestimonialsSection({ testimonials = defaultTestimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our students and parents about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative">
                <CardContent className="pt-6">
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Avatar>
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
