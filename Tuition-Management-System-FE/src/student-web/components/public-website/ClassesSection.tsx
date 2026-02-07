import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Users, Clock, Star, ArrowRight } from 'lucide-react'

interface ClassItem {
  id: string
  title: string
  subject: string
  grade: string
  description: string
  enrolledStudents: number
  capacity: number
  duration: string
  price: number
  rating: number
}

interface ClassesSectionProps {
  classes?: ClassItem[]
}

const defaultClasses: ClassItem[] = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    subject: 'Mathematics',
    grade: '11th-12th',
    description: 'Master calculus, algebra, and more with interactive problem solving.',
    enrolledStudents: 25,
    capacity: 30,
    duration: '3 months',
    price: 5000,
    rating: 4.9,
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    subject: 'Physics',
    grade: '11th-12th',
    description: 'Build strong foundations in mechanics, thermodynamics, and waves.',
    enrolledStudents: 20,
    capacity: 25,
    duration: '3 months',
    price: 4500,
    rating: 4.8,
  },
  {
    id: '3',
    title: 'Chemistry Complete',
    subject: 'Chemistry',
    grade: '11th-12th',
    description: 'Comprehensive coverage of organic, inorganic, and physical chemistry.',
    enrolledStudents: 22,
    capacity: 25,
    duration: '3 months',
    price: 4500,
    rating: 4.7,
  },
]

export default function ClassesSection({ classes = defaultClasses }: ClassesSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Classes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of expertly designed courses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{cls.subject}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{cls.rating}</span>
                    </div>
                  </div>
                  <CardTitle>{cls.title}</CardTitle>
                  <CardDescription>Grade: {cls.grade}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{cls.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{cls.enrolledStudents}/{cls.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{cls.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xl font-bold">₹{cls.price}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                    <Button asChild>
                      <Link to={`/student/classes/${cls.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/student/classes">
                View All Classes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
