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
import { Search, Star, Users, BookOpen, MessageSquare } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const mockTeachers = [
  {
    id: '1',
    name: 'John Smith',
    bio: 'Experienced mathematics teacher with 10+ years of teaching experience. Expert in calculus and competitive exam preparation.',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.9,
    reviews: 156,
    students: 500,
    classes: 12,
    priceRange: '₹4,000 - ₹6,000',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    bio: 'Passionate English teacher specializing in literature and creative writing. Making learning fun and interactive.',
    subjects: ['English', 'Literature'],
    rating: 4.8,
    reviews: 98,
    students: 320,
    classes: 8,
    priceRange: '₹3,000 - ₹5,000',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    bio: 'Chemistry expert with PhD in organic chemistry. Simplified approach to complex concepts.',
    subjects: ['Chemistry'],
    rating: 4.7,
    reviews: 75,
    students: 250,
    classes: 6,
    priceRange: '₹4,500 - ₹5,500',
  },
  {
    id: '4',
    name: 'Emily Davis',
    bio: 'Biology teacher with a focus on NEET preparation. High success rate in competitive exams.',
    subjects: ['Biology'],
    rating: 4.9,
    reviews: 120,
    students: 400,
    classes: 10,
    priceRange: '₹5,000 - ₹7,000',
  },
]

export default function StudentTeachers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')

  const filteredTeachers = mockTeachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject =
      subjectFilter === 'all' ||
      teacher.subjects.some((s) => s.toLowerCase() === subjectFilter.toLowerCase())
    return matchesSearch && matchesSubject
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Teachers</h1>
        <p className="text-muted-foreground">Browse and connect with expert teachers</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teachers grid */}
      {filteredTeachers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No teachers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{teacher.rating}</span>
                          <span className="text-muted-foreground">
                            ({teacher.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{teacher.priceRange}</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {teacher.bio}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {teacher.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {teacher.classes} classes
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to={`/student/teachers/${teacher.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
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
