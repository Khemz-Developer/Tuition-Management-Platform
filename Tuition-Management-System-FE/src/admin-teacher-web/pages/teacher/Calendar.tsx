import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventInput } from '@fullcalendar/core'
import { addWeeks, setHours, setMinutes, startOfToday, addDays, getDay, subWeeks, format, isToday, isTomorrow, startOfWeek, endOfWeek, isSameDay } from 'date-fns'
import { get } from '@/shared/services/api'
import type { Class } from '@/shared/types/class.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  BookOpen,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutGrid,
  Users,
  CalendarDays,
  Filter,
  Eye,
} from 'lucide-react'

/** Backend returns scheduleRules as { daysOfWeek: number[], startTime, endTime } */
type ScheduleRules =
  | { daysOfWeek: number[]; startTime: string; endTime: string }
  | { dayOfWeek: number; startTime: string; endTime: string }[]

function parseTime(timeStr: string): { h: number; m: number } {
  const [h, m] = (timeStr || '00:00').split(':').map(Number)
  return { h: h ?? 0, m: m ?? 0 }
}

// Subject color mapping for visual distinction
const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Mathematics: { bg: 'bg-blue-500/90', border: 'border-blue-600', text: 'text-white' },
  Science: { bg: 'bg-emerald-500/90', border: 'border-emerald-600', text: 'text-white' },
  English: { bg: 'bg-purple-500/90', border: 'border-purple-600', text: 'text-white' },
  Sinhala: { bg: 'bg-orange-500/90', border: 'border-orange-600', text: 'text-white' },
  Tamil: { bg: 'bg-rose-500/90', border: 'border-rose-600', text: 'text-white' },
  History: { bg: 'bg-amber-500/90', border: 'border-amber-600', text: 'text-white' },
  Geography: { bg: 'bg-teal-500/90', border: 'border-teal-600', text: 'text-white' },
  ICT: { bg: 'bg-indigo-500/90', border: 'border-indigo-600', text: 'text-white' },
  default: { bg: 'bg-primary/90', border: 'border-primary', text: 'text-primary-foreground' },
}

function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.default
}

interface CalEvent extends EventInput {
  extendedProps?: {
    classId: string
    subject: string
    grade: string
    enrolledCount?: number
  }
}

/** Generate calendar events from teacher classes (past month + next 3 months) */
function classesToEvents(classes: Class[]): CalEvent[] {
  const events: CalEvent[] = []
  const today = startOfToday()
  const startDate = subWeeks(today, 4)
  const endDate = addWeeks(today, 12)

  for (const cls of classes) {
    if (cls.status !== 'ACTIVE') continue
    const raw = cls.scheduleRules as ScheduleRules | undefined
    if (!raw) continue

    const rules: { dayOfWeek: number; startTime: string; endTime: string }[] = []
    if (Array.isArray(raw)) {
      rules.push(...raw)
    } else if ('daysOfWeek' in raw && raw.daysOfWeek?.length) {
      const startTime = raw.startTime ?? '09:00'
      const endTime = raw.endTime ?? '10:00'
      for (const d of raw.daysOfWeek) {
        rules.push({ dayOfWeek: d, startTime, endTime })
      }
    }

    const color = getSubjectColor(cls.subject)

    for (const r of rules) {
      const { h: sh, m: sm } = parseTime(r.startTime)
      const { h: eh, m: em } = parseTime(r.endTime)
      let d = new Date(startDate)
      while (d <= endDate) {
        if (getDay(d) === r.dayOfWeek) {
          const start = setMinutes(setHours(new Date(d), sh), sm)
          const end = setMinutes(setHours(new Date(d), eh), em)
          events.push({
            id: `${cls._id}-${d.toISOString().slice(0, 10)}-${r.dayOfWeek}`,
            title: cls.subject,
            start: start.toISOString(),
            end: end.toISOString(),
            url: `/teacher/classes/${cls._id}`,
            backgroundColor: color.bg.replace('bg-', '').includes('/') 
              ? undefined 
              : undefined,
            classNames: [color.bg, color.border, color.text, 'rounded-lg', 'border', 'shadow-sm'],
            extendedProps: { 
              classId: cls._id, 
              subject: cls.subject,
              grade: cls.grade,
              enrolledCount: cls.enrolledCount,
            },
          })
        }
        d = addDays(d, 1)
      }
    }
  }
  return events
}

function getUpcomingEvents(events: CalEvent[], limit = 8): CalEvent[] {
  const now = new Date()
  return events
    .filter((e) => new Date(e.start as string) >= now)
    .sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime())
    .slice(0, limit)
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE, MMM d')
}

function formatEventTime(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
}

