import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Search, MoreVertical, Eye, Archive, Trash2 } from 'lucide-react'

// Placeholder data
const mockClasses = [
  {
    id: '1',
    title: 'Advanced Mathematics',
    teacher: 'John Smith',
    subject: 'Mathematics',
    grade: '11th',
    status: 'ACTIVE',
    enrolledStudents: 25,
    capacity: 30,
  },
  {
    id: '2',
    title: 'English Literature',
    teacher: 'Sarah Johnson',
    subject: 'English',
    grade: '10th',
    status: 'ACTIVE',
    enrolledStudents: 18,
    capacity: 25,
  },
  {
    id: '3',
    title: 'Physics Fundamentals',
    teacher: 'John Smith',
    subject: 'Physics',
    grade: '12th',
    status: 'COMPLETED',
    enrolledStudents: 20,
    capacity: 20,
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

export default function AdminClasses() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredClasses = mockClasses.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">View all classes on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Classes</CardTitle>
              <CardDescription>Browse and manage classes</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Enrolled</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No classes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.title}</TableCell>
                      <TableCell className="text-muted-foreground">{cls.teacher}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cls.subject}</Badge>
                      </TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell>{getStatusBadge(cls.status)}</TableCell>
                      <TableCell className="text-center">
                        {cls.enrolledStudents}/{cls.capacity}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
