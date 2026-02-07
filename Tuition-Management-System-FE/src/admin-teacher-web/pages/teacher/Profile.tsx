import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Separator } from '@/shared/components/ui/separator'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/useAuth'
import { useToast } from '@/shared/components/ui/use-toast'
import { getInitials } from '@/lib/utils'
import { post, get, put } from '@/shared/services/api'
import {
  Camera,
  Save,
  Upload,
  X,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
} from 'lucide-react'

// Education levels and their subjects
const educationLevels = {
  PRIMARY: ['Mathematics', 'English', 'Environment', 'Sinhala', 'Tamil', 'Religion', 'Art', 'Music', 'Physical Education'],
  OL: ['Mathematics', 'Science', 'History', 'English', 'Sinhala', 'Tamil', 'Buddhism', 'Catholicism', 'Islam', 'Hinduism', 'Geography', 'Commerce', 'ICT', 'Art', 'Music', 'Drama', 'Dancing'],
  AL: ['Combined Maths', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Economics', 'Accounting', 'Business Studies', 'Geography', 'History', 'Political Science', 'Logic', 'Sinhala', 'Tamil', 'English', 'Arabic', 'French', 'German', 'Japanese', 'Chinese'],
}

const experienceLevels = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' },
  { value: 'SENIOR', label: 'Senior Teacher' },
  { value: 'GRADUATE', label: 'Graduate Teacher' },
  { value: 'UNDERGRADUATE', label: 'Undergraduate' },
]