export default function TeacherCalendar() {
  const navigate = useNavigate()
  const calendarRef = useRef<FullCalendar>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterSubject, setFilterSubject] = useState<string>('all')

  useEffect(() => {
    get<{ classes: Class[] }>('/teacher/classes')
      .then((res) => setClasses(res?.classes ?? []))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false))
  }, [])

  const allEvents = useMemo(() => classesToEvents(classes), [classes])
  
  const filteredEvents = useMemo(() => {
    if (filterSubject === 'all') return allEvents
    return allEvents.filter((e) => e.extendedProps?.subject === filterSubject)
  }, [allEvents, filterSubject])

  const upcomingEvents = useMemo(() => getUpcomingEvents(allEvents), [allEvents])
  
  const subjects = useMemo(() => {
    const set = new Set(classes.filter((c) => c.status === 'ACTIVE').map((c) => c.subject))
    return Array.from(set).sort()
  }, [classes])

  // Stats
  const todayEvents = useMemo(() => {
    const today = new Date()
    return allEvents.filter((e) => isSameDay(new Date(e.start as string), today))
  }, [allEvents])

  const thisWeekEvents = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 })
    const end = endOfWeek(new Date(), { weekStartsOn: 0 })
    return allEvents.filter((e) => {
      const d = new Date(e.start as string)
      return d >= start && d <= end
    })
  }, [allEvents])

  const activeClasses = classes.filter((c) => c.status === 'ACTIVE')

  // Calendar navigation
  const handlePrev = () => {
    const api = calendarRef.current?.getApi()
    api?.prev()
    setCurrentDate(api?.getDate() ?? new Date())
  }

  const handleNext = () => {
    const api = calendarRef.current?.getApi()
    api?.next()
    setCurrentDate(api?.getDate() ?? new Date())
  }

  const handleToday = () => {
    const api = calendarRef.current?.getApi()
    api?.today()
    setCurrentDate(api?.getDate() ?? new Date())
  }

  const handleViewChange = (view: string) => {
    const api = calendarRef.current?.getApi()
    api?.changeView(view)
    setCurrentView(view)
  }

  const getViewTitle = () => {
    const api = calendarRef.current?.getApi()
    return api?.view.title ?? format(currentDate, 'MMMM yyyy')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">View your classes on the calendar</p>
        </div>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="py-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading calendar…</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">Manage and view your teaching schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/teacher/classes"
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <BookOpen className="h-4 w-4" />
            My Classes
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                <p className="mt-1 text-3xl font-bold">{todayEvents.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="mt-1 text-3xl font-bold">{thisWeekEvents.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <CalendarDays className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="mt-1 text-3xl font-bold">{activeClasses.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 bg-card/95">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="mt-1 text-3xl font-bold">
                  {activeClasses.reduce((sum, c) => sum + (c.enrolledCount ?? 0), 0)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Calendar + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar Card */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={handleToday}>
                  Today
                </Button>
                <h2 className="ml-2 text-lg font-semibold">{getViewTitle()}</h2>
              </div>

              {/* View Toggle + Filter */}
              <div className="flex items-center gap-3">
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="h-9 w-[160px] rounded-lg">
                    <Filter className="mr-2 h-3.5 w-3.5" />
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Tabs value={currentView} onValueChange={handleViewChange} className="hidden sm:block">
                  <TabsList className="h-9 rounded-lg bg-muted/60 p-1">
                    <TabsTrigger value="dayGridMonth" className="h-7 rounded-md px-3 text-xs">
                      <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="timeGridWeek" className="h-7 rounded-md px-3 text-xs">
                      <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                      Week
                    </TabsTrigger>
                    <TabsTrigger value="timeGridDay" className="h-7 rounded-md px-3 text-xs">
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                      Day
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="fc-page-calendar rounded-xl overflow-hidden">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={new Date().toISOString().slice(0, 10)}
                events={filteredEvents}
                headerToolbar={false}
                eventClick={(info) => {
                  info.jsEvent.preventDefault()
                  if (info.event.url) navigate(info.event.url)
                }}
                eventDisplay="block"
                height="auto"
                contentHeight={520}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                nowIndicator={true}
                dayMaxEvents={3}
                moreLinkClick="popover"
                eventTimeFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short',
                }}
                slotLabelFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short',
                }}
                views={{
                  dayGridMonth: {
                    titleFormat: { month: 'long', year: 'numeric' },
                  },
                  timeGridWeek: {
                    titleFormat: { month: 'short', day: 'numeric', year: 'numeric' },
                  },
                  timeGridDay: {
                    titleFormat: { weekday: 'long', month: 'short', day: 'numeric' },
                  },
                }}
                datesSet={(dateInfo) => {
                  setCurrentDate(dateInfo.view.currentStart)
                  setCurrentView(dateInfo.view.type)
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Upcoming Events */}
        <div className="space-y-4">
          {/* Upcoming Events */}
          <Card className="rounded-2xl border-border/70 bg-card/95">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Upcoming Classes
              </CardTitle>
              <CardDescription>Your next scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[380px] pr-3">
                {upcomingEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No upcoming classes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => {
                      const color = getSubjectColor(event.extendedProps?.subject || '')
                      return (
                        <Link
                          key={event.id as string}
                          to={event.url as string}
                          className="group block rounded-xl border border-border/60 bg-muted/20 p-3 transition-all hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${color.bg}`} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-sm group-hover:text-primary">
                                {event.title as string}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Grade {event.extendedProps?.grade}
                              </p>
                              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {formatEventDate(event.start as string)}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(event.start as string), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                            <Eye className="h-4 w-4 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Subject Legend */}
          <Card className="rounded-2xl border-border/70 bg-card/95">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Subject Legend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {subjects.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No active subjects</p>
                ) : (
                  subjects.map((subject) => {
                    const color = getSubjectColor(subject)
                    return (
                      <div
                        key={subject}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5"
                      >
                        <div className={`h-2.5 w-2.5 rounded-full ${color.bg}`} />
                        <span className="text-xs font-medium">{subject}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
