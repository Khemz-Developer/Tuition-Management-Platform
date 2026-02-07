import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Calendar, Clock, Plus, Video, Users, Play, Edit } from 'lucide-react'

// Placeholder data
const mockSessions = [
  {
    id: '1',
    title: 'Calculus - Derivatives',
    className: 'Advanced Mathematics',
    date: '2024-02-07',
    time: '10:00 AM',
    duration: '1.5 hours',
    status: 'SCHEDULED',
    attendees: 25,
  },
  {
    id: '2',
    title: 'Physics - Mechanics Review',
    className: 'Physics Fundamentals',
    date: '2024-02-07',
    time: '2:00 PM',
    duration: '1 hour',
    status: 'SCHEDULED',
    attendees: 20,
  },
  {
    id: '3',
    title: 'Calculus - Integration',
    className: 'Advanced Mathematics',
    date: '2024-02-05',
    time: '10:00 AM',
    duration: '1.5 hours',
    status: 'COMPLETED',
    attendees: 23,
  },
  {
    id: '4',
    title: 'Physics - Newton\'s Laws',
    className: 'Physics Fundamentals',
    date: '2024-02-05',
    time: '2:00 PM',
    duration: '1 hour',
    status: 'COMPLETED',
    attendees: 18,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return <Badge variant="info">Scheduled</Badge>
    case 'IN_PROGRESS':
      return <Badge variant="success">In Progress</Badge>
    case 'COMPLETED':
      return <Badge variant="secondary">Completed</Badge>
    case 'CANCELLED':
      return <Badge variant="destructive">Cancelled</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function TeacherSessions() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const upcomingSessions = mockSessions.filter(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS')
  const pastSessions = mockSessions.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">Schedule and manage your teaching sessions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Session</DialogTitle>
              <DialogDescription>
                Create a new session for one of your classes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Advanced Mathematics</SelectItem>
                    <SelectItem value="2">Physics Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Session Title</Label>
                <Input id="title" placeholder="e.g., Calculus - Derivatives" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" defaultValue={90} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" placeholder="Topics to be covered..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateOpen(false)}>
                Schedule Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar view placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session Calendar
          </CardTitle>
          <CardDescription>View all your scheduled sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Calendar view will be rendered here (FullCalendar)</p>
          </div>
        </CardContent>
      </Card>

      {/* Sessions list */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule your next session to get started
                  </p>
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">{session.className}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(session.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {session.time} ({session.duration})
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {session.attendees} students
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(session.status)}
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {pastSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">{session.className}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.attendees} attended
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(session.status)}
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
