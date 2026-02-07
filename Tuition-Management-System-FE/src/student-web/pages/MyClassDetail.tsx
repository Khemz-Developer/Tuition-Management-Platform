import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  FileText,
  Video,
  Download,
  CheckCircle,
  Circle,
  MessageSquare,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const classData = {
  id: '1',
  title: 'Advanced Mathematics',
  teacher: {
    name: 'John Smith',
    avatar: null,
  },
  subject: 'Mathematics',
  progress: 65,
  completedSessions: 15,
  totalSessions: 24,
  schedule: 'Mon, Wed, Fri - 10:00 AM',
  attendance: 95,
}

const sessions = [
  { id: '1', title: 'Introduction to Calculus', date: '2024-01-15', status: 'COMPLETED', attended: true },
  { id: '2', title: 'Limits - Part 1', date: '2024-01-17', status: 'COMPLETED', attended: true },
  { id: '3', title: 'Limits - Part 2', date: '2024-01-19', status: 'COMPLETED', attended: true },
  { id: '4', title: 'Continuity', date: '2024-01-22', status: 'COMPLETED', attended: false },
  { id: '5', title: 'Derivatives - Introduction', date: '2024-02-07', status: 'UPCOMING', attended: null },
  { id: '6', title: 'Derivatives - Rules', date: '2024-02-09', status: 'UPCOMING', attended: null },
]

const materials = [
  { id: '1', title: 'Calculus Notes - Chapter 1', type: 'PDF', size: '2.4 MB' },
  { id: '2', title: 'Lecture Recording - Limits', type: 'VIDEO', duration: '45:30' },
  { id: '3', title: 'Practice Problems Set 1', type: 'PDF', size: '1.1 MB' },
  { id: '4', title: 'Formula Sheet', type: 'PDF', size: '0.5 MB' },
]

export default function StudentMyClassDetail() {
  const { classId } = useParams()

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" className="w-fit" asChild>
        <Link to="/student/my-classes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Classes
        </Link>
      </Button>

      {/* Class header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">
                  {getInitials(classData.teacher.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge variant="secondary" className="mb-1">{classData.subject}</Badge>
                <h1 className="text-2xl font-bold">{classData.title}</h1>
                <p className="text-muted-foreground">by {classData.teacher.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Teacher
              </Button>
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Join Next Session
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-2xl font-bold">{classData.progress}%</p>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-2xl font-bold">{classData.completedSessions}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-2xl font-bold">{classData.totalSessions - classData.completedSessions}</p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-2xl font-bold">{classData.attendance}%</p>
              <p className="text-sm text-muted-foreground">Attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Sessions</CardTitle>
              <CardDescription>
                {classData.completedSessions} of {classData.totalSessions} sessions completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10">
                        {session.status === 'COMPLETED' ? (
                          session.attended ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-red-500" />
                          )
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.status === 'COMPLETED' ? (
                        <>
                          <Badge variant={session.attended ? 'success' : 'destructive'}>
                            {session.attended ? 'Attended' : 'Missed'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Recording
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="info">Upcoming</Badge>
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Join
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>Study resources for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {materials.map((material) => (
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
                          {material.type} •{' '}
                          {material.type === 'PDF' ? material.size : material.duration}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
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
