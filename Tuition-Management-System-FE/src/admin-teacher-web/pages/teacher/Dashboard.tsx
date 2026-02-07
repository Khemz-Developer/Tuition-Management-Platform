import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Users,
  BookOpen,
  CalendarDays,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Placeholder stats
const stats = [
  {
    title: 'Total Students',
    value: '56',
    change: '+4 this month',
    icon: Users,
  },
  {
    title: 'Active Classes',
    value: '5',
    change: '2 starting soon',
    icon: BookOpen,
  },
  {
    title: 'Upcoming Sessions',
    value: '8',
    change: 'This week',
    icon: CalendarDays,
  },
  {
    title: 'Average Attendance',
    value: '92%',
    change: '+3% from last month',
    icon: TrendingUp,
  },
]

// Placeholder upcoming sessions
const upcomingSessions = [
  {
    id: '1',
    title: 'Advanced Mathematics - Calculus',
    className: 'Advanced Mathematics',
    time: '10:00 AM',
    date: 'Today',
    students: 25,
  },
  {
    id: '2',
    title: 'Physics - Mechanics',
    className: 'Physics Fundamentals',
    time: '2:00 PM',
    date: 'Today',
    students: 20,
  },
  {
    id: '3',
    title: 'Advanced Mathematics - Algebra',
    className: 'Advanced Mathematics',
    time: '10:00 AM',
    date: 'Tomorrow',
    students: 25,
  },
]

// Placeholder recent activity
const recentActivity = [
  { text: 'New enrollment request from Alice Brown', time: '2 hours ago' },
  { text: 'Session completed: Physics - Mechanics', time: '5 hours ago' },
  { text: 'Material uploaded: Calculus Notes', time: '1 day ago' },
  { text: 'New message from student Bob Davis', time: '1 day ago' },
]

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>
        <Button asChild>
          <Link to="/teacher/classes/new">
            <BookOpen className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
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
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Upcoming sessions */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled sessions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/teacher/sessions">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.className}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={session.date === 'Today' ? 'default' : 'secondary'}>
                      {session.date}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.time} • {session.students} students
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
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
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/teacher/sessions">
                <CalendarDays className="h-5 w-5" />
                <span>Schedule Session</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/teacher/attendance">
                <Users className="h-5 w-5" />
                <span>Mark Attendance</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/teacher/content">
                <BookOpen className="h-5 w-5" />
                <span>Upload Material</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/teacher/messages">
                <TrendingUp className="h-5 w-5" />
                <span>View Messages</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
