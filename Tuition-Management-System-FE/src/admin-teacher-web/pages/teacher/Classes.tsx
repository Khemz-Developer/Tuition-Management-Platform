import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  ArrowLeft,
  Users,
  Globe,
  Lock,
  MapPin,
  GraduationCap,
} from 'lucide-react'
import { get, post, put, patch, del } from '@/shared/services/api'
import type { Class } from '@/shared/types/class.types'
import type { ClassVisibility } from '@/shared/types/class.types'
import {
  educationLevelLabels,
  getCreateClassOptions,
  type ProfileEducationLevel,
} from './educationOptions'
import { useToast } from '@/shared/components/ui/use-toast'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Format fee for display: Sri Lankan Rupees (Rs.) by default */
function formatFee(currency: string | undefined, fee: number | undefined): string {
  if (fee == null) return '—'
  const amount = typeof fee === 'number' ? fee.toLocaleString() : String(fee)
  if (!currency || currency === 'LKR') return `Rs. ${amount}`
  return `${currency} ${amount}`
}

/** Backend returns scheduleRules as single object { daysOfWeek, startTime, endTime }; FE type uses array */
function formatSchedule(
  scheduleRules?:
    | { dayOfWeek: number; startTime: string; endTime: string }[]
    | { daysOfWeek?: number[]; startTime?: string; endTime?: string }
): string {
  if (!scheduleRules) return '—'
  // Backend shape: single object with daysOfWeek array
  if (Array.isArray(scheduleRules) === false && 'daysOfWeek' in scheduleRules) {
    const r = scheduleRules as { daysOfWeek?: number[]; startTime?: string; endTime?: string }
    if (!r.daysOfWeek?.length || !r.startTime) return '—'
    const dayNames = r.daysOfWeek.map((d) => DAYS[d]).filter(Boolean).join(', ')
    const time = r.endTime ? `${r.startTime} – ${r.endTime}` : r.startTime
    return `${dayNames} • ${time}`
  }
  // FE shape: array of rules
  if (Array.isArray(scheduleRules) && scheduleRules.length > 0) {
    return scheduleRules
      .map((r) => `${DAYS[r.dayOfWeek] ?? ''} ${r.startTime}`)
      .filter(Boolean)
      .join(', ') || '—'
  }
  return '—'
}

