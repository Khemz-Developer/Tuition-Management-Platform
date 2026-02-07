import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Separator } from '@/shared/components/ui/separator'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Globe,
  GraduationCap,
  Languages,
  MapPin,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { get } from '@/shared/services/api'
import ContactSection from '@/student-web/components/public-website/ContactSection'
import FAQSection from '@/student-web/components/public-website/FAQSection'
import AIChatWidget from '@/student-web/components/public-website/AIChatWidget'

interface TeacherProfile {
  firstName: string
  lastName: string
  slug: string
  tagline?: string
  bio?: string
  image?: string
  coverImage?: string
  subjects?: string[]
  grades?: string[]
  experience?: number
  experienceLevel?: string
  qualifications?: string[]
  educationLevel?: string
  teachingModes?: string[]
  languages?: string[]
  studentTargetTypes?: string[]
  onlinePlatforms?: string[]
  pricing?: {
    hourlyRate?: string
    monthlyFee?: string
    groupClassPrice?: string
  }
  location?: {
    city?: string
    state?: string
    country?: string
    address?: string
  }
  contact?: {
    email?: string
    phone?: string
    whatsapp?: string
    website?: string
  }
  availability?: Record<
    string,
    {
      enabled?: boolean
      startTime?: string
      endTime?: string
    }
  >
  stats?: {
    totalClasses?: number
    totalStudents?: number
    averageAttendance?: number
  }
  visibility?: {
    showEmail?: boolean
    showPhone?: boolean
    showWhatsAppButton?: boolean
    showLocation?: boolean
    showClassFees?: boolean
    showSchedulePreview?: boolean
    allowPublicAIChat?: boolean
  }
  customization?: {
    themeColor?: string
    accentColor?: string
    highlights?: string[]
    faqs?: Array<{ question: string; answer: string }>
  }
}

interface PublicClass {
  _id: string
  title: string
  subject: string
  grade: string
  description?: string
  fee?: number
  capacity: number
  currentEnrollment: number
  scheduleRules: {
    daysOfWeek: number[]
    startTime: string
    endTime: string
    timezone: string
  }
  tags?: string[]
}

interface PublicTeacherResponse extends TeacherProfile {
  publicClasses: PublicClass[]
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function StudentPublicTeacherProfile() {
  const { teacherSlug } = useParams()
  const [teacher, setTeacher] = useState<PublicTeacherResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!teacherSlug) {
      setError('Teacher slug is missing.')
      setIsLoading(false)
      return
    }

