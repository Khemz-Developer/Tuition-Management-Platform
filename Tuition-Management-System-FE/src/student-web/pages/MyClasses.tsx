import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  BookOpen,
  Calendar,
  Clock,
  Play,
  FileText,
  Video,
  Download,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const enrolledClasses = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    teacher: 'John Smith',
    subject: 'Mathematics',
    progress: 65,
    completedSessions: 15,
    totalSessions: 24,
    nextSession: {
      title: 'Calculus - Derivatives',
      date: '2024-02-07',
      time: '10:00 AM',
    },
    schedule: 'Mon, Wed, Fri - 10:00 AM',
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    teacher: 'John Smith',
    subject: 'Physics',
    progress: 45,
    completedSessions: 9,
    totalSessions: 20,
    nextSession: {
      title: 'Mechanics - Forces',
      date: '2024-02-08',
      time: '2:00 PM',
    },
    schedule: 'Tue, Thu - 2:00 PM',
  },
  {
    id: '3',
    title: 'Chemistry Basics',
    teacher: 'Sarah Johnson',
    subject: 'Chemistry',
    progress: 30,
    completedSessions: 6,
    totalSessions: 20,
    nextSession: {
      title: 'Organic Chemistry',
      date: '2024-02-09',
      time: '11:00 AM',
    },
    schedule: 'Wed, Sat - 11:00 AM',
  },
]

const upcomingSessions = [
  {
    id: '1',
    title: 'Calculus - Derivatives',
    className: 'Advanced Mathematics',
    teacher: 'John Smith',
    date: '2024-02-07',
    time: '10:00 AM',
    duration: '1.5 hours',
  },
  {
    id: '2',
    title: 'Mechanics - Forces',
    className: 'Physics Fundamentals',
    teacher: 'John Smith',
    date: '2024-02-08',
    time: '2:00 PM',
    duration: '1 hour',
  },
  {
    id: '3',
    title: 'Organic Chemistry',
    className: 'Chemistry Basics',
    teacher: 'Sarah Johnson',
    date: '2024-02-09',
    time: '11:00 AM',
    duration: '1.5 hours',
  },
]

const recentMaterials = [
  { id: '1', title: 'Calculus Notes Ch. 3', type: 'PDF', class: 'Advanced Mathematics', size: '2.4 MB' },
  { id: '2', title: 'Physics Lecture Recording', type: 'VIDEO', class: 'Physics Fundamentals', duration: '45:30' },
  { id: '3', title: 'Practice Problems Set 5', type: 'PDF', class: 'Advanced Mathematics', size: '1.1 MB' },
]

export default function StudentMyClasses() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
        <p className="text-muted-foreground">View your enrolled classes and upcoming sessions</p>
      </div>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{cls.subject}</Badge>
                    <span className="text-sm font-medium text-primary">
                      {cls.progress}% complete
                    </span>
                  </div>
                  <CardTitle className="mt-2">{cls.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(cls.teacher)}
                      </AvatarFallback>
                    </Avatar>
                    {cls.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${cls.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cls.completedSessions}/{cls.totalSessions} sessions completed
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{cls.schedule}</span>
                  </div>

                  {/* Next session */}
                  {cls.nextSession && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Next Session</p>
                      <p className="font-medium text-sm">{cls.nextSession.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cls.nextSession.date).toLocaleDateString()} at {cls.nextSession.time}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/student/my-classes/${cls.id}`}>View Details</Link>
                    </Button>
                    <Button className="flex-1">
                      <Play className="mr-2 h-4 w-4" />
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled sessions for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.className}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time} ({session.duration})
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Join Session
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Materials</CardTitle>
              <CardDescription>Latest study materials from your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      {material.type === 'PDF' ? (
                        <FileText className="h-8 w-8 text-red-500" />
                      ) : (
                        <Video className="h-8 w-8 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {material.class} •{' '}
                          {material.type === 'PDF' ? material.size : material.duration}
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
