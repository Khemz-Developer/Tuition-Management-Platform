import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Search, BookOpen, Users, Star, Calendar } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const mockClasses = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    description: 'Comprehensive calculus and algebra course for competitive exam preparation.',
    teacher: 'John Smith',
    subject: 'Mathematics',
    grade: '11th',
    enrolledStudents: 25,
    capacity: 30,
    rating: 4.8,
    reviews: 45,
    price: 5000,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    description: 'Master physics concepts with hands-on problem solving and experiments.',
    teacher: 'John Smith',
    subject: 'Physics',
    grade: '12th',
    enrolledStudents: 20,
    capacity: 25,
    rating: 4.9,
    reviews: 38,
    price: 4500,
    schedule: 'Tue, Thu - 2:00 PM',
  },
  {
    id: '3',
    title: 'English Literature',
    description: 'Deep dive into classic and modern literature with critical analysis.',
    teacher: 'Sarah Johnson',
    subject: 'English',
    grade: '10th',
    enrolledStudents: 18,
    capacity: 25,
    rating: 4.7,
    reviews: 32,
    price: 3500,
    schedule: 'Mon, Wed - 4:00 PM',
  },
  {
    id: '4',
    title: 'Chemistry Basics',
    description: 'Foundation course covering organic, inorganic, and physical chemistry.',
    teacher: 'Mike Wilson',
    subject: 'Chemistry',
    grade: '11th',
    enrolledStudents: 15,
    capacity: 20,
    rating: 4.6,
    reviews: 28,
    price: 4000,
    schedule: 'Tue, Thu, Sat - 11:00 AM',
  },
]

export default function StudentClasses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')

  const filteredClasses = mockClasses.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || cls.subject === subjectFilter
    const matchesGrade = gradeFilter === 'all' || cls.grade === gradeFilter
    return matchesSearch && matchesSubject && matchesGrade
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Classes</h1>
        <p className="text-muted-foreground">Find and enroll in classes that match your learning goals</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes, teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9th">9th Grade</SelectItem>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="11th">11th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes grid */}
      {filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No classes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{cls.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(cls.teacher)}
                        </AvatarFallback>
                      </Avatar>
                      {cls.teacher}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{cls.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cls.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{cls.rating}</span>
                    <span className="text-muted-foreground">({cls.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{cls.enrolledStudents}/{cls.capacity}</span>
                  </div>
                  <Badge variant="outline">{cls.grade}</Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{cls.schedule}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold">₹{cls.price}</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link to={`/student/classes/${cls.id}`}>View Details</Link>
                    </Button>
                    <Button>Enroll Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
