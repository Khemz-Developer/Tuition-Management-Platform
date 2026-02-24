import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { DataTable, Column } from '@/shared/components/ui/data-table'
import { MoreVertical, Check, X, Eye, Mail, Loader2, Star, RefreshCw } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { get, post, patch } from '@/shared/services/api'
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
  const [activeTab, setActiveTab] = useState('all')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [statusTeacher, setStatusTeacher] = useState<Teacher | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [statusChangeReason, setStatusChangeReason] = useState('')
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
        
        const response = await get<TeachersResponse>('/admin/teachers', params)
        setTeachers(response.data || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load teachers')
        setTeachers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeachers()
  }, [activeTab])

  // Define columns for DataTable
  const columns: Column<Teacher>[] = useMemo(() => [
    {
      id: 'teacher',
      header: 'Teacher',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.image} alt={`${row.firstName} ${row.lastName}`} />
            <AvatarFallback>{getInitials(`${row.firstName} ${row.lastName}`)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.firstName} {row.lastName}</p>
            <p className="text-sm text-muted-foreground">{row.userId?.email || row.email || ''}</p>
          </div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => {
        const aName = `${a.firstName} ${a.lastName}`.toLowerCase()
        const bName = `${b.firstName} ${b.lastName}`.toLowerCase()
        return aName.localeCompare(bName)
      },
      pinable: true,
      defaultPinned: 'left',
      width: '300px',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
      sortable: false,
      pinable: true,
    },
    {
      id: 'subjects',
      header: 'Subjects',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects && row.subjects.length > 0 ? (
            row.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="outline" className="text-xs">
                {subject}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No subjects</span>
          )}
          {row.subjects && row.subjects.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{row.subjects.length - 3}
            </Badge>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: () => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">4.5</span>
          <span className="text-xs text-muted-foreground">(120)</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'students',
      header: 'Students',
      accessorKey: 'totalStudents' as keyof Teacher,
      cell: () => <span className="text-center">0</span>,
      sortable: true,
    },
    {
      id: 'classes',
      header: 'Classes',
      accessorKey: 'totalClasses' as keyof Teacher,
      cell: () => <span className="text-center">0</span>,
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(row._id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openStatusDialog(row)} disabled={isActionLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            {row.status === 'PENDING' && (
              <>
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => handleApprove(row._id)}
                  disabled={isActionLoading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => openRejectDialog(row._id)}
                  disabled={isActionLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      sortable: false,
      defaultPinned: 'right',
    },
  ], [isActionLoading])

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

  // Open change status dialog
  const openStatusDialog = (teacher: Teacher) => {
    setStatusTeacher(teacher)
    setNewStatus(teacher.status)
    setStatusChangeReason('')
    setIsStatusDialogOpen(true)
  }

  // Handle change teacher status
  const handleChangeStatus = async () => {
    if (!statusTeacher) return
    if (newStatus === 'REJECTED' && !statusChangeReason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a reason when setting status to Rejected',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsActionLoading(true)
      await patch(`/admin/teachers/${statusTeacher._id}/status`, {
        status: newStatus,
        ...(newStatus === 'REJECTED' && { reason: statusChangeReason.trim() }),
      })
      toast({
        title: 'Success',
        description: `Status updated to ${newStatus === 'APPROVED' ? 'Approved' : newStatus === 'REJECTED' ? 'Rejected' : 'Pending'}.`,
        variant: 'success',
      })
      setIsStatusDialogOpen(false)
      setStatusTeacher(null)
      setNewStatus('')
      setStatusChangeReason('')
      if (teacherDetails?._id === statusTeacher._id) {
        setTeacherDetails(null)
        setIsDetailsOpen(false)
      }
      // Refresh teachers list
      const params: Record<string, unknown> = { page: 1, limit: 100 }
      if (activeTab !== 'all') params.status = activeTab.toUpperCase()
      const response = await get<TeachersResponse>('/admin/teachers', params)
      setTeachers(response.data || [])
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to update status',
        variant: 'destructive',
      })
    } finally {
      setIsActionLoading(false)
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
              <CardTitle>Teachers</CardTitle>
              <CardDescription>View and manage teacher accounts</CardDescription>
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
              <DataTable
                data={teachers}
                columns={columns}
                searchKey={['firstName', 'lastName', 'email']}
                searchPlaceholder="Search Teachers..."
                isLoading={isLoading}
                emptyMessage="No teachers found"
                pageSize={5}
                showViewToggle={true}
                defaultView="list"
                renderGridItem={(row) => (
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={row.image} alt={`${row.firstName} ${row.lastName}`} />
                          <AvatarFallback>{getInitials(`${row.firstName} ${row.lastName}`)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{row.firstName} {row.lastName}</h3>
                          <p className="text-sm text-muted-foreground">{row.userId?.email || row.email || ''}</p>
                          <div className="mt-2">{getStatusBadge(row.status)}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {row.subjects && row.subjects.slice(0, 3).map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />
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
            {teacherDetails && (
              <Button
                variant="secondary"
                onClick={() => {
                  openStatusDialog(teacherDetails)
                  setIsDetailsOpen(false)
                }}
                disabled={isActionLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Change Status
              </Button>
            )}
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

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Teacher Status</DialogTitle>
            <DialogDescription>
              Update the status for {statusTeacher?.firstName} {statusTeacher?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newStatus === 'REJECTED' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Reason (required for Rejected)</label>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsStatusDialogOpen(false)
                setStatusTeacher(null)
                setNewStatus('')
                setStatusChangeReason('')
              }}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeStatus}
              disabled={isActionLoading || (newStatus === 'REJECTED' && !statusChangeReason.trim())}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