const getStatusLabel = (status: string) => {
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

/** Backend may return currentEnrollment; FE type has enrolledCount */
function getEnrolledCount(cls: Class & { currentEnrollment?: number }): number {
  return cls.enrolledCount ?? cls.currentEnrollment ?? 0
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function EditClassDialog({
  class: cls,
  open,
  onClose,
  onSuccess,
  toast,
}: {
  class: Class | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
  toast: (p: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => void
}) {
  const [title, setTitle] = useState(cls?.title ?? '')
  const [description, setDescription] = useState(cls?.description ?? '')
  const [status, setStatus] = useState(cls?.status ?? 'DRAFT')
  const [visibility, setVisibility] = useState<ClassVisibility>(cls?.visibility ?? 'PUBLIC')
  const [fee, setFee] = useState(cls?.fee != null ? String(cls.fee) : '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (cls) {
      setTitle(cls.title)
      setDescription(cls.description ?? '')
      setStatus(cls.status)
      setVisibility(cls.visibility)
      setFee(cls.fee != null ? String(cls.fee) : '')
    }
  }, [cls])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cls) return
    setSaving(true)
    try {
      await patch(`/teacher/classes/${cls._id}`, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        visibility,
        fee: fee ? Number(fee) : undefined,
      })
      toast({ title: 'Class updated' })
      onSuccess()
    } catch (err: unknown) {
      toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Failed to update class' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit class</DialogTitle>
          <DialogDescription>Update class details. Subject and grade cannot be changed here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Class['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as ClassVisibility)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Fee (optional)</Label>
            <Input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

interface TeachingLocationItem {
  instituteName?: string
  city?: string
  district?: string
  state?: string
  address?: string
}

interface CreateClassProfile {
  educationLevels?: ProfileEducationLevel[]
  teachingModes?: string[]
  teachingLocations?: TeachingLocationItem[]
  studentTargetTypes?: string[]
  languages?: string[]
}

function CreateClassView({ onSuccess }: { onSuccess: () => void }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [profile, setProfile] = useState<CreateClassProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [educationLevel, setEducationLevel] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [teachingMode, setTeachingMode] = useState<string>('')
  const [locationIndex, setLocationIndex] = useState<string>('')
  const [studentTargetType, setStudentTargetType] = useState<string>('')
  const [languages, setLanguages] = useState<string[]>([])
  const [fee, setFee] = useState('')
  const [currency, setCurrency] = useState('LKR')
  const [visibility, setVisibility] = useState<ClassVisibility>('PUBLIC')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('11:00')

  useEffect(() => {
    setProfileLoading(true)
    setProfileError(null)
    get<CreateClassProfile>('/teacher/profile')
      .then((data) => setProfile(data))
      .catch((err) => setProfileError(err?.message || 'Failed to load profile'))
      .finally(() => setProfileLoading(false))
  }, [])

  const { levels, subjectsByLevel, gradesByLevel } = getCreateClassOptions(profile?.educationLevels)
  const subjects = educationLevel ? (subjectsByLevel[educationLevel] || []) : []
  const grades = educationLevel ? (gradesByLevel[educationLevel] || []) : []

  const teachingModes = profile?.teachingModes || []
  const teachingLocations = profile?.teachingLocations || []
  const studentTargetTypes = profile?.studentTargetTypes || []
  const profileLanguages = profile?.languages || []

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
  }

  const locationIdx = locationIndex === '' ? -1 : Number(locationIndex)
  const selectedLocation: TeachingLocationItem | undefined = locationIdx >= 0 ? teachingLocations[locationIdx] : undefined
  const selectedInstituteName = selectedLocation?.instituteName || ''
  const selectedAddress = selectedLocation?.address || ''

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!educationLevel || !subject || !grade || !title.trim()) {
      toast({ variant: 'destructive', title: 'Validation', description: 'Please fill Education level, Subject, Grade, and Title.' })
      return
    }
    if (!teachingMode && teachingModes.length > 0) {
      toast({ variant: 'destructive', title: 'Validation', description: 'Please select Teaching Mode.' })
      return
    }
    if (languages.length === 0 && profileLanguages.length > 0) {
      toast({ variant: 'destructive', title: 'Validation', description: 'Please select at least one Language.' })
      return
    }
    if (daysOfWeek.length === 0) {
      toast({ variant: 'destructive', title: 'Validation', description: 'Select at least one day for the schedule.' })
      return
    }
    setSubmitting(true)
    try {
      await post<{ class: Class }>('/teacher/classes', {
        title: title.trim(),
        description: description.trim() || undefined,
        subject,
        grade,
        teachingMode: teachingMode || undefined,
        instituteName: selectedInstituteName || undefined,
        address: selectedAddress || undefined,
        studentTargetType: studentTargetType || undefined,
        languages: languages.length > 0 ? languages : undefined,
        fee: fee ? Number(fee) : undefined,
        currency: currency || undefined,
        visibility,
        status: 'DRAFT',
        scheduleRules: {
          daysOfWeek,
          startTime,
          endTime,
        },
      })
      toast({ title: 'Class created', description: 'Your class has been created as draft.' })
      onSuccess()
      navigate('/teacher/classes')
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create class',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">Loading profile...</CardContent>
      </Card>
    )
  }
  if (profileError) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-destructive">{profileError}</CardContent>
      </Card>
    )
  }
  if (!levels.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Complete your profile first</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add at least one education level with subjects and grades in your Profile (Education section). Also set Teaching Modes, Teaching Locations, Student Target Type, and Languages so they appear when creating a class.
          </p>
          <Button asChild>
            <Link to="/teacher/profile">Go to Profile</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/teacher/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Class</h1>
          <p className="text-muted-foreground">Options are based on the education levels you set in your profile.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New class</CardTitle>
          <CardDescription>Subject and grade options come from your profile education settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Education level</Label>
                <Select value={educationLevel} onValueChange={(v) => { setEducationLevel(v); setSubject(''); setGrade('') }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {educationLevelLabels[level] ?? level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={setSubject} disabled={!educationLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade} onValueChange={setGrade} disabled={!educationLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (
                      <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Class title</Label>
              <Input
                id="title"
                placeholder="e.g. Mathematics Grade 10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the class"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {teachingModes.length > 0 && (
              <div className="space-y-2">
                <Label>Teaching Mode *</Label>
                <Select value={teachingMode} onValueChange={setTeachingMode} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teaching mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachingModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">From your profile</p>
              </div>
            )}

            {teachingLocations.length > 0 && (
              <div className="space-y-2">
                <Label>Institute / Location</Label>
                <Select value={locationIndex} onValueChange={setLocationIndex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institute or location" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachingLocations.map((loc, i) => {
                      const label = [loc.instituteName, loc.city, loc.district].filter(Boolean).join(', ') || `Location ${i + 1}`
                      return (
                        <SelectItem key={i} value={String(i)}>{label}</SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {selectedAddress && (
                  <p className="text-sm text-muted-foreground">Address: {selectedAddress}</p>
                )}
                <p className="text-xs text-muted-foreground">From your profile teaching locations</p>
              </div>
            )}

            {studentTargetTypes.length > 0 && (
              <div className="space-y-2">
                <Label>Student Target Type</Label>
                <Select value={studentTargetType} onValueChange={setStudentTargetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student target type" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentTargetTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">From your profile</p>
              </div>
            )}

            {profileLanguages.length > 0 && (
              <div className="space-y-2">
                <Label>Languages *</Label>
                <div className="flex flex-wrap gap-3 border rounded-md p-3">
                  {profileLanguages.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={languages.includes(lang)}
                        onCheckedChange={() => toggleLanguage(lang)}
                      />
                      <label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">{lang}</label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">From your profile. Select at least one.</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="fee">Fee (optional)</Label>
                <Input
                  id="fee"
                  type="number"
                  min={0}
                  step={0.01}
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LKR">Rs. (LKR) Sri Lankan Rupee</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as ClassVisibility)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Schedule — select days and time</Label>
              <div className="flex flex-wrap gap-4">
                {DAY_OPTIONS.map((d) => (
                  <div key={d.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${d.value}`}
                      checked={daysOfWeek.includes(d.value)}
                      onCheckedChange={() => toggleDay(d.value)}
                    />
                    <label htmlFor={`day-${d.value}`} className="text-sm font-medium leading-none cursor-pointer">
                      {d.label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Start</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-[120px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">End</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create class'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/teacher/classes">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TeacherClasses() {
  const location = useLocation()
  const isCreatePage = location.pathname === '/teacher/classes/create'
  const [classesRefreshKey, setClassesRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [deletingClass, setDeletingClass] = useState<Class | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    setError(null)
    get<{ classes: Class[] }>('/teacher/classes')
      .then((res) => setClasses(res.classes || []))
      .catch((err) => setError(err?.message || 'Failed to load classes'))
      .finally(() => setLoading(false))
  }, [classesRefreshKey])

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cls.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && cls.status === activeTab.toUpperCase()
  })

  if (isCreatePage) {
    return <CreateClassView onSuccess={() => setClassesRefreshKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and course materials</p>
        </div>
        <Button asChild>
          <Link to="/teacher/classes/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading classes...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({classes.length})</TabsTrigger>
            <TabsTrigger value="ACTIVE">
              Active ({classes.filter((c) => c.status === 'ACTIVE').length})
            </TabsTrigger>
            <TabsTrigger value="DRAFT">
              Draft ({classes.filter((c) => c.status === 'DRAFT').length})
            </TabsTrigger>
            <TabsTrigger value="COMPLETED">
              Completed ({classes.filter((c) => c.status === 'COMPLETED').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No classes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'all'
                      ? "You haven't created any classes yet."
                      : `No ${activeTab.toLowerCase()} classes found.`}
                  </p>
                  <Button asChild>
                    <Link to="/teacher/classes/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Class
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Summary stats */}
                <div className="grid gap-4 sm:grid-cols-3 mb-5">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-medium">Total classes</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold">{filteredClasses.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Total students</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold">
                        {filteredClasses.reduce((sum, c) => sum + getEnrolledCount(c), 0)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold">
                        {filteredClasses.filter((c) => c.status === 'ACTIVE').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredClasses.map((cls) => {
                    const enrolled = getEnrolledCount(cls)
                    const statusTone =
                      cls.status === 'ACTIVE'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : cls.status === 'DRAFT'
                          ? 'bg-secondary text-secondary-foreground border-secondary/40'
                          : 'bg-muted text-muted-foreground border-border'
                    return (
                      <Card
                        key={cls._id}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/60 to-accent/60" />
                        <CardHeader className="space-y-4 pb-3 pt-5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <CardTitle className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight">
                                {cls.title}
                              </CardTitle>
                              <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                  {cls.subject}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                  Grade {cls.grade}
                                </span>
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                  <Link to={`/teacher/classes/${cls._id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditingClass(cls)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Class
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeletingClass(cls)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`border text-xs font-semibold ${statusTone}`}>{getStatusLabel(cls.status)}</Badge>
                            {cls.visibility === 'PUBLIC' ? (
                              <Badge variant="outline" className="gap-1 text-xs font-normal">
                                <Globe className="h-3 w-3" />
                                Public
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-xs font-normal">
                                <Lock className="h-3 w-3" />
                                Private
                              </Badge>
                            )}
                            {cls.fee != null && (
                              <Badge variant="outline" className="text-xs font-medium">
                                {formatFee(cls.currency, cls.fee)}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4 pb-4">
                          {cls.description && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{cls.description}</p>
                          )}
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 shrink-0 text-primary" />
                              <span className="line-clamp-1">{formatSchedule(cls.scheduleRules as never)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-muted-foreground">
                              <span className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 shrink-0 text-primary" />
                                Students
                              </span>
                              <span className="font-semibold tabular-nums text-foreground">{enrolled} {enrolled === 1 ? 'student' : 'students'}</span>
                            </div>
                            {(cls.instituteName || cls.teachingMode) && (
                              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                <span className="line-clamp-1">{cls.instituteName || cls.teachingMode}</span>
                              </div>
                            )}
                            <div className="pt-1 text-xs text-muted-foreground/80">
                              Created {formatDate(cls.createdAt)}
                            </div>
                          </div>
                        </CardContent>
                        <div className="flex gap-2 px-6 pb-5 pt-0">
                          <Button variant="outline" className="flex-1 rounded-xl border-border/80" asChild>
                            <Link to={`/teacher/classes/${cls._id}`}>View Class</Link>
                          </Button>
                          <Button variant="secondary" size="icon" className="rounded-xl" onClick={() => setEditingClass(cls)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {/* Edit Class Dialog */}
                <EditClassDialog
                  class={editingClass}
                  open={!!editingClass}
                  onClose={() => setEditingClass(null)}
                  onSuccess={() => {
                    setEditingClass(null)
                    setClassesRefreshKey((k) => k + 1)
                  }}
                  toast={toast}
                />

                {/* Delete Class Dialog */}
                <Dialog open={!!deletingClass} onOpenChange={(open) => !open && setDeletingClass(null)}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Delete class</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete &quot;{deletingClass?.title}&quot;? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button variant="outline" onClick={() => setDeletingClass(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          if (!deletingClass) return
                          try {
                            await del(`/teacher/classes/${deletingClass._id}`)
                            toast({ title: 'Class deleted' })
                            setDeletingClass(null)
                            setClassesRefreshKey((k) => k + 1)
                          } catch (err: unknown) {
                            toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete class' })
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
