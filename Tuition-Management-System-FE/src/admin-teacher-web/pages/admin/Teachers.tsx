import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
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
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Search, MoreVertical, Check, X, Eye, Mail } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// Placeholder data - will be replaced with real API data
const mockTeachers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    status: 'APPROVED',
    subjects: ['Mathematics', 'Physics'],
    totalStudents: 45,
    totalClasses: 3,
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'PENDING',
    subjects: ['English', 'Literature'],
    totalStudents: 0,
    totalClasses: 0,
    joinedAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    status: 'REJECTED',
    subjects: ['Chemistry'],
    totalStudents: 0,
    totalClasses: 0,
    joinedAt: '2024-01-28',
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return <Badge variant="success">Approved</Badge>
    case 'PENDING':
      return <Badge variant="warning">Pending</Badge>
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function AdminTeachers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredTeachers = mockTeachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && teacher.status === activeTab.toUpperCase()
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage and review teacher applications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Teachers</CardTitle>
              <CardDescription>View and manage teacher accounts</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({mockTeachers.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({mockTeachers.filter((t) => t.status === 'PENDING').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({mockTeachers.filter((t) => t.status === 'APPROVED').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({mockTeachers.filter((t) => t.status === 'REJECTED').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead className="text-center">Classes</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No teachers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{teacher.name}</p>
                                <p className="text-sm text-muted-foreground">{teacher.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects.map((subject) => (
                                <Badge key={subject} variant="outline" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{teacher.totalStudents}</TableCell>
                          <TableCell className="text-center">{teacher.totalClasses}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(teacher.joinedAt).toLocaleDateString()}
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
                                {teacher.status === 'PENDING' && (
                                  <>
                                    <DropdownMenuItem className="text-green-600">
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      <X className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
