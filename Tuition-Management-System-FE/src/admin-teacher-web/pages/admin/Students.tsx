import { useState, useEffect } from 'react'
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
import { get } from '@/shared/services/api'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type { StudentProfile } from '@/shared/types/user.types'

// Placeholder data
// Backend API endpoint: /admin/students
const API_ENDPOINT = '/admin/students'

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
  const [students, setStudents] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    get<PaginatedResponse<StudentProfile>>(API_ENDPOINT)
      .then((res) => {
        setStudents(res.data)
        setError(null)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch students')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      (student.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
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
          {loading ? (
            <div className="text-center py-8">Loading students...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-center">Preferred Teachers</TableHead>
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
                      <TableRow key={student._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(student.user?.name || '')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.user?.name || 'N/A'}</p>
                              <p className="text-sm text-muted-foreground">{student.user?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.user?.status || 'INACTIVE')}</TableCell>
                        <TableCell>{student.grade || 'N/A'}</TableCell>
                        <TableCell className="text-center">{student.preferredTeachers?.length ?? 0}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {student.user?.createdAt ? new Date(student.user.createdAt).toLocaleDateString() : 'N/A'}
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
                                {student.user?.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