    const loadTeacher = async () => {
      try {
        setIsLoading(true)
        const data = await get<PublicTeacherResponse>(`/public/teachers/${teacherSlug}`)
        setTeacher(data)
        setError(null)
      } catch (err: any) {
        setError(err?.message || 'Unable to load teacher profile.')
        setTeacher(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeacher()
  }, [teacherSlug])

  const availabilityEntries = useMemo(() => {
    if (!teacher?.availability) return []
    const entries = Object.entries(teacher.availability)
      .filter(([, value]) => value?.enabled)
      .map(([day, value]) => ({
        day,
        startTime: value?.startTime,
        endTime: value?.endTime,
      }))
    return entries
  }, [teacher?.availability])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="w-fit" asChild>
          <Link to="/student/teachers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teachers
          </Link>
        </Button>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-lg font-semibold">Unable to load this teacher profile</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fullName = `${teacher.firstName} ${teacher.lastName}`.trim()
  const themeColor = teacher.customization?.themeColor || '#3b82f6'
  const accentColor = teacher.customization?.accentColor || '#8b5cf6'
  const showEmail = teacher.visibility?.showEmail === true
  const showPhone = teacher.visibility?.showPhone === true
  const showWhatsApp = teacher.visibility?.showWhatsAppButton !== false && !!teacher.contact?.whatsapp
  const showLocation = teacher.visibility?.showLocation !== false
  const showClassFees = teacher.visibility?.showClassFees !== false
  const showSchedulePreview = teacher.visibility?.showSchedulePreview !== false
  const allowPublicAIChat = teacher.visibility?.allowPublicAIChat !== false

  const locationLine = [
    teacher.location?.address,
    teacher.location?.city,
    teacher.location?.state,
    teacher.location?.country,
  ]
    .filter(Boolean)
    .join(', ')

  const whatsappNumber = teacher.contact?.whatsapp
    ? teacher.contact.whatsapp.replace(/[^0-9]/g, '')
    : ''

  const heroStyle: CSSProperties = teacher.coverImage
    ? {
        backgroundImage: `linear-gradient(120deg, ${themeColor}b3, ${accentColor}b3), url(${teacher.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundImage: `linear-gradient(120deg, ${themeColor}1a, ${accentColor}1a)`,
      }

  return (
    <div className="space-y-10">
      <Button variant="ghost" className="w-fit" asChild>
        <Link to="/student/teachers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teachers
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-3xl border" style={heroStyle}>
        <div className="absolute inset-0" />
        <div className="relative z-10 px-6 py-12 md:px-12 md:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-6">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarImage src={teacher.image || ''} alt={fullName} />
                <AvatarFallback className="text-3xl">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Teacher Profile</p>
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl text-foreground">
                  {fullName}
                </h1>
                <p className="mt-2 text-base text-muted-foreground md:text-lg">
                  {teacher.tagline || 'Personalized coaching and real results.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(teacher.subjects || []).map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                  {(teacher.grades || []).map((grade) => (
                    <Badge key={grade} variant="outline">
                      Grade {grade}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 lg:items-end">
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to={`/register/${teacher.slug}`}>Join this teacher</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#contact">Contact teacher</a>
                </Button>
                {showWhatsApp && whatsappNumber && (
                  <Button variant="secondary" asChild>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>
              {showLocation && locationLine && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {locationLine}
                </div>
              )}
              {teacher.contact?.website && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a href={teacher.contact.website} target="_blank" rel="noreferrer" className="underline">
                    {teacher.contact.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-3xl font-bold mt-2">{teacher.stats?.totalStudents || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active Classes</p>
            <p className="text-3xl font-bold mt-2">{teacher.stats?.totalClasses || teacher.publicClasses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Average Attendance</p>
            <p className="text-3xl font-bold mt-2">{teacher.stats?.averageAttendance || 0}%</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>About {teacher.firstName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {teacher.bio || 'This teacher is crafting their bio. Check back soon for a detailed introduction.'}
            </p>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Education Level</p>
                <p className="font-medium">{teacher.educationLevel || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{teacher.experienceLevel || (teacher.experience ? `${teacher.experience} years` : 'Not specified')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teaching Modes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(teacher.teachingModes || []).map((mode) => (
                    <Badge key={mode} variant="secondary">
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student Types</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(teacher.studentTargetTypes || []).map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {(teacher.qualifications || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No qualifications shared yet.</p>
              ) : (
                teacher.qualifications?.map((qual) => (
                  <div key={qual} className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{qual}</span>
                  </div>
                ))
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Languages</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(teacher.languages || []).map((language) => (
                  <Badge key={language} variant="secondary">
                    <Languages className="mr-1 h-3 w-3" />
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {(teacher.customization?.highlights || []).length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {teacher.customization?.highlights?.map((highlight) => (
                <div key={highlight} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                  <p>{highlight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Public Classes</h2>
          <Badge variant="outline">{teacher.publicClasses.length} classes</Badge>
        </div>
        {teacher.publicClasses.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No public classes are listed yet. Check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teacher.publicClasses.map((cls) => {
              const dayLabels = cls.scheduleRules.daysOfWeek.map((day) => dayNames[day]).join(', ')
              return (
                <Card key={cls._id} className="h-full">
                  <CardHeader>
                    <CardTitle>{cls.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{cls.subject} · Grade {cls.grade}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cls.description && <p className="text-sm text-muted-foreground">{cls.description}</p>}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {dayLabels} · {cls.scheduleRules.startTime} - {cls.scheduleRules.endTime}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{cls.currentEnrollment}/{cls.capacity} students</span>
                      {showClassFees && cls.fee !== undefined && (
                        <span className="font-semibold text-foreground">Rs {cls.fee}</span>
                      )}
                    </div>
                    {cls.tags && cls.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cls.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" asChild className="w-full">
                      <Link to={`/register/${teacher.slug}`}>Request to Join</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {showSchedulePreview && availabilityEntries.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {availabilityEntries.map((entry) => (
                <div key={entry.day} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium capitalize">{entry.day}</span>
                  <span className="text-sm text-muted-foreground">
                    {entry.startTime || 'Start'} - {entry.endTime || 'End'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {(teacher.pricing?.hourlyRate || teacher.pricing?.monthlyFee || teacher.pricing?.groupClassPrice) && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {teacher.pricing?.hourlyRate && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-xl font-semibold">{teacher.pricing.hourlyRate}</p>
                </div>
              )}
              {teacher.pricing?.monthlyFee && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  <p className="text-xl font-semibold">{teacher.pricing.monthlyFee}</p>
                </div>
              )}
              {teacher.pricing?.groupClassPrice && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Group Class Price</p>
                  <p className="text-xl font-semibold">{teacher.pricing.groupClassPrice}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {teacher.onlinePlatforms && teacher.onlinePlatforms.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Online Platforms</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {teacher.onlinePlatforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {platform}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <section id="contact">
        <ContactSection
          teacherSlug={teacher.slug}
          contactInfo={{
            phone: showPhone ? teacher.contact?.phone : undefined,
            email: showEmail ? teacher.contact?.email : undefined,
            address: showLocation ? locationLine : undefined,
            hours: teacher.availability ? 'See weekly availability above' : undefined,
          }}
        />
      </section>

      {teacher.customization?.faqs && teacher.customization.faqs.length > 0 && (
        <FAQSection faqs={teacher.customization.faqs} />
      )}

      {allowPublicAIChat && <AIChatWidget />}
    </div>
  )
}
