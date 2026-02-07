import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Calendar, Users, Save, Check, X } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const mockClasses = [
  { id: '1', title: 'Advanced Mathematics', students: 25 },
  { id: '2', title: 'Physics Fundamentals', students: 20 },
]

const mockSessions = [
  { id: '1', title: 'Calculus - Derivatives', date: '2024-02-07', classId: '1' },
  { id: '2', title: 'Physics - Mechanics', date: '2024-02-07', classId: '2' },
]

const mockStudents = [
  { id: '1', name: 'Alice Brown', email: 'alice@example.com', status: 'PRESENT' },
  { id: '2', name: 'Bob Davis', email: 'bob@example.com', status: 'PRESENT' },
  { id: '3', name: 'Carol Evans', email: 'carol@example.com', status: 'ABSENT' },
  { id: '4', name: 'David Frank', email: 'david@example.com', status: 'LATE' },
  { id: '5', name: 'Eve Green', email: 'eve@example.com', status: 'PRESENT' },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PRESENT':
      return <Badge variant="success">Present</Badge>
    case 'ABSENT':
      return <Badge variant="destructive">Absent</Badge>
    case 'LATE':
      return <Badge variant="warning">Late</Badge>
    case 'EXCUSED':
      return <Badge variant="secondary">Excused</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSession, setSelectedSession] = useState('')
  const [attendance, setAttendance] = useState<Record<string, string>>({
    '1': 'PRESENT',
    '2': 'PRESENT',
    '3': 'ABSENT',
    '4': 'LATE',
    '5': 'PRESENT',
  })

  const updateAttendance = (studentId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const presentCount = Object.values(attendance).filter((s) => s === 'PRESENT').length
  const absentCount = Object.values(attendance).filter((s) => s === 'ABSENT').length
  const lateCount = Object.values(attendance).filter((s) => s === 'LATE').length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">Track and manage student attendance</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Session</CardTitle>
          <CardDescription>Choose a class and session to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.title} ({cls.students} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent>
                  {mockSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.title} - {new Date(session.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Click on status to cycle through: Present → Absent → Late → Excused
              </CardDescription>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quick Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
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
                  <TableCell>
                    <Select
                      value={attendance[student.id]}
                      onValueChange={(value) => updateAttendance(student.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENT">Present</SelectItem>
                        <SelectItem value="ABSENT">Absent</SelectItem>
                        <SelectItem value="LATE">Late</SelectItem>
                        <SelectItem value="EXCUSED">Excused</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={attendance[student.id] === 'PRESENT' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'PRESENT')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={attendance[student.id] === 'ABSENT' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => updateAttendance(student.id, 'ABSENT')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
