import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui/card'
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
import { Search, Users, BookOpen, MessageSquare, Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { get } from '@/shared/services/api'
import { useToast } from '@/shared/components/ui/use-toast'
import type { TeacherProfile } from '@/shared/types/user.types'

export default function StudentTeachers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [teachers, setTeachers] = useState<TeacherProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allSubjects, setAllSubjects] = useState<string[]>([])
  const { toast } = useToast()

  // Load teachers from API
  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      setIsLoading(true)
      const response = await get<{ teachers: TeacherProfile[] }>('/public/teachers')
      setTeachers(response.teachers)
      
      // Extract all unique subjects for filter
      const subjects = new Set<string>()
      response.teachers.forEach(teacher => {
        teacher.subjects?.forEach(subject => {
          subjects.add(subject)
        })
      })
      setAllSubjects(Array.from(subjects).sort())
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load teachers',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const teacherName = `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()
    const matchesSearch =
      teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.tagline?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject =
      subjectFilter === 'all' ||
      teacher.subjects?.some((s) => s.toLowerCase() === subjectFilter.toLowerCase())
    return matchesSearch && matchesSubject
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
                {allSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>
                    {subject}
                  </SelectItem>
                ))}
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
            <Card key={teacher._id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl">
                      {getInitials(`${teacher.firstName || ''} ${teacher.lastName || ''}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()}
                        </h3>
                        {teacher.tagline && (
                          <p className="text-sm text-muted-foreground mt-1">{teacher.tagline}</p>
                        )}
                        <div className="flex items-center gap-1 text-sm mt-2">
                          <span className="text-muted-foreground">
                            {teacher.experience ? `${teacher.experience} years experience` : 'Experienced'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {teacher.pricing?.monthlyFee && (
                          <>
                            <p className="font-medium text-primary">{teacher.pricing.monthlyFee}</p>
                            <p className="text-xs text-muted-foreground">per month</p>
                          </>
                        )}
                        {teacher.pricing?.hourlyRate && (
                          <>
                            <p className="font-medium text-primary">{teacher.pricing.hourlyRate}</p>
                            <p className="text-xs text-muted-foreground">per hour</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {teacher.subjects?.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    {teacher.bio && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {teacher.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {teacher.stats?.totalStudents || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {teacher.stats?.totalClasses || 0} classes
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to={`/student/teachers/${teacher.slug}`}>
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
