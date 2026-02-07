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
  BookOpen,
  GraduationCap,
  Calendar,
  MessageSquare,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const teacherData = {
  id: '1',
  name: 'John Smith',
  tagline: 'Making Mathematics Simple & Fun',
  bio: 'I am an experienced mathematics teacher with over 10 years of teaching experience. I specialize in making complex mathematical concepts simple and accessible to all students. My teaching methodology focuses on building strong fundamentals and problem-solving skills.',
  subjects: ['Mathematics', 'Physics'],
  qualifications: ['M.Sc Mathematics', 'B.Ed', 'CTET Certified'],
  experience: '10+ years',
  location: 'Mumbai, India',
  rating: 4.9,
  reviews: 156,
  students: 500,
  classes: 12,
  stats: {
    totalStudents: 500,
    activeClasses: 12,
    hoursTeaching: 2500,
    avgRating: 4.9,
  },
}

const teacherClasses = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    subject: 'Mathematics',
    grade: '11th',
    enrolledStudents: 25,
    capacity: 30,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    price: 5000,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    subject: 'Physics',
    grade: '12th',
    enrolledStudents: 20,
    capacity: 25,
    schedule: 'Tue, Thu - 2:00 PM',
    price: 4500,
    rating: 4.9,
  },
]

const teacherReviews = [
  {
    id: '1',
    studentName: 'Alice B.',
    rating: 5,
    comment: 'Excellent teacher! Makes complex concepts very easy to understand.',
    date: '2024-01-20',
    className: 'Advanced Mathematics',
  },
  {
    id: '2',
    studentName: 'Bob D.',
    rating: 5,
    comment: 'Best mathematics teacher I have ever had. Highly recommended!',
    date: '2024-01-18',
    className: 'Physics Fundamentals',
  },
  {
    id: '3',
    studentName: 'Carol E.',
    rating: 4,
    comment: 'Very knowledgeable and patient. Great teaching style.',
    date: '2024-01-15',
    className: 'Advanced Mathematics',
  },
]

export default function StudentPublicTeacherProfile() {
  const { teacherId } = useParams()

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" className="w-fit" asChild>
        <Link to="/student/teachers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teachers
        </Link>
      </Button>

      {/* Teacher profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32 mx-auto md:mx-0">
              <AvatarFallback className="text-4xl">
                {getInitials(teacherData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{teacherData.name}</h1>
              <p className="text-lg text-muted-foreground">{teacherData.tagline}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                {teacherData.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{teacherData.rating}</span>
                  <span className="text-muted-foreground">({teacherData.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{teacherData.students} students</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{teacherData.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Teacher
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold">{teacherData.stats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{teacherData.stats.activeClasses}</p>
              <p className="text-sm text-muted-foreground">Active Classes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{teacherData.stats.hoursTeaching}+</p>
              <p className="text-sm text-muted-foreground">Hours Teaching</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{teacherData.stats.avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about" className="space-y-6">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{teacherData.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {teacherData.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{teacherData.experience}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes">
          <div className="grid gap-6 md:grid-cols-2">
            {teacherClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary">{cls.subject}</Badge>
                      <CardTitle className="mt-2">{cls.title}</CardTitle>
                      <CardDescription>Grade: {cls.grade}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{cls.price}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{cls.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{cls.enrolledStudents}/{cls.capacity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/student/classes/${cls.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button className="flex-1">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <CardDescription>What students say about this teacher</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(review.studentName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.studentName}</p>
                          <p className="text-xs text-muted-foreground">{review.className}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
