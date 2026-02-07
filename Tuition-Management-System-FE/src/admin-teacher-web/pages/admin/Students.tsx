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
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Search, MoreVertical, Eye, Mail, Ban } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data
const mockStudents = [
  {
    id: '1',
    name: 'Alice Brown',
    email: 'alice@example.com',
    status: 'ACTIVE',
    grade: '10th',
    enrolledClasses: 3,
    joinedAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Bob Davis',
    email: 'bob@example.com',
    status: 'ACTIVE',
    grade: '11th',
    enrolledClasses: 2,
    joinedAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Carol Evans',
    email: 'carol@example.com',
    status: 'SUSPENDED',
    grade: '9th',
    enrolledClasses: 0,
    joinedAt: '2024-01-20',
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge variant="success">Active</Badge>
    case 'INACTIVE':
      return <Badge variant="secondary">Inactive</Badge>
    case 'SUSPENDED':
      return <Badge variant="destructive">Suspended</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function AdminStudents() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Manage student accounts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>View and manage student accounts</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-center">Enrolled Classes</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
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
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell className="text-center">{student.enrolledClasses}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(student.joinedAt).toLocaleDateString()}
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
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="mr-2 h-4 w-4" />
                              {student.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
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