const teachingModes = ['Online', 'Physical class', 'Home visit']
const languages = ['English', 'Sinhala', 'Tamil']
const studentTargetTypes = ['Individual', 'Group', 'Revision', 'Crash course']
const onlinePlatforms = ['Zoom', 'Google Meet', 'MS Teams', 'Skype', 'Other']
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const profileSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  tagline: z.string().max(200, 'Tagline must be less than 200 characters').optional(),
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  
  // Education & Subjects
  educationLevel: z.enum(['PRIMARY', 'OL', 'AL']).optional(),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  grades: z.array(z.string()).min(1, 'Select at least one grade'),
  
  // Teaching Details
  teachingModes: z.array(z.string()).min(1, 'Select at least one teaching mode'),
  experience: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  
  // Location
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  
  // Pricing
  hourlyRate: z.string().optional(),
  monthlyFee: z.string().optional(),
  groupClassPrice: z.string().optional(),
  
  // Languages
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  
  // Student Target
  studentTargetTypes: z.array(z.string()).optional(),
  
  // Online Platforms
  onlinePlatforms: z.array(z.string()).optional(),
  
  // Availability
  availability: z.record(z.object({
    enabled: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })).optional(),

  // Social Links
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function TeacherProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('')
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      subjects: [],
      grades: [],
      teachingModes: [],
      languages: [],
      studentTargetTypes: [],
      onlinePlatforms: [],
      qualifications: [],
    },
  })

  const watchedSubjects = watch('subjects')
  const watchedGrades = watch('grades')
  const watchedTeachingModes = watch('teachingModes')
  const watchedLanguages = watch('languages')

  // Load profile data
  useEffect(() => {
    loadProfile()
  }, [])

  // Update available subjects when education level changes
  useEffect(() => {
    if (selectedEducationLevel && educationLevels[selectedEducationLevel as keyof typeof educationLevels]) {
      setAvailableSubjects(educationLevels[selectedEducationLevel as keyof typeof educationLevels])
      // Clear selected subjects when level changes
      setValue('subjects', [])
    }
  }, [selectedEducationLevel, setValue])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await get<any>('/teacher/profile')
      setProfileData(data)
      
      // Set form values
      if (data) {
        reset({
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : user?.name || '',
          phone: data.contact?.phone || '',
          tagline: data.tagline || '',
          bio: data.bio || '',
          educationLevel: data.educationLevel || undefined,
          subjects: data.subjects || [],
          grades: data.grades || [],
          teachingModes: data.teachingModes || [],
          experience: data.experience || '',
          qualifications: data.qualifications || [],
          city: data.location?.city || '',
          state: data.location?.state || '',
          address: data.location?.address || '',
          hourlyRate: data.pricing?.hourlyRate || '',
          monthlyFee: data.pricing?.monthlyFee || '',
          groupClassPrice: data.pricing?.groupClassPrice || '',
          languages: data.languages || [],
          studentTargetTypes: data.studentTargetTypes || [],
          onlinePlatforms: data.onlinePlatforms || [],
          linkedin: data.socialLinks?.linkedin || '',
          youtube: data.socialLinks?.youtube || '',
        })
        
        if (data.educationLevel) {
          setSelectedEducationLevel(data.educationLevel)
        }
        
        if (data.image) {
          setProfileImage(data.image)
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        })
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubjectToggle = (subject: string) => {
    const current = watchedSubjects || []
    const newSubjects = current.includes(subject)
      ? current.filter(s => s !== subject)
      : [...current, subject]
    setValue('subjects', newSubjects)
  }

  const handleGradeToggle = (grade: string) => {
    const current = watchedGrades || []
    const newGrades = current.includes(grade)
      ? current.filter(g => g !== grade)
      : [...current, grade]
    setValue('grades', newGrades)
  }

  const handleTeachingModeToggle = (mode: string) => {
    const current = watchedTeachingModes || []
    const newModes = current.includes(mode)
      ? current.filter(m => m !== mode)
      : [...current, mode]
    setValue('teachingModes', newModes)
  }

  const handleLanguageToggle = (language: string) => {
    const current = watchedLanguages || []
    const newLanguages = current.includes(language)
      ? current.filter(l => l !== language)
      : [...current, language]
    setValue('languages', newLanguages)
  }

  const handleArrayToggle = (field: 'studentTargetTypes' | 'onlinePlatforms' | 'qualifications', value: string) => {
    const current = watch(field) || []
    const newArray = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    setValue(field, newArray)
  }

  const addQualification = () => {
    const current = watch('qualifications') || []
    setValue('qualifications', [...current, ''])
  }

  const removeQualification = (index: number) => {
    const current = watch('qualifications') || []
    setValue('qualifications', current.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      
      // Upload image if changed
      let imageUrl = profileImage
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadResult = await post<{ url: string; message?: string }>('/upload/image', formData)
        imageUrl = uploadResult.url
      }

      const updateData = {
        tagline: data.tagline,
        bio: data.bio,
        educationLevel: selectedEducationLevel,
        subjects: data.subjects,
        grades: data.grades,
        teachingModes: data.teachingModes,
        experience: data.experience,
        qualifications: data.qualifications?.filter(q => q.trim() !== ''),
        location: {
          city: data.city,
          state: data.state,
          address: data.address,
        },
        pricing: {
          hourlyRate: data.hourlyRate,
          monthlyFee: data.monthlyFee,
          groupClassPrice: data.groupClassPrice,
        },
        languages: data.languages,
        studentTargetTypes: data.studentTargetTypes,
        onlinePlatforms: data.onlinePlatforms,
        image: imageUrl,
        contact: {
          phone: data.phone,
        },
        socialLinks: {
          linkedin: data.linkedin || undefined,
          youtube: data.youtube || undefined,
        },
      }

      await put('/teacher/profile', updateData)
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        variant: 'default',
      })
      
      setIsEditing(false)
      await loadProfile()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const profile = {
    name: profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : profileData?.firstName || profileData?.lastName || user?.name || 'Teacher',
    email: user?.email || 'email@example.com',
    phone: profileData?.contact?.phone || '',
    location: profileData?.location?.city && profileData?.location?.state
      ? `${profileData.location.city}, ${profileData.location.state}`
      : profileData?.location?.city || profileData?.location?.state || 'Not set',
    bio: profileData?.bio || '',
    subjects: profileData?.subjects || [],
    qualifications: profileData?.qualifications || [],
    experience: profileData?.experience || '',
    socialLinks: {
      linkedin: profileData?.socialLinks?.linkedin || '',
      youtube: profileData?.socialLinks?.youtube || '',
    },
    stats: {
      totalStudents: profileData?.stats?.totalStudents || 0,
      totalClasses: profileData?.stats?.totalClasses || 0,
      avgRating: profileData?.stats?.avgRating || 0,
      totalReviews: 0,
    },
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your public profile and settings</p>
        </div>
        <div className="flex gap-2">
          {profileData?.slug && (
            <Button variant="outline" asChild>
              <Link to={`/t/${profileData.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                View Public Profile
              </Link>
            </Button>
          )}
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {!isEditing ? (
            // View Mode
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile card */}
              <Card className="lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileImage || profileData?.image} />
                        <AvatarFallback className="text-2xl">
                          {getInitials(profile.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                    {profileData?.status === 'APPROVED' && (
                      <Badge className="mt-2" variant="default">Verified Teacher</Badge>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <p className="text-2xl font-bold">{profile.stats.totalStudents}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <p className="text-2xl font-bold">{profile.stats.totalClasses}</p>
                        <p className="text-xs text-muted-foreground">Classes</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <p className="text-2xl font-bold">{profile.stats.avgRating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted">
                        <p className="text-2xl font-bold">{profile.stats.totalReviews}</p>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    This information will be displayed on your public profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p>{profile.name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p>{profile.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p>{profile.location}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <p className="text-sm">{profile.bio}</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Professional Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Subjects</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.subjects.map((subject: string) => (
                            <Badge key={subject} variant="secondary">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Qualifications</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.qualifications.map((qual: string) => (
                            <Badge key={qual} variant="outline">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Teaching Experience</Label>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <p>{profile.experience}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Social Links</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        {profile.socialLinks.linkedin ? (
                          <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            {profile.socialLinks.linkedin}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>YouTube</Label>
                        {profile.socialLinks.youtube ? (
                          <a
                            href={profile.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <LinkIcon className="h-4 w-4" />
                            {profile.socialLinks.youtube}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Edit Mode - Comprehensive Form
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="education">Education & Subjects</TabsTrigger>
                  <TabsTrigger value="teaching">Teaching Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & Availability</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Photo</CardTitle>
                      <CardDescription>Upload your profile photo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profileImage || undefined} />
                          <AvatarFallback className="text-2xl">
                            {user ? getInitials(user.name) : 'T'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button type="button" variant="outline" asChild>
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                              </span>
                            </Button>
                          </Label>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          {profileImage && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setProfileImage(null)
                                setImageFile(null)
                              }}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Tell students about yourself</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...register('name')}
                            error={errors.name?.message}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+94 77 123 4567"
                            {...register('phone')}
                            error={errors.phone?.message}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tagline">Short Headline / Tagline *</Label>
                        <Input
                          id="tagline"
                          placeholder="e.g., A/L Physics Specialist with 10 years experience"
                          {...register('tagline')}
                          error={errors.tagline?.message}
                        />
                        <p className="text-xs text-muted-foreground">
                          This will appear in search results and your profile card
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio / Teaching Style *</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about your teaching experience, style, and what makes you unique..."
                          {...register('bio')}
                          error={errors.bio?.message}
                          rows={6}
                        />
                        <p className="text-xs text-muted-foreground">
                          Describe your teaching approach, experience, and what students can expect
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education & Subjects Tab */}
                <TabsContent value="education" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Education Level & Subjects</CardTitle>
                      <CardDescription>Select your education level and subjects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Education Level *</Label>
                        <Select
                          value={selectedEducationLevel}
                          onValueChange={(value) => {
                            setSelectedEducationLevel(value)
                            setValue('educationLevel', value as 'PRIMARY' | 'OL' | 'AL')
                            setValue('subjects', [])
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRIMARY">Primary</SelectItem>
                            <SelectItem value="OL">O/L (Ordinary Level)</SelectItem>
                            <SelectItem value="AL">A/L (Advanced Level)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Select your education level first, then choose relevant subjects
                        </p>
                      </div>

                      {selectedEducationLevel && (
                        <div className="space-y-2">
                          <Label>Subjects *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md max-h-60 overflow-y-auto">
                            {availableSubjects.map((subject) => (
                              <div key={subject} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`subject-${subject}`}
                                  checked={watchedSubjects?.includes(subject) || false}
                                  onCheckedChange={() => handleSubjectToggle(subject)}
                                />
                                <Label
                                  htmlFor={`subject-${subject}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {subject}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {errors.subjects && (
                            <p className="text-sm text-destructive">{errors.subjects.message}</p>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Grades *</Label>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 p-3 border rounded-md max-h-60 overflow-y-auto">
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((grade) => (
                            <div key={grade} className="flex items-center space-x-2">
                              <Checkbox
                                id={`grade-${grade}`}
                                checked={watchedGrades?.includes(grade) || false}
                                onCheckedChange={() => handleGradeToggle(grade)}
                              />
                              <Label
                                htmlFor={`grade-${grade}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                Grade {grade}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.grades && (
                          <p className="text-sm text-destructive">{errors.grades.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Teaching Details Tab */}
                <TabsContent value="teaching" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Teaching Details</CardTitle>
                      <CardDescription>How do you teach and what are your qualifications?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Teaching Mode *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {teachingModes.map((mode) => (
                            <div key={mode} className="flex items-center space-x-2 p-3 border rounded-md">
                              <Checkbox
                                id={`mode-${mode}`}
                                checked={watchedTeachingModes?.includes(mode) || false}
                                onCheckedChange={() => handleTeachingModeToggle(mode)}
                              />
                              <Label htmlFor={`mode-${mode}`} className="cursor-pointer flex-1">
                                {mode}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.teachingModes && (
                          <p className="text-sm text-destructive">{errors.teachingModes.message}</p>
                        )}
                      </div>

                      {watchedTeachingModes?.includes('Physical class') && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="city">City / District</Label>
                            <Input id="city" {...register('city')} placeholder="e.g., Colombo" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" {...register('state')} placeholder="e.g., Western Province" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address (Optional)</Label>
                            <Input id="address" {...register('address')} placeholder="Full address" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select onValueChange={(value) => setValue('experience', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Qualifications</Label>
                        <div className="space-y-2">
                          {watch('qualifications')?.map((qual, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="e.g., BSc Mathematics – University of Ruhuna"
                                {...register(`qualifications.${index}`)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQualification(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" onClick={addQualification}>
                            + Add Qualification
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Languages *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {languages.map((language) => (
                            <div key={language} className="flex items-center space-x-2 p-3 border rounded-md">
                              <Checkbox
                                id={`lang-${language}`}
                                checked={watchedLanguages?.includes(language) || false}
                                onCheckedChange={() => handleLanguageToggle(language)}
                              />
                              <Label htmlFor={`lang-${language}`} className="cursor-pointer flex-1">
                                {language}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.languages && (
                          <p className="text-sm text-destructive">{errors.languages.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Student Target Type</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {studentTargetTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`target-${type}`}
                                checked={watch('studentTargetTypes')?.includes(type) || false}
                                onCheckedChange={() => handleArrayToggle('studentTargetTypes', type)}
                              />
                              <Label htmlFor={`target-${type}`} className="text-sm cursor-pointer">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {watchedTeachingModes?.includes('Online') && (
                        <div className="space-y-2">
                          <Label>Online Platforms</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {onlinePlatforms.map((platform) => (
                              <div key={platform} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`platform-${platform}`}
                                  checked={watch('onlinePlatforms')?.includes(platform) || false}
                                  onCheckedChange={() => handleArrayToggle('onlinePlatforms', platform)}
                                />
                                <Label htmlFor={`platform-${platform}`} className="text-sm cursor-pointer">
                                  {platform}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-medium">Social Links</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              placeholder="https://linkedin.com/in/yourprofile"
                              {...register('linkedin')}
                              error={errors.linkedin?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube</Label>
                            <Input
                              id="youtube"
                              placeholder="https://youtube.com/@yourchannel"
                              {...register('youtube')}
                              error={errors.youtube?.message}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pricing & Availability Tab */}
                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing</CardTitle>
                      <CardDescription>Set your teaching fees</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate">Hourly Rate (LKR)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            placeholder="2000"
                            {...register('hourlyRate')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyFee">Monthly Fee (LKR)</Label>
                          <Input
                            id="monthlyFee"
                            type="number"
                            placeholder="15000"
                            {...register('monthlyFee')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="groupClassPrice">Group Class Price (LKR)</Label>
                          <Input
                            id="groupClassPrice"
                            type="number"
                            placeholder="10000"
                            {...register('groupClassPrice')}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Availability</CardTitle>
                      <CardDescription>When are you available for classes?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center gap-4 p-3 border rounded-md">
                          <div className="flex items-center space-x-2 w-32">
                            <Checkbox
                              id={`day-${day}`}
                              checked={watch(`availability.${day}.enabled`) || false}
                              onCheckedChange={(checked) => {
                                setValue(`availability.${day}.enabled`, checked as boolean)
                              }}
                            />
                            <Label htmlFor={`day-${day}`} className="cursor-pointer">
                              {day}
                            </Label>
                          </div>
                          {watch(`availability.${day}.enabled`) && (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                type="time"
                                placeholder="Start time"
                                {...register(`availability.${day}.startTime`)}
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                placeholder="End time"
                                {...register(`availability.${day}.endTime`)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => {
                  setIsEditing(false)
                  loadProfile()
                }}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={profile.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div></div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button>Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
