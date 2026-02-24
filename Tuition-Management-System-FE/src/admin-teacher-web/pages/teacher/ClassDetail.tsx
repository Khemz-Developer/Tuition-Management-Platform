import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  ArrowLeft,
  Users,
  Clock,
  FileText,
  Globe,
  Lock,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import { get } from '@/shared/services/api'
import type { Class } from '@/shared/types/class.types'
import { getInitials } from '@/lib/utils'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatFee(currency: string | undefined, fee: number | undefined): string {
  if (fee == null) return '—'
  const amount = typeof fee === 'number' ? fee.toLocaleString() : String(fee)
  if (!currency || currency === 'LKR') return `Rs. ${amount}`
  return `${currency} ${amount}`
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatSchedule(
  scheduleRules?:
    | { dayOfWeek: number; startTime: string; endTime: string }[]
    | { daysOfWeek?: number[]; startTime?: string; endTime?: string }
): string {
  if (!scheduleRules) return '—'
  if (Array.isArray(scheduleRules) === false && 'daysOfWeek' in scheduleRules) {
    const r = scheduleRules as { daysOfWeek?: number[]; startTime?: string; endTime?: string }
    if (!r.daysOfWeek?.length || !r.startTime) return '—'
    const dayNames = r.daysOfWeek.map((d) => DAYS[d]).filter(Boolean).join(', ')
    const time = r.endTime ? `${r.startTime} – ${r.endTime}` : r.startTime
    return `${dayNames} • ${time}`
  }
  if (Array.isArray(scheduleRules) && scheduleRules.length > 0) {
    return (
      scheduleRules
        .map((r) => `${DAYS[r.dayOfWeek] ?? ''} ${r.startTime}${r.endTime ? `-${r.endTime}` : ''}`)
        .filter(Boolean)
        .join(', ') || '—'
    )
  }
  return '—'
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active'
    case 'DRAFT':
      return 'Draft'
    case 'COMPLETED':
      return 'Completed'
    case 'ARCHIVED':
      return 'Archived'
    default:
      return status
  }
}

function getStatusTone(status: string): string {
  if (status === 'ACTIVE') return 'bg-primary/10 text-primary border-primary/20'
  if (status === 'DRAFT') return 'bg-secondary text-secondary-foreground border-secondary/40'
  return 'bg-muted text-muted-foreground border-border'
}

const enrolledStudents = [
  { id: '1', name: 'Alice Brown', email: 'alice@example.com', joinedAt: '2024-01-15', attendance: 95 },
  { id: '2', name: 'Bob Davis', email: 'bob@example.com', joinedAt: '2024-01-15', attendance: 88 },
  { id: '3', name: 'Carol Evans', email: 'carol@example.com', joinedAt: '2024-01-16', attendance: 92 },
]

export default function TeacherClassDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const [classData, setClassData] = useState<Class | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid class id')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    get<{ classes: Class[] }>('/teacher/classes')
      .then((res) => {
        const cls = (res.classes || []).find((c) => c._id === id)
        if (!cls) {
          setError('Class not found')
          setClassData(null)
          return
        }
        setClassData(cls)
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load class details')
        setClassData(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const activeTab = useMemo(() => {
    if (location.pathname.endsWith('/students')) return 'students'
    if (location.pathname.endsWith('/calendar') || location.pathname.endsWith('/attendance') || location.pathname.endsWith('/content')) return 'overview'
    return 'overview'
  }, [location.pathname])

  const handleTabChange = (value: string) => {
    if (!id) return
    if (value === 'overview') navigate(`/teacher/classes/${id}`)
    else if (value === 'students') navigate(`/teacher/classes/${id}/students`)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">Loading class details...</CardContent>
      </Card>
    )
  }

  if (error || !classData) {
    return (
      <Card>
        <CardContent className="space-y-4 py-12 text-center">
          <p className="text-destructive">{error || 'Class not found'}</p>
          <Button variant="outline" asChild>
            <Link to="/teacher/classes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classes
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const enrolledCount = classData.enrolledCount ?? (classData as Class & { currentEnrollment?: number }).currentEnrollment ?? 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit" asChild>
          <Link to="/teacher/classes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Link>
        </Button>

        <Card className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/60 to-accent/60" />
          <CardContent className="space-y-5 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`border text-xs font-semibold ${getStatusTone(classData.status)}`}>
                    {getStatusLabel(classData.status)}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-xs font-medium">
                    {classData.visibility === 'PUBLIC' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {classData.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                  </Badge>
                  {classData.fee != null && (
                    <Badge variant="outline" className="text-xs font-medium">
                      {formatFee(classData.currency, classData.fee)}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{classData.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {classData.subject}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium">
                    Grade {classData.grade}
                  </span>
                  {(classData.instituteName || classData.teachingMode) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      {classData.instituteName || classData.teachingMode}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full max-w-xs rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Students</span>
                  <span className="font-semibold text-foreground tabular-nums">{enrolledCount} {enrolledCount === 1 ? 'student' : 'students'}</span>
                </div>
              </div>
            </div>
            {classData.description && <p className="text-sm leading-relaxed text-muted-foreground">{classData.description}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="mt-1 grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCount} {enrolledCount === 1 ? 'student' : 'students'}</div>
            <p className="text-xs text-muted-foreground">In this class</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold leading-snug">{formatSchedule(classData.scheduleRules as never)}</div>
            <p className="text-xs text-muted-foreground">Weekly schedule</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatDate(classData.createdAt)}</div>
            <p className="text-xs text-muted-foreground">Class creation date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="rounded-xl border border-border/70 bg-card/80 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students ({enrolledStudents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="rounded-2xl border-border/70 bg-card/95">
            <CardHeader>
              <CardTitle>About this Class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {classData.description && <p className="text-muted-foreground">{classData.description}</p>}
              {classData.languages && classData.languages.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {classData.languages.map((language) => (
                      <Badge key={language} variant="outline" className="font-normal">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="rounded-2xl border-border/70 bg-card/95">
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Students currently enrolled in this class</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledStudents.map((student) => (
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
                      <TableCell className="text-muted-foreground">
                        {new Date(student.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.attendance >= 90 ? 'success' : 'warning'}>
                          {student.attendance}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
