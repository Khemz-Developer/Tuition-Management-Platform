import { useState, useEffect, useMemo } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Textarea } from '@/shared/components/ui/textarea'
import { Search, MoreVertical, Check, X, Eye, Mail, Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { get, post } from '@/shared/services/api'
import { useToast } from '@/shared/components/ui/use-toast'

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email?: string
  status: string
  subjects: string[]
  grades?: string[]
  bio?: string
  tagline?: string
  phone?: string
  image?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
  experience?: number
  qualifications?: string[]
  createdAt: string
  updatedAt?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  userId?: {
    email?: string
  }
}

interface TeachersResponse {
  data: Teacher[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

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
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [teacherDetails, setTeacherDetails] = useState<Teacher | null>(null)
  const { toast } = useToast()

  // Fetch teachers from backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params: Record<string, unknown> = {
          page: 1,
          limit: 100, // Get all teachers for now
        }
        
        // Add status filter if not 'all'
        if (activeTab !== 'all') {
          params.status = activeTab.toUpperCase()
        }
        
        // Add search query if provided
        if (searchQuery.trim()) {
          params.search = searchQuery.trim()
        }
        
        const response = await get<TeachersResponse>('/admin/teachers', params)
        setTeachers(response.data || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load teachers')
        setTeachers([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search query
    const timeoutId = setTimeout(() => {
      fetchTeachers()
    }, searchQuery ? 500 : 0)

    return () => clearTimeout(timeoutId)
  }, [activeTab, searchQuery])

  // Transform teachers data for display
  const displayTeachers = useMemo(() => {
    return teachers.map((teacher) => ({
      id: teacher._id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.userId?.email || teacher.email || '',
      status: teacher.status,
      subjects: teacher.subjects || [],
      image: teacher.image,
      totalStudents: 0, // TODO: Add this from backend if available
      totalClasses: 0, // TODO: Add this from backend if available
      joinedAt: teacher.createdAt,
    }))
  }, [teachers])

  // Count teachers by status
  const statusCounts = useMemo(() => {
    return {
      all: teachers.length,
      pending: teachers.filter((t) => t.status === 'PENDING').length,
      approved: teachers.filter((t) => t.status === 'APPROVED').length,
      rejected: teachers.filter((t) => t.status === 'REJECTED').length,
    }
  }, [teachers])

  // Fetch teacher details
  const fetchTeacherDetails = async (teacherId: string) => {
    try {
      setIsDetailsLoading(true)
      const details = await get<Teacher>(`/admin/teachers/${teacherId}`)
      setTeacherDetails(details)
      setIsDetailsOpen(true)
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to load teacher details',
        variant: 'destructive',
      })
    } finally {
      setIsDetailsLoading(false)
    }
  }

  // Handle view details
  const handleViewDetails = (teacherId: string) => {
    const teacher = teachers.find((t) => t._id === teacherId)
    if (teacher) {
      setSelectedTeacher(teacher)
      fetchTeacherDetails(teacherId)
    }
  }

  // Handle approve teacher
  const handleApprove = async (teacherId: string) => {
    const teacher = teachers.find((t) => t._id === teacherId)
    if (!teacher) return

    try {
      setIsActionLoading(true)
      await post(`/admin/teachers/${teacherId}/approve`)
      toast({
        title: 'Success',
        description: `${teacher.firstName} ${teacher.lastName} has been approved.`,
        variant: 'success',
      })
      // Refresh teachers list
      const params: Record<string, unknown> = {
        page: 1,
        limit: 100,
      }
      if (activeTab !== 'all') {
        params.status = activeTab.toUpperCase()
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      const response = await get<TeachersResponse>('/admin/teachers', params)
      setTeachers(response.data || [])
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to approve teacher',
        variant: 'destructive',
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  // Handle reject teacher
  const handleReject = async () => {
    if (!selectedTeacher) return
    
    if (!rejectReason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsActionLoading(true)
      await post(`/admin/teachers/${selectedTeacher._id}/reject`, {
        reason: rejectReason.trim(),
      })
      toast({
        title: 'Success',
        description: `${selectedTeacher.firstName} ${selectedTeacher.lastName} has been rejected.`,
        variant: 'success',
      })
      setIsRejectOpen(false)
      setRejectReason('')
      // Refresh teachers list
      const params: Record<string, unknown> = {
        page: 1,
        limit: 100,
      }
      if (activeTab !== 'all') {
        params.status = activeTab.toUpperCase()
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      const response = await get<TeachersResponse>('/admin/teachers', params)
      setTeachers(response.data || [])
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to reject teacher',
        variant: 'destructive',
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  // Open reject dialog
  const openRejectDialog = (teacherId: string) => {
    const teacher = teachers.find((t) => t._id === teacherId)
    if (teacher) {
      setSelectedTeacher(teacher)
      setRejectReason('')
      setIsRejectOpen(true)
    }
  }

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
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                  </div>
                ) : (
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
                      {displayTeachers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            {searchQuery ? 'No teachers found matching your search' : 'No teachers found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayTeachers.map((teacher) => (
                          <TableRow key={teacher.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={teacher.image} alt={teacher.name} />
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
                                {teacher.subjects.length > 0 ? (
                                  teacher.subjects.map((subject) => (
                                    <Badge key={subject} variant="outline" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">No subjects</span>
                                )}
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
                                  <DropdownMenuItem onClick={() => handleViewDetails(teacher.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  {teacher.status === 'PENDING' && (
                                    <>
                                      <DropdownMenuItem
                                        className="text-green-600"
                                        onClick={() => handleApprove(teacher.id)}
                                        disabled={isActionLoading}
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => openRejectDialog(teacher.id)}
                                        disabled={isActionLoading}
                                      >
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
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Teacher Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
            <DialogDescription>
              Complete information about the teacher profile
            </DialogDescription>
          </DialogHeader>
          {isDetailsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : teacherDetails ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={teacherDetails.image} 
                      alt={`${teacherDetails.firstName} ${teacherDetails.lastName}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(`${teacherDetails.firstName} ${teacherDetails.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {teacherDetails.firstName} {teacherDetails.lastName}
                    </h3>
                    <p className="text-muted-foreground">
                      {teacherDetails.userId?.email || teacherDetails.email}
                    </p>
                    <div className="mt-2">{getStatusBadge(teacherDetails.status)}</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{teacherDetails.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm">
                    {teacherDetails.location
                      ? `${teacherDetails.location.city || ''}${teacherDetails.location.city && teacherDetails.location.state ? ', ' : ''}${teacherDetails.location.state || ''}${teacherDetails.location.country ? `, ${teacherDetails.location.country}` : ''}`.trim() || 'Not provided'
                      : 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              {teacherDetails.tagline && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tagline</label>
                  <p className="text-sm">{teacherDetails.tagline}</p>
                </div>
              )}

              {/* Bio */}
              {teacherDetails.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-sm whitespace-pre-wrap">{teacherDetails.bio}</p>
                </div>
              )}

              {/* Subjects */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subjects</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacherDetails.subjects && teacherDetails.subjects.length > 0 ? (
                    teacherDetails.subjects.map((subject) => (
                      <Badge key={subject} variant="outline">
                        {subject}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No subjects</span>
                  )}
                </div>
              </div>

              {/* Grades */}
              {teacherDetails.grades && teacherDetails.grades.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Grades</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teacherDetails.grades.map((grade) => (
                      <Badge key={grade} variant="outline">
                        {grade}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {teacherDetails.experience && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Experience</label>
                  <p className="text-sm">{teacherDetails.experience} years</p>
                </div>
              )}

              {/* Qualifications */}
              {teacherDetails.qualifications && teacherDetails.qualifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualifications</label>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {teacherDetails.qualifications.map((qual, index) => (
                      <li key={index} className="text-sm">{qual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {teacherDetails.status === 'REJECTED' && teacherDetails.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
                  <p className="text-sm text-destructive mt-2">{teacherDetails.rejectionReason}</p>
                  {teacherDetails.rejectedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Rejected on {new Date(teacherDetails.rejectedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Approval Date (if approved) */}
              {teacherDetails.status === 'APPROVED' && teacherDetails.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approved On</label>
                  <p className="text-sm mt-2">
                    {new Date(teacherDetails.approvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Joined</label>
                  <p className="text-sm">
                    {new Date(teacherDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {teacherDetails.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">
                      {new Date(teacherDetails.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {teacherDetails?.status === 'PENDING' && (
              <>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (teacherDetails) {
                      setIsDetailsOpen(false)
                      handleApprove(teacherDetails._id)
                    }
                  }}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (teacherDetails) {
                      setIsDetailsOpen(false)
                      openRejectDialog(teacherDetails._id)
                    }
                  }}
                  disabled={isActionLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Teacher Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Teacher</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedTeacher?.firstName} {selectedTeacher?.lastName}'s application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rejection Reason *</label>
              <Textarea
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectOpen(false)
                setRejectReason('')
              }}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isActionLoading || !rejectReason.trim()}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Reject Teacher
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
