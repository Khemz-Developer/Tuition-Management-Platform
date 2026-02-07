import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  Clock,
  FileText,
  Video,
  Download,
  MoreVertical,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data - this would come from API
const classData = {
  id: '1',
  title: 'Advanced Mathematics',
  description: 'Comprehensive calculus and algebra course for 11th grade students preparing for competitive exams.',
  subject: 'Mathematics',
  grade: '11th',
  status: 'ACTIVE',
  enrolledStudents: 25,
  capacity: 30,
  totalSessions: 24,
  completedSessions: 15,
  schedule: 'Mon, Wed, Fri - 10:00 AM',
  startDate: '2024-01-15',
  endDate: '2024-06-15',
  price: 5000,
}

const enrolledStudents = [
  { id: '1', name: 'Alice Brown', email: 'alice@example.com', joinedAt: '2024-01-15', attendance: 95 },
  { id: '2', name: 'Bob Davis', email: 'bob@example.com', joinedAt: '2024-01-15', attendance: 88 },
  { id: '3', name: 'Carol Evans', email: 'carol@example.com', joinedAt: '2024-01-16', attendance: 92 },
]

const upcomingSessions = [
  { id: '1', title: 'Calculus - Derivatives', date: '2024-02-07', time: '10:00 AM', duration: '1.5 hours' },
  { id: '2', title: 'Calculus - Integration', date: '2024-02-09', time: '10:00 AM', duration: '1.5 hours' },
]

const materials = [
  { id: '1', title: 'Calculus Notes Chapter 1', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-01-20' },
  { id: '2', title: 'Introduction Video', type: 'VIDEO', duration: '15:30', uploadedAt: '2024-01-18' },
  { id: '3', title: 'Practice Problems Set 1', type: 'PDF', size: '1.1 MB', uploadedAt: '2024-01-25' },
]

export default function TeacherClassDetail() {
  const { classId } = useParams()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit" asChild>
          <Link to="/teacher/classes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Link>
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{classData.title}</h1>
              <Badge variant={classData.status === 'ACTIVE' ? 'success' : 'secondary'}>
                {classData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {classData.subject} • {classData.grade}
            </p>
          </div>
          <Button asChild>
            <Link to={`/teacher/classes/${classId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Class
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.enrolledStudents}/{classData.capacity}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.completedSessions}/{classData.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{classData.schedule}</div>
            <p className="text-xs text-muted-foreground">Weekly schedule</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{classData.price}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students ({enrolledStudents.length})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="materials">Materials ({materials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About this Class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{classData.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-muted-foreground">{new Date(classData.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-muted-foreground">{new Date(classData.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Students currently enrolled in this class</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(student.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.attendance >= 90 ? 'success' : 'warning'}>
                          {student.attendance}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>Scheduled sessions for this class</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/teacher/sessions">Schedule Session</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()} at {session.time} • {session.duration}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Start Session</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Materials</CardTitle>
                  <CardDescription>Files and resources for this class</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/teacher/content">Upload Material</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {material.type === 'PDF' ? (
                        <FileText className="h-8 w-8 text-red-500" />
                      ) : (
                        <Video className="h-8 w-8 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {material.type === 'PDF' ? material.size : material.duration} •{' '}
                          {new Date(material.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
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
