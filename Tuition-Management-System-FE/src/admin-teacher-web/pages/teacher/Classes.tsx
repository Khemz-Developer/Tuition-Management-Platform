import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  Calendar,
  Edit,
  Archive,
  Eye,
  BookOpen,
} from 'lucide-react'

// Placeholder data
const mockClasses = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    subject: 'Mathematics',
    grade: '11th',
    status: 'ACTIVE',
    enrolledStudents: 25,
    capacity: 30,
    totalSessions: 24,
    completedSessions: 15,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    nextSession: 'Tomorrow, 10:00 AM',
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    subject: 'Physics',
    grade: '12th',
    status: 'ACTIVE',
    enrolledStudents: 20,
    capacity: 25,
    totalSessions: 20,
    completedSessions: 12,
    schedule: 'Tue, Thu - 2:00 PM',
    nextSession: 'Today, 2:00 PM',
  },
  {
    id: '3',
    title: 'Chemistry Basics',
    subject: 'Chemistry',
    grade: '10th',
    status: 'DRAFT',
    enrolledStudents: 0,
    capacity: 20,
    totalSessions: 0,
    completedSessions: 0,
    schedule: 'TBD',
    nextSession: null,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant="success">Active</Badge>
    case 'DRAFT':
      return <Badge variant="secondary">Draft</Badge>
    case 'COMPLETED':
      return <Badge variant="info">Completed</Badge>
    case 'ARCHIVED':
      return <Badge variant="outline">Archived</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function TeacherClasses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredClasses = mockClasses.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && cls.status === activeTab.toUpperCase()
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and course materials</p>
        </div>
        <Button asChild>
          <Link to="/teacher/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({mockClasses.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({mockClasses.filter((c) => c.status === 'ACTIVE').length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({mockClasses.filter((c) => c.status === 'DRAFT').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({mockClasses.filter((c) => c.status === 'COMPLETED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No classes found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all'
                    ? "You haven't created any classes yet."
                    : `No ${activeTab} classes found.`}
                </p>
                <Button asChild>
                  <Link to="/teacher/classes/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Class
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((cls) => (
                <Card key={cls.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{cls.title}</CardTitle>
                        <CardDescription>
                          {cls.subject} • {cls.grade}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/teacher/classes/${cls.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/teacher/classes/${cls.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Class
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      {getStatusBadge(cls.status)}
                      <span className="text-sm text-muted-foreground">
                        {cls.enrolledStudents}/{cls.capacity} students
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {cls.completedSessions}/{cls.totalSessions} sessions completed
                        </span>
                      </div>
                    </div>

                    {cls.nextSession && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Next Session</p>
                        <p className="text-sm font-medium">{cls.nextSession}</p>
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/teacher/classes/${cls.id}`}>View Class</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
