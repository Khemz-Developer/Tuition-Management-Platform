import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import {
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  Play,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const stats = [
  { title: 'Enrolled Classes', value: '3', icon: BookOpen },
  { title: 'Upcoming Sessions', value: '5', icon: Calendar },
  { title: 'Attended This Month', value: '12', icon: Clock },
  { title: 'Average Score', value: '87%', icon: TrendingUp },
]

const enrolledClasses = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    teacher: 'John Smith',
    nextSession: 'Today, 10:00 AM',
    progress: 65,
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    teacher: 'John Smith',
    nextSession: 'Tomorrow, 2:00 PM',
    progress: 45,
  },
  {
    id: '3',
    title: 'Chemistry Basics',
    teacher: 'Sarah Johnson',
    nextSession: 'Wed, 11:00 AM',
    progress: 30,
  },
]

const upcomingSessions = [
  {
    id: '1',
    title: 'Calculus - Derivatives',
    className: 'Advanced Mathematics',
    teacher: 'John Smith',
    time: '10:00 AM',
    date: 'Today',
  },
  {
    id: '2',
    title: 'Physics - Mechanics',
    className: 'Physics Fundamentals',
    teacher: 'John Smith',
    time: '2:00 PM',
    date: 'Tomorrow',
  },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Enrolled classes */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Your enrolled classes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/student/my-classes">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{cls.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {cls.teacher}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{cls.progress}% complete</p>
                    <p className="text-xs text-muted-foreground">
                      Next: {cls.nextSession}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming sessions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback>{getInitials(session.teacher)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.className}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={session.date === 'Today' ? 'default' : 'secondary'}>
                          {session.date}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {session.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {session.date === 'Today' && (
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/student/classes">
                <BookOpen className="h-5 w-5" />
                <span>Browse Classes</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/student/my-classes">
                <Calendar className="h-5 w-5" />
                <span>View Schedule</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/student/messages">
                <Clock className="h-5 w-5" />
                <span>Messages</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/student/teachers">
                <TrendingUp className="h-5 w-5" />
                <span>Find Teachers</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
