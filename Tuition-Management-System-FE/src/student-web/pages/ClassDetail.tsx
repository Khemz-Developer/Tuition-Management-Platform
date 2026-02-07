import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Separator } from '@/shared/components/ui/separator'
import {
  ArrowLeft,
  Star,
  Users,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  FileText,
  Video,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const classData = {
  id: '1',
  title: 'Advanced Mathematics',
  description: 'Comprehensive calculus and algebra course for 11th grade students preparing for competitive exams. This course covers derivatives, integrals, limits, sequences, and series with a focus on problem-solving techniques.',
  teacher: {
    name: 'John Smith',
    bio: 'Experienced mathematics teacher with 10+ years of teaching experience.',
    rating: 4.9,
    reviews: 156,
    students: 500,
  },
  subject: 'Mathematics',
  grade: '11th',
  enrolledStudents: 25,
  capacity: 30,
  rating: 4.8,
  reviews: 45,
  price: 5000,
  schedule: 'Mon, Wed, Fri - 10:00 AM',
  duration: '6 months',
  startDate: '2024-01-15',
  totalSessions: 72,
  features: [
    'Live interactive sessions',
    'Recorded lectures available',
    'Weekly assignments',
    'Doubt clearing sessions',
    'Study materials included',
    'Progress tracking',
  ],
  curriculum: [
    { title: 'Unit 1: Limits and Continuity', lessons: 8, duration: '3 weeks' },
    { title: 'Unit 2: Derivatives', lessons: 12, duration: '4 weeks' },
    { title: 'Unit 3: Applications of Derivatives', lessons: 10, duration: '4 weeks' },
    { title: 'Unit 4: Integrals', lessons: 14, duration: '5 weeks' },
    { title: 'Unit 5: Applications of Integrals', lessons: 8, duration: '3 weeks' },
    { title: 'Unit 6: Differential Equations', lessons: 10, duration: '3 weeks' },
  ],
  reviewsList: [
    { name: 'Alice B.', rating: 5, comment: 'Excellent teaching style. Concepts explained very clearly.', date: '2024-01-20' },
    { name: 'Bob D.', rating: 5, comment: 'Best mathematics class I have attended. Highly recommended!', date: '2024-01-18' },
    { name: 'Carol E.', rating: 4, comment: 'Good course content. Would appreciate more practice problems.', date: '2024-01-15' },
  ],
}

export default function StudentClassDetail() {
  const { classId } = useParams()

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" className="w-fit" asChild>
        <Link to="/student/classes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Link>
      </Button>

      {/* Class header */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{classData.subject}</Badge>
                    <Badge variant="outline">{classData.grade}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{classData.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{classData.rating}</span>
                      <span className="text-muted-foreground">({classData.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{classData.enrolledStudents} enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{classData.description}</p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="curriculum">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {classData.totalSessions} sessions over {classData.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classData.curriculum.map((unit, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{unit.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {unit.lessons} lessons • {unit.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>
                    What students say about this class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classData.reviewsList.map((review, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar>
                            <AvatarFallback>{getInitials(review.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">₹{classData.price}</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{classData.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {classData.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{classData.totalSessions} total sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{classData.capacity - classData.enrolledStudents} spots left</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {classData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full" size="lg">
                Enroll Now
              </Button>
            </CardContent>
          </Card>

          {/* Teacher card */}
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">
                    {getInitials(classData.teacher.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{classData.teacher.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{classData.teacher.rating}</span>
                    <span className="text-muted-foreground">
                      ({classData.teacher.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {classData.teacher.students}+ students
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {classData.teacher.bio}
              </p>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to={`/student/teachers/${classData.id}`}>
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
