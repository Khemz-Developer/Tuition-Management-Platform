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
import { SearchableSelect } from '@/shared/components/ui/searchable-select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/useAuth'
import { useToast } from '@/shared/components/ui/use-toast'
import { getInitials } from '@/lib/utils'
import api, { get, put } from '@/shared/services/api'
import { LocationsService } from '@/shared/services/locations.service'
import { ImageCropper } from '@/shared/components/ImageCropper'
import {
  Save,
  Upload,
  X,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Plus,
  Users,
} from 'lucide-react'
import { CITIES as FALLBACK_CITIES, PROVINCES as FALLBACK_PROVINCES, DISTRICTS as FALLBACK_DISTRICTS } from './locationOptions'

// Education level configuration
interface EducationLevelConfig {
  subjects: string[]
  grades: string[]
}

const educationLevels: Record<string, EducationLevelConfig> = {
  PRIMARY: {
    subjects: ['Mathematics', 'English', 'Environment', 'Sinhala', 'Tamil', 'Religion', 'Art', 'Music', 'Physical Education'],
    grades: ['1', '2', '3', '4', '5']
  },
  OL: {
    subjects: ['Mathematics', 'Science', 'History', 'English', 'Sinhala', 'Tamil', 'Buddhism', 'Catholicism', 'Islam', 'Hinduism', 'Geography', 'Commerce', 'ICT', 'Art', 'Music', 'Drama', 'Dancing'],
    grades: ['6', '7', '8', '9', '10', '11']
  },
  AL: {
    subjects: ['Combined Maths', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Economics', 'Accounting', 'Business Studies', 'Geography', 'History', 'Political Science', 'Logic', 'Sinhala', 'Tamil', 'English', 'Arabic', 'French', 'German', 'Japanese', 'Chinese'],
    grades: ['12', '13']
  },
}

const educationLevelLabels: Record<string, string> = {
  PRIMARY: 'Primary',
  OL: 'O/L',
  AL: 'A/L',
}

function getEducationLevelForGrade(grade: string): string {
  const n = Number(grade)
  if (n >= 1 && n <= 5) return educationLevelLabels.PRIMARY
  if (n >= 6 && n <= 11) return educationLevelLabels.OL
  if (n >= 12 && n <= 13) return educationLevelLabels.AL
  return ''
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
const studentTargetTypes = ['Individual', 'Group', 'Revision', 'Crash course', 'Common']
const onlinePlatforms = ['Zoom', 'Google Meet', 'MS Teams', 'Skype', 'Other']
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const profileSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  tagline: z.string().max(200, 'Tagline must be less than 200 characters').optional(),
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  
  // Education & Subjects
  educationLevels: z.array(z.object({
    level: z.enum(['PRIMARY', 'OL', 'AL']),
    subjects: z.array(z.string()).min(1, 'Select at least one subject for each education level'),
    grades: z.array(z.string()).min(1, 'Select at least one grade for each education level'),
  })).min(1, 'Select at least one education level'),
  
  // Teaching Details
  teachingModes: z.array(z.string()).min(1, 'Select at least one teaching mode'),
  experience: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  
  // Location (legacy single – kept for backward compat)
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  instituteName: z.string().optional(),
  // Teaching locations (multiple institutions)
  teachingLocations: z.array(z.object({
    instituteName: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
  })).optional(),
  
  // Pricing
  hourlyRate: z.string().optional(),
  monthlyFee: z.string().optional(),
  groupClassPrice: z.string().optional(),
  usePriceByGrade: z.boolean().optional(),
  priceByGrade: z.array(z.object({
    grade: z.string(),
    subject: z.string().optional(),
    hourlyRate: z.string().optional(),
    monthlyFee: z.string().optional(),
    groupClassPrice: z.string().optional(),
  })).optional(),

  // Languages
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  
  // Student Target
  studentTargetTypes: z.array(z.string()).optional(),
  
  // Online Platforms
  onlinePlatforms: z.array(z.string()).optional(),
  
  // Availability (per day: enabled + slots with time and grades)
  availability: z.record(z.object({
    enabled: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    slots: z.array(z.object({
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      grades: z.array(z.string()).default([]),
      subjects: z.array(z.string()).default([]),
    })).optional(),
  })).optional(),

  // Social Links
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  whatsapp: z.string().optional().refine((val) => {
    if (!val) return true
    // Validate WhatsApp number (should start with + and contain 8-15 digits)
    const whatsappRegex = /^\+[1-9]\d{7,14}$/
    return whatsappRegex.test(val)
  }, { message: 'Invalid WhatsApp number. Use format: +1234567890' }),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function TeacherProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [locationOptions, setLocationOptions] = useState<{
    cities: string[]
    districts: string[]
    provinces: string[]
  }>({ cities: [], districts: [], provinces: [] })
  const [locationOptionsByIndex, setLocationOptionsByIndex] = useState<Record<number, { districts: string[]; cities: string[] }>>({})

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      educationLevels: [],
      teachingModes: [],
      languages: [],
      studentTargetTypes: [],
      onlinePlatforms: [],
      qualifications: [],
      teachingLocations: [],
    },
  })

  const watchedEducationLevels = watch('educationLevels')
  const watchedTeachingModes = watch('teachingModes')
  const watchedLanguages = watch('languages')

  // Only the grades the user selected under Education & Subjects (for availability slots and price-by-grade)
  const selectedGradesFromLevels = (watchedEducationLevels || [])
    .flatMap((el) => el.grades ?? [])
    .filter(Boolean)
  const uniqueGrades = Array.from(new Set<string>(selectedGradesFromLevels)).sort(
    (a, b) => Number(a) - Number(b)
  )

  // All subjects from selected education levels (for availability slots and price-by-grade)
  const allSubjectsFromLevels = (watchedEducationLevels || [])
    .flatMap((el) => el.subjects ?? [])
    .filter(Boolean)
  const uniqueSubjects = Array.from(new Set<string>(allSubjectsFromLevels)).sort()

  // When "use price by grade" is on and education levels gain new grades, add those grades to priceByGrade
  useEffect(() => {
    if (!getValues('usePriceByGrade') || uniqueGrades.length === 0) return
    const current = getValues('priceByGrade') || []
    const currentGrades = new Set(current.map((r) => r.grade))
    const missing = uniqueGrades.filter((g) => !currentGrades.has(g))
    if (missing.length > 0) {
      setValue('priceByGrade', [
        ...current,
        ...missing.map((grade) => ({ grade, subject: '', hourlyRate: '', monthlyFee: '', groupClassPrice: '' })),
      ])
    }
  }, [uniqueGrades.join(',')])

  // Load profile data and provinces from Sri Lanka locations API (RapidAPI)
  useEffect(() => {
    loadProfile()
    loadProvinces()
  }, [])

  const loadProvinces = async () => {
    try {
      const list = await LocationsService.getProvinces()
      setLocationOptions((prev) => ({
        ...prev,
        provinces: list.length > 0 ? list : FALLBACK_PROVINCES,
      }))
    } catch {
      setLocationOptions((prev) => ({ ...prev, provinces: FALLBACK_PROVINCES }))
    }
  }

  const selectedProvince = watch('state')
  const selectedDistrict = watch('district')

  // Load districts when province is selected (cascade from locations API)
  useEffect(() => {
    if (!selectedProvince?.trim()) {
      setLocationOptions((prev) => ({ ...prev, districts: [], cities: [] }))
      return
    }
    LocationsService.getDistricts(selectedProvince)
      .then((list) => {
        setLocationOptions((prev) => ({
          ...prev,
          districts: list.length > 0 ? list : FALLBACK_DISTRICTS,
          cities: [],
        }))
      })
      .catch(() => {
        setLocationOptions((prev) => ({ ...prev, districts: FALLBACK_DISTRICTS, cities: [] }))
      })
  }, [selectedProvince])

  // Load cities when district is selected (cascade from locations API)
  useEffect(() => {
    if (!selectedDistrict?.trim()) {
      setLocationOptions((prev) => ({ ...prev, cities: [] }))
      return
    }
    LocationsService.getCities(selectedDistrict)
      .then((list) => {
        setLocationOptions((prev) => ({
          ...prev,
          cities: list.length > 0 ? list : FALLBACK_CITIES,
        }))
      })
      .catch(() => {
        setLocationOptions((prev) => ({ ...prev, cities: FALLBACK_CITIES }))
      })
  }, [selectedDistrict])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await get<any>('/teacher/profile')
      setProfileData(data)
      
      // Set form values
      if (data) {
        // Convert availability Map to object; normalize to slots format
        let availabilityData: any = {}
        const raw: Record<string, any> =
          data.availability && typeof data.availability === 'object' && !(data.availability instanceof Map)
            ? data.availability
            : data.availability instanceof Map
              ? Object.fromEntries(data.availability)
              : {}
        daysOfWeek.forEach((day) => {
          const dayData = raw[day]
          if (!dayData) {
            availabilityData[day] = { enabled: false, slots: [] }
            return
          }
          const enabled = !!dayData.enabled
          let slots = dayData.slots && Array.isArray(dayData.slots) ? [...dayData.slots] : []
          if (slots.length === 0 && enabled && (dayData.startTime || dayData.endTime)) {
            slots = [{
              startTime: dayData.startTime || '',
              endTime: dayData.endTime || '',
              grades: dayData.grades || [],
              subjects: dayData.subjects || [],
            }]
          }
          if (slots.length > 0) {
            slots = slots.map((s: { startTime?: string; endTime?: string; grades?: string[]; subjects?: string[] }) => ({
              ...s,
              subjects: s.subjects && Array.isArray(s.subjects) ? s.subjects : [],
            }))
          }
          availabilityData[day] = { ...dayData, enabled, slots }
        })

        // Convert old education level format to new format if needed
        let educationLevelsData = data.educationLevels || []
        if (data.educationLevel && data.subjects && data.grades) {
          // Convert old single education level format to new array format
          educationLevelsData = [{
            level: data.educationLevel,
            subjects: data.subjects,
            grades: data.grades
          }]
        }

        const loadUniqueGrades = educationLevelsData.flatMap((el: { level: string }) => educationLevels[el.level]?.grades ?? [])
        const sortedGrades = Array.from(new Set<string>(loadUniqueGrades)).sort((a, b) => Number(a) - Number(b))
        const priceByGradeMerged = sortedGrades.map((grade) => {
          const existing = data.pricing?.priceByGrade?.find((r: { grade: string; subject?: string }) => r.grade === grade)
          return existing
            ? { grade, subject: existing.subject ?? '', hourlyRate: existing.hourlyRate ?? '', monthlyFee: existing.monthlyFee ?? '', groupClassPrice: existing.groupClassPrice ?? '' }
            : { grade, subject: '', hourlyRate: '', monthlyFee: '', groupClassPrice: '' }
        })

        reset({
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : user?.name || '',
          phone: data.contact?.phone || '',
          tagline: data.tagline || '',
          bio: data.bio || '',
          educationLevels: educationLevelsData,
          teachingModes: data.teachingModes || [],
          experience: data.experienceLevel || data.experience || '',
          qualifications: data.qualifications || [],
          city: data.location?.city || '',
          district: data.location?.district || '',
          state: data.location?.state || '',
          address: data.location?.address || '',
          instituteName: data.location?.instituteName || '',
          teachingLocations: Array.isArray(data.teachingLocations) && data.teachingLocations.length > 0
            ? data.teachingLocations.map((loc: { instituteName?: string; city?: string; district?: string; state?: string; address?: string }) => ({
                instituteName: loc.instituteName || '',
                city: loc.city || '',
                district: loc.district || '',
                state: loc.state || '',
                address: loc.address || '',
              }))
            : [],
          hourlyRate: data.pricing?.hourlyRate || '',
          monthlyFee: data.pricing?.monthlyFee || '',
          groupClassPrice: data.pricing?.groupClassPrice || '',
          usePriceByGrade: !!(data.pricing?.priceByGrade && data.pricing.priceByGrade.length > 0),
          priceByGrade: priceByGradeMerged.length > 0 ? priceByGradeMerged : (data.pricing?.priceByGrade || []),
          languages: data.languages || [],
          studentTargetTypes: data.studentTargetTypes || [],
          onlinePlatforms: data.onlinePlatforms || [],
          linkedin: data.socialLinks?.linkedin || '',
          youtube: data.socialLinks?.youtube || '',
          facebook: data.socialLinks?.facebook || '',
          twitter: data.socialLinks?.twitter || '',
          instagram: data.socialLinks?.instagram || '',
          whatsapp: data.socialLinks?.whatsapp || '',
          availability: availabilityData,
        })

        // Hydrate district/city options for loaded teaching locations
        if (Array.isArray(data.teachingLocations) && data.teachingLocations.length > 0) {
          const next: Record<number, { districts: string[]; cities: string[] }> = {}
          await Promise.all(
            data.teachingLocations.map(async (loc: { state?: string; district?: string }, i: number) => {
              if (!loc?.state) return
              try {
                const districts = await LocationsService.getDistricts(loc.state)
                next[i] = { districts: districts?.length ? districts : FALLBACK_DISTRICTS, cities: [] }
                if (loc.district) {
                  const cities = await LocationsService.getCities(loc.district)
                  next[i].cities = cities?.length ? cities : FALLBACK_CITIES
                }
              } catch {
                next[i] = { districts: FALLBACK_DISTRICTS, cities: loc.district ? FALLBACK_CITIES : [] }
              }
            })
          )
          setLocationOptionsByIndex(next)
        }

        if (data.image && typeof data.image === 'string') {
          // Add cache-busting parameter to force refresh
          const imageUrl = data.image.includes('?') 
            ? `${data.image}&t=${Date.now()}` 
            : `${data.image}?t=${Date.now()}`
          setProfileImage(imageUrl)
        } else {
          setProfileImage(null)
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
    if (!file) return
    processImageFile(file)
    // Reset file input
    e.target.value = ''
  }

  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result as string)
    }
    reader.readAsDataURL(croppedFile)
    setShowCropper(false)
    setImageToCrop(null)
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setProfileImage(profileData?.image || null)
    setUploadProgress(0)
    setShowCropper(false)
    setImageToCrop(null)
  }

  const processImageFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, WebP, or GIF)',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      })
      return
    }

    // Create preview and show cropper
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageToCrop(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
    setUploadProgress(0)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  // Handler functions for education levels
  const handleEducationLevelToggle = (level: 'PRIMARY' | 'OL' | 'AL') => {
    const current = watchedEducationLevels || []
    const existingIndex = current.findIndex(el => el.level === level)
    
    if (existingIndex >= 0) {
      // Remove education level
      const newLevels = current.filter(el => el.level !== level)
      setValue('educationLevels', newLevels)
    } else {
      // Add education level with empty subjects and grades
      const newLevels = [...current, {
        level,
        subjects: [],
        grades: []
      }]
      setValue('educationLevels', newLevels)
    }
  }

  const handleSubjectToggle = (educationLevel: 'PRIMARY' | 'OL' | 'AL', subject: string) => {
    const current = watchedEducationLevels || []
    const levelIndex = current.findIndex(el => el.level === educationLevel)
    
    if (levelIndex >= 0) {
      const updatedLevels = [...current]
      const currentSubjects = updatedLevels[levelIndex].subjects || []
      
      if (currentSubjects.includes(subject)) {
        updatedLevels[levelIndex].subjects = currentSubjects.filter(s => s !== subject)
      } else {
        updatedLevels[levelIndex].subjects = [...currentSubjects, subject]
      }
      
      setValue('educationLevels', updatedLevels)
    }
  }

  const handleGradeToggle = (educationLevel: 'PRIMARY' | 'OL' | 'AL', grade: string) => {
    const current = watchedEducationLevels || []
    const levelIndex = current.findIndex(el => el.level === educationLevel)
    
    if (levelIndex >= 0) {
      const updatedLevels = [...current]
      const currentGrades = updatedLevels[levelIndex].grades || []
      
      if (currentGrades.includes(grade)) {
        updatedLevels[levelIndex].grades = currentGrades.filter(g => g !== grade)
      } else {
        updatedLevels[levelIndex].grades = [...currentGrades, grade]
      }
      
      setValue('educationLevels', updatedLevels)
    }
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

  const addTeachingLocation = () => {
    const current = watch('teachingLocations') || []
    setValue('teachingLocations', [...current, { instituteName: '', city: '', district: '', state: '', address: '' }])
  }

  const removeTeachingLocation = (index: number) => {
    const current = watch('teachingLocations') || []
    setValue('teachingLocations', current.filter((_, i) => i !== index))
    setLocationOptionsByIndex((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  const loadDistrictsForIndex = (index: number, province: string) => {
    if (!province?.trim()) {
      setLocationOptionsByIndex((prev) => ({ ...prev, [index]: { districts: [], cities: [] } }))
      return
    }
    LocationsService.getDistricts(province)
      .then((list) => {
        setLocationOptionsByIndex((prev) => ({
          ...prev,
          [index]: { districts: list.length > 0 ? list : FALLBACK_DISTRICTS, cities: [] },
        }))
      })
      .catch(() => {
        setLocationOptionsByIndex((prev) => ({
          ...prev,
          [index]: { districts: FALLBACK_DISTRICTS, cities: [] },
        }))
      })
  }

  const loadCitiesForIndex = (index: number, district: string) => {
    if (!district?.trim()) {
      setLocationOptionsByIndex((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: [] },
      }))
      return
    }
    LocationsService.getCities(district)
      .then((list) => {
        setLocationOptionsByIndex((prev) => ({
          ...prev,
          [index]: { ...prev[index], districts: prev[index]?.districts ?? [], cities: list.length > 0 ? list : FALLBACK_CITIES },
        }))
      })
      .catch(() => {
        setLocationOptionsByIndex((prev) => ({
          ...prev,
          [index]: { ...prev[index], districts: prev[index]?.districts ?? [], cities: FALLBACK_CITIES },
        }))
      })
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      
      // Upload image if changed
      let imageUrl: string | null = profileImage || null
      if (imageFile) {
        try {
          if (!localStorage.getItem('accessToken')) {
            toast({
              title: 'Session expired',
              description: 'Please sign in again to upload images',
              variant: 'destructive',
            })
            setIsLoading(false)
            return
          }
          setIsUploading(true)
          setUploadProgress(0)
          
          const formData = new FormData()
          formData.append('file', imageFile)
          formData.append('folder', 'teacher-profiles')
          
          // Use shared api instance so auth token and 401 refresh are applied
          const uploadResult = await api.post<{ success: boolean; data: { url: string; publicId: string; message?: string } }>(
            '/upload/image',
            formData,
            {
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  setUploadProgress(percentCompleted)
                }
              },
            }
          )
          
          if (uploadResult?.data?.data?.url) {
            imageUrl = uploadResult.data.data.url
            // Add cache-busting parameter to force refresh
            if (imageUrl && typeof imageUrl === 'string') {
              const imageUrlWithCache = imageUrl.includes('?') 
                ? `${imageUrl}&t=${Date.now()}` 
                : `${imageUrl}?t=${Date.now()}`
              setProfileImage(imageUrlWithCache)
            }
          } else {
            console.error('Upload response:', uploadResult)
            throw new Error('No image URL returned from upload')
          }
          
          toast({
            title: 'Image uploaded',
            description: 'Profile picture uploaded successfully',
            variant: 'default',
          })
        } catch (error: any) {
          toast({
            title: 'Upload failed',
            description: error.response?.data?.message || error.message || 'Failed to upload image',
            variant: 'destructive',
          })
          // Don't proceed with profile update if image upload failed
          return
        } finally {
          setIsUploading(false)
          setUploadProgress(0)
        }
      }

      const updateData: any = {
        tagline: data.tagline || undefined,
        bio: data.bio || undefined,
        educationLevels: data.educationLevels || [],
        teachingModes: data.teachingModes || [],
        experienceLevel: data.experience || undefined,
        qualifications: data.qualifications?.filter(q => q && q.trim() !== '') || [],
        image: imageUrl || undefined,
        languages: data.languages || [],
        studentTargetTypes: data.studentTargetTypes || [],
        onlinePlatforms: data.onlinePlatforms || [],
      }

      // Add location if any field is provided (legacy single location)
      if (data.city || data.district || data.state || data.address || data.instituteName) {
        updateData.location = {
          city: data.city || undefined,
          district: data.district || undefined,
          state: data.state || undefined,
          address: data.address || undefined,
          instituteName: data.instituteName !== undefined ? data.instituteName : undefined,
        }
      }
      // Teaching locations (multiple institutions)
      if (Array.isArray(data.teachingLocations)) {
        updateData.teachingLocations = data.teachingLocations
          .filter((loc) => loc.instituteName?.trim() || loc.city?.trim() || loc.district?.trim() || loc.state?.trim() || loc.address?.trim())
          .map((loc) => ({
            instituteName: loc.instituteName?.trim() || undefined,
            city: loc.city?.trim() || undefined,
            district: loc.district?.trim() || undefined,
            state: loc.state?.trim() || undefined,
            address: loc.address?.trim() || undefined,
          }))
      }

      // Add contact if phone is provided
      if (data.phone) {
        updateData.contact = {
          phone: data.phone,
        }
      }

      // Add social links if any are provided
      if (data.linkedin || data.youtube || data.facebook || data.twitter || data.instagram || data.whatsapp) {
        updateData.socialLinks = {
          linkedin: data.linkedin || undefined,
          youtube: data.youtube || undefined,
          facebook: data.facebook || undefined,
          twitter: data.twitter || undefined,
          instagram: data.instagram || undefined,
          whatsapp: data.whatsapp || undefined,
        }
      }

      await put('/teacher/profile', updateData)
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        variant: 'default',
      })
      
      setIsEditing(false)
      
      // Clear the image file since it's now uploaded
      if (imageFile) {
        setImageFile(null)
      }
      
      // Update image state immediately with cache-busting
      if (imageUrl && typeof imageUrl === 'string') {
        const imageUrlWithCache = imageUrl.includes('?') 
          ? `${imageUrl}&t=${Date.now()}` 
          : `${imageUrl}?t=${Date.now()}`
        setProfileImage(imageUrlWithCache)
      }
      
      // Reload profile to get latest data from server (this will update profileData)
      await loadProfile()
      
      // Force image refresh after reload - fetch fresh data
      setTimeout(async () => {
        try {
          const freshData = await get<any>('/teacher/profile')
          if (freshData?.image && typeof freshData.image === 'string') {
            const freshImageUrl = freshData.image.includes('?') 
              ? `${freshData.image}&t=${Date.now()}` 
              : `${freshData.image}?t=${Date.now()}`
            setProfileImage(freshImageUrl)
            setProfileData(freshData)
          } else if (imageUrl && typeof imageUrl === 'string') {
            const freshImageUrl = imageUrl.includes('?') 
              ? `${imageUrl}&t=${Date.now()}` 
              : `${imageUrl}?t=${Date.now()}`
            setProfileImage(freshImageUrl)
          }
        } catch (error) {
          console.error('Failed to refresh profile image:', error)
        }
      }, 300)
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
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent shadow-lg" />
          </div>
          <p className="text-muted-foreground font-medium animate-pulse">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Get experience display value
  const getExperienceDisplay = () => {
    if (profileData?.experienceLevel) {
      const level = experienceLevels.find(l => l.value === profileData.experienceLevel)
      return level ? level.label : profileData.experienceLevel
    }
    if (profileData?.experience) {
      return profileData.experience
    }
    return ''
  }

  // Derive subjects from educationLevels when top-level subjects is empty (backend uses educationLevels)
  const allProfileSubjects = (profileData?.subjects && profileData.subjects.length > 0)
    ? profileData.subjects
    : (profileData?.educationLevels || []).flatMap((el: { subjects?: string[] }) => el.subjects || [])
  const profileViewSubjects = Array.from(new Set<string>(allProfileSubjects)).filter(Boolean).sort()

  const profile = {
    name: profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : profileData?.firstName || profileData?.lastName || user?.name || 'Teacher',
    email: user?.email || '',
    phone: profileData?.contact?.phone || '',
    tagline: profileData?.tagline || '',
    location: (() => {
      const locs = profileData?.teachingLocations
      if (Array.isArray(locs) && locs.length > 0) {
        if (locs.length === 1) {
          const parts = [locs[0].instituteName, locs[0].city, locs[0].district, locs[0].state].filter(Boolean)
          return parts.length ? parts.join(', ') : 'Not set'
        }
        return `${locs.length} teaching locations`
      }
      const legacy = [profileData?.location?.city, profileData?.location?.district, profileData?.location?.state].filter(Boolean)
      return legacy.length ? legacy.join(', ') : 'Not set'
    })(),
    bio: profileData?.bio || '',
    subjects: profileViewSubjects,
    qualifications: profileData?.qualifications || [],
    experience: getExperienceDisplay(),
    teachingModes: profileData?.teachingModes || [],
    languages: profileData?.languages || [],
    studentTargetTypes: profileData?.studentTargetTypes || [],
    socialLinks: {
      linkedin: profileData?.socialLinks?.linkedin || '',
      youtube: profileData?.socialLinks?.youtube || '',
      facebook: profileData?.socialLinks?.facebook || '',
      twitter: profileData?.socialLinks?.twitter || '',
      instagram: profileData?.socialLinks?.instagram || '',
      whatsapp: profileData?.socialLinks?.whatsapp || '',
    },
    stats: {
      totalStudents: profileData?.stats?.totalStudents || 0,
      totalClasses: profileData?.stats?.totalClasses || 0,
      avgRating: profileData?.stats?.avgRating || 0,
      totalReviews: profileData?.stats?.totalReviews ?? 0,
    },
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page header with gradient accent */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-br from-background/95 to-background/50 backdrop-blur-sm rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in slide-in-from-left duration-500">
              Profile
            </h1>
            <p className="text-muted-foreground animate-in slide-in-from-left duration-500 delay-75">
              Manage your public profile and settings
            </p>
          </div>
          <div className="flex gap-2 animate-in slide-in-from-right duration-500">
            {profileData?.slug && (
              <Button 
                variant="outline" 
                asChild
                className="group hover:border-primary hover:shadow-md transition-all duration-300"
              >
                <Link to={`/t/${profileData.slug}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  View Public Profile
                </Link>
              </Button>
            )}
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 backdrop-blur-sm border shadow-sm">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="account"
            className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
          >
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {!isEditing ? (
            // View Mode
            <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500">
              {/* Profile card with enhanced styling */}
              <Card className="lg:col-span-1 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl group">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300" />
                      <Avatar className="w-24 h-24 relative border-4 border-background shadow-xl">
                        <AvatarImage src={profileImage || profileData?.image} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-purple-600 text-white">
                          {getInitials(profile.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        {profile.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      {profileData?.status === 'APPROVED' && (
                        <Badge className="mt-2 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105" variant="default">
                          ✓ Verified Teacher
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                      <div className="group/stat text-center p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                        <p className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                          {profile.stats.totalStudents}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Students</p>
                      </div>
                      <div className="group/stat text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                        <p className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                          {profile.stats.totalClasses}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Classes</p>
                      </div>
                      <div className="group/stat text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                        <p className="text-2xl font-bold bg-gradient-to-br from-amber-600 to-amber-800 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                          {profile.stats.avgRating}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Rating</p>
                      </div>
                      <div className="group/stat text-center p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 border border-pink-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                        <p className="text-2xl font-bold bg-gradient-to-br from-pink-600 to-pink-800 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform">
                          {profile.stats.totalReviews}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Reviews</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile details with hover effects */}
              <Card className="lg:col-span-2 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl">Profile Information</CardTitle>
                  <CardDescription>
                    This information will be displayed on your public profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <p className="font-medium">{profile.name || '—'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <p className="font-medium">{profile.email || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                      <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="font-medium">{profile.phone || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 group-hover/item:bg-blue-500/20 transition-colors">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="font-medium">{profile.location || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  {profile.tagline ? (
                    <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                      <Label className="text-sm font-medium text-muted-foreground">Tagline</Label>
                      <p className="text-sm font-medium italic">{profile.tagline}</p>
                    </div>
                  ) : null}

                  <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                    <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                    <p className="text-sm leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      Professional Details
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3 p-4 rounded-lg border border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                        <Label className="text-sm font-medium text-muted-foreground">Subjects</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.subjects.length > 0 ? (
                            profile.subjects.map((subject: string, idx: number) => (
                              <Badge 
                                key={subject} 
                                variant="secondary"
                                className="hover:scale-110 transition-transform duration-200 cursor-pointer shadow-sm hover:shadow-md"
                                style={{ animationDelay: `${idx * 50}ms` }}
                              >
                                {subject}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">None added</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3 p-4 rounded-lg border border-muted hover:border-purple-500/50 transition-all duration-300 hover:shadow-md">
                        <Label className="text-sm font-medium text-muted-foreground">Qualifications</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.qualifications.length > 0 ? (
                            profile.qualifications.map((qualification: string, idx: number) => (
                              <Badge 
                                key={qualification} 
                                variant="outline"
                                className="hover:scale-110 transition-transform duration-200 cursor-pointer hover:bg-purple-500/10 hover:border-purple-500"
                                style={{ animationDelay: `${idx * 50}ms` }}
                              >
                                {qualification}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">None added</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3 p-4 rounded-lg border border-muted hover:border-amber-500/50 transition-all duration-300 hover:shadow-md">
                        <Label className="text-sm font-medium text-muted-foreground">Teaching Modes</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.teachingModes.length > 0 ? (
                            profile.teachingModes.map((mode: string) => (
                              <Badge key={mode} variant="outline" className="font-normal">
                                {mode}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Not set</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3 p-4 rounded-lg border border-muted hover:border-emerald-500/50 transition-all duration-300 hover:shadow-md">
                        <Label className="text-sm font-medium text-muted-foreground">Languages</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages.length > 0 ? (
                            profile.languages.map((lang: string) => (
                              <Badge key={lang} variant="outline" className="font-normal">
                                {lang}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Not set</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                      <Label className="text-sm font-medium text-muted-foreground">Teaching Experience</Label>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 group-hover/item:bg-amber-500/20 transition-colors">
                          <Briefcase className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="font-medium">{profile.experience || 'Not set'}</p>
                      </div>
                    </div>
                    {profile.studentTargetTypes.length > 0 && (
                      <div className="space-y-2 group/item p-4 rounded-lg hover:bg-muted/50 transition-all duration-300">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          Student Target
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.studentTargetTypes.map((t: string) => (
                            <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      Social Links
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 p-3 rounded-lg border border-muted hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300">
                        <Label className="text-xs font-medium text-muted-foreground">LinkedIn</Label>
                        {profile.socialLinks.linkedin ? (
                          <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-blue-600 group/link"
                          >
                            <LinkIcon className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                            <span className="text-sm truncate group-hover/link:underline">{profile.socialLinks.linkedin}</span>
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="space-y-2 p-3 rounded-lg border border-muted hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300">
                        <Label className="text-xs font-medium text-muted-foreground">YouTube</Label>
                        {profile.socialLinks.youtube ? (
                          <a
                            href={profile.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-red-600 group/link"
                          >
                            <LinkIcon className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                            <span className="text-sm truncate group-hover/link:underline">{profile.socialLinks.youtube}</span>
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="space-y-2 p-3 rounded-lg border border-muted hover:border-blue-600/50 hover:bg-blue-600/5 transition-all duration-300">
                        <Label className="text-xs font-medium text-muted-foreground">Facebook</Label>
                        {profile.socialLinks.facebook ? (
                          <a
                            href={profile.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-blue-600 group/link"
                          >
                            <LinkIcon className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                            <span className="text-sm truncate group-hover/link:underline">{profile.socialLinks.facebook}</span>
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="space-y-2 p-3 rounded-lg border border-muted hover:border-sky-500/50 hover:bg-sky-500/5 transition-all duration-300">
                        <Label className="text-xs font-medium text-muted-foreground">Twitter</Label>
                        {profile.socialLinks.twitter ? (
                          <a
                            href={profile.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-sky-500 group/link"
                          >
                            <LinkIcon className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                            <span className="text-sm truncate group-hover/link:underline">{profile.socialLinks.twitter}</span>
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="space-y-2 p-3 rounded-lg border border-muted hover:border-pink-500/50 hover:bg-pink-500/5 transition-all duration-300">
                        <Label className="text-xs font-medium text-muted-foreground">Instagram</Label>
                        {profile.socialLinks.instagram ? (
                          <a
                            href={profile.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-pink-600 group/link"
                          >
                            <LinkIcon className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                            <span className="text-sm truncate group-hover/link:underline">{profile.socialLinks.instagram}</span>
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not set</p>
                        )}
                      </div>
                      <div className="space-y-2 p-3 rounded-lg border border-muted hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300">
                        <Label className="text-xs font-medium text-muted-foreground">WhatsApp</Label>
                        {profile.socialLinks.whatsapp ? (
                          <a
                            href={`https://wa.me/${profile.socialLinks.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-green-600 group/link"
                          >
                            <LinkIcon className="h-4 w-4 group-hover/link:rotate-12 transition-transform" />
                            <span className="text-sm truncate group-hover/link:underline">{profile.socialLinks.whatsapp}</span>
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
            <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in duration-500">
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 backdrop-blur-sm border shadow-sm">
                  <TabsTrigger 
                    value="basic"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    Education & Subjects
                  </TabsTrigger>
                  <TabsTrigger 
                    value="teaching"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    Teaching Details
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Profile Photo
                      </CardTitle>
                      <CardDescription>
                        Upload a clear profile photo. You can crop and adjust it before saving. Recommended: Square image, at least 400x400px, max 5MB
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-5">
                        <div className="relative group cursor-pointer flex-shrink-0 ">
                          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full opacity-40 group-hover:opacity-75 blur-md transition duration-300" />
                          <Avatar className="w-32 h-32 sm:w-36 sm:h-36 border-3 border-background relative shadow-xl group-hover:scale-105 transition-transform duration-300 ease-out">
                            <AvatarImage src={profileImage || undefined} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-purple-600 text-white">
                              {user ? getInitials(user.name) : 'T'}
                            </AvatarFallback>
                          </Avatar>
                          {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/95 rounded-full backdrop-blur-md mt-5">
                              <div className="relative w-16 h-16">
                                {/* Circular progress ring */}
                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="32"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="none"
                                    className="text-muted/20"
                                  />
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="32"
                                    stroke="url(#gradient)"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 32}`}
                                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - uploadProgress / 100)}`}
                                    className="transition-all duration-500 ease-out"
                                  />
                                  <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#3b82f6" />
                                      <stop offset="50%" stopColor="#8b5cf6" />
                                      <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                {/* Percentage text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <div className="text-lg font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {uploadProgress}%
                                  </div>
                                  <div className="text-[9px] text-muted-foreground font-medium">Uploading</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2.5 w-full">
                          <div
                            className={`border-2 border-dashed rounded-lg p-3 transition-all duration-300 ${
                              isDragging
                                ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg'
                                : 'border-border hover:border-primary/50 hover:bg-primary/5'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <div className="space-y-1.5 text-center">
                              <Upload className={`mx-auto h-7 w-7 transition-all duration-300 ${isDragging ? 'text-primary scale-110' : 'text-muted-foreground'}`} />
                              <div className="space-y-1">
                                <Label htmlFor="image-upload" className="cursor-pointer">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    disabled={isUploading}
                                    asChild
                                    className="shadow-sm hover:shadow-md transition-all hover:scale-105"
                                  >
                                    <span>
                                      {imageFile ? 'Change Photo' : 'Upload Photo'}
                                    </span>
                                  </Button>
                                </Label>
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                                <p className="text-[11px] text-muted-foreground">
                                  or drag and drop
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {imageFile && (
                            <div className="relative overflow-hidden space-y-2 p-2.5 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-lg border border-primary/20 shadow-sm animate-in slide-in-from-top duration-500">
                              {/* Decorative background gradient */}
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-xl -z-10" />
                              
                              <div className="flex items-center gap-2">
                                <div className="relative flex-shrink-0">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-sm">
                                    <Upload className="h-4 w-4 text-white" />
                                  </div>
                                  {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg opacity-50 animate-pulse" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-semibold truncate">{imageFile.name}</span>
                                    {uploadProgress === 0 && (
                                      <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-green-600 to-emerald-600">
                                        Ready
                                      </Badge>
                                    )}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                      <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                                        Uploading...
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground mt-0.5">
                                    <span className="font-medium">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                      <>
                                        <span>•</span>
                                        <span className="font-semibold text-primary">{uploadProgress}% completed</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out shadow-sm"
                                    style={{ width: `${uploadProgress}%` }}
                                  >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                  </div>
                                  {/* Shimmer effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                </div>
                              )}
                              
                              {uploadProgress === 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleImageRemove}
                                  disabled={isUploading}
                                  className="w-full h-6 text-[11px] hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group/remove"
                                >
                                  <X className="mr-1 h-3 w-3 group-hover/remove:rotate-90 transition-transform" />
                                  Remove Photo
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Basic Information
                      </CardTitle>
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
                  <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                        Education Level & Subjects
                      </CardTitle>
                      <CardDescription>Select your education level and subjects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Education Levels *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.keys(educationLevels).map((level) => (
                            <div 
                              key={level} 
                              className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md group ${
                                watchedEducationLevels?.some(el => el.level === level) 
                                  ? 'border-primary bg-primary/5 shadow-md' 
                                  : 'border-muted hover:border-primary/50'
                              }`}
                            >
                              <Checkbox
                                id={`level-${level}`}
                                checked={watchedEducationLevels?.some(el => el.level === level) || false}
                                onCheckedChange={() => handleEducationLevelToggle(level as 'PRIMARY' | 'OL' | 'AL')}
                                className="group-hover:scale-110 transition-transform"
                              />
                              <Label htmlFor={`level-${level}`} className="cursor-pointer flex-1 font-medium">
                                {level === 'PRIMARY' ? 'Primary' : level === 'OL' ? 'O/L (Ordinary Level)' : 'A/L (Advanced Level)'}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          Select all education levels you teach. Each level will have its own subjects and grades.
                        </p>
                        {errors.educationLevels && (
                          <p className="text-sm text-destructive flex items-center gap-2 animate-in slide-in-from-left">
                            <X className="h-4 w-4" />
                            {errors.educationLevels.message}
                          </p>
                        )}
                      </div>

                      {watchedEducationLevels?.map((eduLevel, idx) => (
                        <Card 
                          key={eduLevel.level} 
                          className="border-l-4 border-l-primary shadow-md hover:shadow-xl transition-all duration-300 animate-in slide-in-from-left"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              {eduLevel.level === 'PRIMARY' ? 'Primary' : eduLevel.level === 'OL' ? 'O/L (Ordinary Level)' : 'A/L (Advanced Level)'}
                            </CardTitle>
                            <CardDescription>
                              Select subjects and grades for {eduLevel.level === 'PRIMARY' ? 'Primary' : eduLevel.level === 'OL' ? 'O/L' : 'A/L'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label>Subjects for this level *</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md max-h-60 overflow-y-auto">
                                {educationLevels[eduLevel.level].subjects.map((subject) => (
                                  <div key={subject} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`subject-${eduLevel.level}-${subject}`}
                                      checked={eduLevel.subjects?.includes(subject) || false}
                                      onCheckedChange={() => handleSubjectToggle(eduLevel.level, subject)}
                                    />
                                    <Label
                                      htmlFor={`subject-${eduLevel.level}-${subject}`}
                                      className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                      {subject}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Grades for this level *</Label>
                              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 p-3 border rounded-md max-h-60 overflow-y-auto">
                                {educationLevels[eduLevel.level].grades.map((grade) => (
                                  <div key={grade} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`grade-${eduLevel.level}-${grade}`}
                                      checked={eduLevel.grades?.includes(grade) || false}
                                      onCheckedChange={() => handleGradeToggle(eduLevel.level, grade)}
                                    />
                                    <Label
                                      htmlFor={`grade-${eduLevel.level}-${grade}`}
                                      className="text-sm font-normal cursor-pointer"
                                    >
                                      Grade {grade} ({educationLevelLabels[eduLevel.level] ?? eduLevel.level})
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Teaching Details Tab */}
                <TabsContent value="teaching" className="space-y-6">
                  <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        Teaching Details
                      </CardTitle>
                      <CardDescription>How do you teach and what are your qualifications?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Teaching Mode *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {teachingModes.map((mode, idx) => (
                            <div 
                              key={mode} 
                              className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md group ${
                                watchedTeachingModes?.includes(mode)
                                  ? 'border-primary bg-primary/5 shadow-md'
                                  : 'border-muted hover:border-primary/50'
                              }`}
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <Checkbox
                                id={`mode-${mode}`}
                                checked={watchedTeachingModes?.includes(mode) || false}
                                onCheckedChange={() => handleTeachingModeToggle(mode)}
                                className="group-hover:scale-110 transition-transform"
                              />
                              <Label htmlFor={`mode-${mode}`} className="cursor-pointer flex-1 font-medium">
                                {mode}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.teachingModes && (
                          <p className="text-sm text-destructive flex items-center gap-2 animate-in slide-in-from-left">
                            <X className="h-4 w-4" />
                            {errors.teachingModes.message}
                          </p>
                        )}
                      </div>

                      {watchedTeachingModes?.includes('Physical class') && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Teaching locations / Institutions</p>
                            <p className="text-xs text-muted-foreground">Add each province, district, city and institute where you teach</p>
                          </div>
                          {(watch('teachingLocations') || []).map((_, index) => {
                            const opts = locationOptionsByIndex[index] || { districts: [], cities: [] }
                            return (
                              <Card key={index} className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-medium text-muted-foreground">Location {index + 1}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTeachingLocation(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                  <div className="space-y-2">
                                    <Label>Province</Label>
                                    <SearchableSelect
                                      value={watch(`teachingLocations.${index}.state`) || ''}
                                      onValueChange={(value) => {
                                        setValue(`teachingLocations.${index}.state`, value)
                                        setValue(`teachingLocations.${index}.district`, '')
                                        setValue(`teachingLocations.${index}.city`, '')
                                        loadDistrictsForIndex(index, value)
                                      }}
                                      options={locationOptions.provinces}
                                      placeholder="Select province"
                                      searchPlaceholder="Search provinces..."
                                      emptyMessage="No province found."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>District</Label>
                                    <SearchableSelect
                                      value={watch(`teachingLocations.${index}.district`) || ''}
                                      onValueChange={(value) => {
                                        setValue(`teachingLocations.${index}.district`, value)
                                        setValue(`teachingLocations.${index}.city`, '')
                                        loadCitiesForIndex(index, value)
                                      }}
                                      options={opts.districts}
                                      placeholder="Select district"
                                      searchPlaceholder="Search districts..."
                                      emptyMessage="No district found."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>City</Label>
                                    <SearchableSelect
                                      value={watch(`teachingLocations.${index}.city`) || ''}
                                      onValueChange={(value) => setValue(`teachingLocations.${index}.city`, value)}
                                      options={opts.cities}
                                      placeholder="Select city"
                                      searchPlaceholder="Search cities..."
                                      emptyMessage="No city found."
                                    />
                                  </div>
                                  <div className="space-y-2 md:col-span-3">
                                    <Label>Institute / Academy name (Optional)</Label>
                                    <Input
                                      {...register(`teachingLocations.${index}.instituteName`)}
                                      placeholder="e.g. ABC Tuition Centre"
                                    />
                                  </div>
                                  <div className="space-y-2 md:col-span-3">
                                    <Label>Address (Optional)</Label>
                                    <Input
                                      {...register(`teachingLocations.${index}.address`)}
                                      placeholder="Full address for this location"
                                    />
                                  </div>
                                </div>
                              </Card>
                            )
                          })}
                          <Button type="button" variant="outline" onClick={addTeachingLocation} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add teaching location
                          </Button>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select 
                          value={watch('experience') || ''} 
                          onValueChange={(value) => setValue('experience', value)}
                        >
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
                          {watch('qualifications')?.map((qualification, index) => (
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
                          <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                              id="facebook"
                              placeholder="https://facebook.com/yourpage"
                              {...register('facebook')}
                              error={errors.facebook?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                              id="twitter"
                              placeholder="https://twitter.com/yourhandle"
                              {...register('twitter')}
                              error={errors.twitter?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              placeholder="https://instagram.com/yourhandle"
                              {...register('instagram')}
                              error={errors.instagram?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input
                              id="whatsapp"
                              placeholder="+1234567890"
                              {...register('whatsapp')}
                              error={errors.whatsapp?.message}
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter your WhatsApp number with country code (e.g., +1234567890)
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

              </Tabs>

              <div className="flex justify-end gap-4 pt-6 pb-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    loadProfile()
                  }}
                  className="hover:scale-105 transition-all duration-300 hover:shadow-md"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-500/5 to-orange-500/5">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-red-600" />
                Account Settings
              </CardTitle>
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

              <Separator className="my-6" />

              <div className="space-y-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <h3 className="font-medium">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="hover:border-primary/50 transition-colors" />
                  </div>
                  <div></div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="hover:border-primary/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="hover:border-primary/50 transition-colors" />
                  </div>
                </div>
                <Button className="hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                  Update Password
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 p-4 rounded-lg border-2 border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <h3 className="font-medium text-destructive flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-center space-y-3 py-12">
                <div className="text-6xl mb-4">🚧</div>
                <p className="text-muted-foreground text-lg">Notification settings coming soon...</p>
                <p className="text-sm text-muted-foreground">We're working on bringing you customizable notification preferences</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Cropper Dialog */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          open={showCropper}
          onClose={() => {
            setShowCropper(false)
            setImageToCrop(null)
          }}
          onCropComplete={handleCropComplete}
          aspect={1}
          cropShape="round"
        />
      )}
    </div>
  )
}
