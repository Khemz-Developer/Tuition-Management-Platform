import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { DataTable, Column } from '@/shared/components/ui/data-table'
import { Link } from 'react-router-dom'
import { Eye, Archive, Trash2, GraduationCap, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { get } from '@/shared/services/api'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type { Class } from '@/shared/types/class.types'

const API_ENDPOINT = '/admin/classes'

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">Active</Badge>
    case 'DRAFT':
      return <Badge className="border-secondary/30 bg-secondary/70 text-secondary-foreground hover:bg-secondary">Draft</Badge>
    case 'COMPLETED':
      return <Badge className="border-accent/30 bg-accent/10 text-accent hover:bg-accent/15">Completed</Badge>
    case 'ARCHIVED':
      return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function AdminClasses() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch classes from backend
  useEffect(() => {
    setLoading(true)
    get<PaginatedResponse<Class>>(API_ENDPOINT)
      .then((res) => {
        setClasses(res.data || [])
        setError(null)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch classes')
        setClasses([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleArchive = (cls: Class) => {
    // TODO: wire to archive API when available
    console.log('Archive class', cls._id)
  }

  const handleDelete = (cls: Class) => {
    // TODO: wire to delete API when available
    console.log('Delete class', cls._id)
  }

  // Define columns for DataTable (same pattern as admin Teachers)
  const columns: Column<Class>[] = useMemo(() => [
    {
      id: 'class',
      header: 'Class',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-sm text-muted-foreground">{row.subject}</p>
          </div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      pinable: true,
      defaultPinned: 'left',
      width: '280px',
    },
    {
      id: 'teacher',
      header: 'Teacher',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium">
              {getInitials(row.teacher?.name || 'NA')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{row.teacher?.name || 'Unassigned'}</span>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => (a.teacher?.name || '').localeCompare(b.teacher?.name || ''),
    },
    {
      id: 'subject',
      header: 'Subject',
      cell: (row) => (
        <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium">
          {row.subject}
        </span>
      ),
      sortable: true,
      sortFn: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      id: 'grade',
      header: 'Grade',
      cell: (row) => (
        <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium">
          Grade {row.grade}
        </span>
      ),
      sortable: true,
      sortFn: (a, b) => a.grade.localeCompare(b.grade),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
      sortable: false,
    },
    {
      id: 'students',
      header: 'Students',
      cell: (row) => (
        <div className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2.5 py-1">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="tabular-nums font-semibold">{row.enrolledCount ?? 0}</span>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => (a.enrolledCount ?? 0) - (b.enrolledCount ?? 0),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="View details"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={`/admin/classes/${row._id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-warning hover:bg-warning/10"
            title="Archive"
            onClick={(e) => {
              e.stopPropagation()
              handleArchive(row)
            }}
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      sortable: false,
      defaultPinned: 'right',
      width: '140px',
    },
  ], [])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">View all classes on the platform</p>
      </div>

      {/* Stats bar */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Total Classes</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{classes.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Active Classes</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{classes.filter((c) => c.status === 'ACTIVE').length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{classes.reduce((sum, c) => sum + (c.enrolledCount ?? 0), 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table card - same structure as admin Teachers */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="pb-4">
          <div>
            <CardTitle>All Classes</CardTitle>
            <CardDescription>Manage and monitor all classes on the platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          <DataTable
            data={classes}
            columns={columns}
            searchKey={['title', 'subject']}
            searchPlaceholder="Search classes..."
            isLoading={loading}
            emptyMessage="No classes found"
            pageSize={10}
            showViewToggle={true}
            defaultView="list"
            renderGridItem={(row) => (
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{row.title}</h3>
                      <p className="text-sm text-muted-foreground">{row.subject} · Grade {row.grade}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(row.teacher?.name || 'NA')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{row.teacher?.name || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {getStatusBadge(row.status)}
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {row.enrolledCount ?? 0} students
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
