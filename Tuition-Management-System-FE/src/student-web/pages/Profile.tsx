import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Separator } from '@/shared/components/ui/separator'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/useAuth'
import { useToast } from '@/shared/components/ui/use-toast'
import { getInitials } from '@/lib/utils'
import api, { get, put } from '@/shared/services/api'
import { ImageCropper } from '@/shared/components/ImageCropper'
import type { StudentProfile } from '@/shared/types/user.types'
import { Camera, Save, Loader2 } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  grade: z.string().min(1, 'Grade is required'),
  school: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentGuardianIdNo: z.string().optional(),
  relationship: z.string().optional(),
  learningGoals: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export default function StudentProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [stats] = useState({
    enrolledClasses: 0,
    completedSessions: 0,
    avgAttendance: 0,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  // Load profile data
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true)
      const profileData = await get<StudentProfile>('/student/profile')
      setProfile(profileData)
      
      // Reset form with profile data
      reset({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phone: profileData.phone || '',
        grade: profileData.grade || '',
        school: profileData.school || '',
        address: profileData.address || '',
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        parentName: profileData.parentName || '',
        parentPhone: profileData.parentPhone || profileData.parentContact || '',
        parentGuardianIdNo: profileData.parentGuardianIdNo || '',
        relationship: profileData.relationship || '',
        learningGoals: profileData.learningGoals || '',
      })
      
      // Set profile image
      if (profileData.image && typeof profileData.image === 'string') {
        // Add cache-busting parameter to force refresh
        const imageUrl = profileData.image.includes('?') 
          ? `${profileData.image}&t=${Date.now()}` 
          : `${profileData.image}?t=${Date.now()}`
        setProfileImage(imageUrl)
      } else {
        setProfileImage(null)
      }

      // TODO: Load stats from API
      // const statsData = await get('/student/stats')
      // setStats(statsData)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingProfile(false)
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
    setProfileImage(profile?.image || null)
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
          formData.append('folder', 'student-profiles')
          
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
        firstName: data.firstName,
        lastName: data.lastName,
        grade: data.grade,
      }

      if (data.phone) updateData.phone = data.phone
      if (data.school) updateData.school = data.school
      if (data.address) updateData.address = data.address
      if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth
      if (data.parentName) updateData.parentName = data.parentName
      if (data.parentPhone) updateData.parentContact = data.parentPhone
      if (data.parentGuardianIdNo) updateData.parentGuardianIdNo = data.parentGuardianIdNo
      if (data.relationship) updateData.relationship = data.relationship
      if (data.learningGoals) updateData.learningGoals = data.learningGoals
      if (imageUrl) updateData.image = imageUrl

      const updatedProfile = await put<StudentProfile>('/student/profile', updateData)
      setProfile(updatedProfile)
      setIsEditing(false)

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
      
      // Clear image file since it's now uploaded
      if (imageFile) {
        setImageFile(null)
      }
      
      // Reload profile to get latest data from server
      await loadProfile()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true)
      
      await put('/student/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      resetPassword()
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    loadProfile() // Reload to reset form
  }

  const displayName = profile 
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Student'
    : user?.name || 'Student'
  const displayEmail = profile?.user?.email || user?.email || ''
  const displayGrade = profile?.grade || ''

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your profile settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileImage || profile?.image || profile?.user?.avatar || user?.avatar} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          ref={(input) => {
                            if (input && !input.dataset.listenerAdded) {
                              input.dataset.listenerAdded = 'true'
                              input.addEventListener('change', (e) => {
                                const target = e.target as HTMLInputElement
                                if (target.files?.[0]) {
                                  handleImageUpload({ target } as React.ChangeEvent<HTMLInputElement>)
                                }
                              })
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute -bottom-2 -right-2 rounded-full"
                          onClick={() => document.getElementById('profile-image-upload')?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{displayName}</h2>
                  <p className="text-muted-foreground">{displayEmail}</p>
                  {displayGrade && <Badge className="mt-2">{displayGrade} Grade</Badge>}

                  <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{stats.enrolledClasses}</p>
                      <p className="text-xs text-muted-foreground">Classes</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{stats.completedSessions}</p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{stats.avgAttendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
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
                  Your personal and academic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        disabled={!isEditing}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        disabled={!isEditing}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        disabled={!isEditing}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth')}
                        disabled={!isEditing}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade *</Label>
                      <Input
                        id="grade"
                        {...register('grade')}
                        disabled={!isEditing}
                        placeholder="e.g., 10, 11, 12"
                      />
                      {errors.grade && (
                        <p className="text-sm text-destructive">{errors.grade.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input
                        id="school"
                        {...register('school')}
                        disabled={!isEditing}
                      />
                      {errors.school && (
                        <p className="text-sm text-destructive">{errors.school.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      disabled={!isEditing}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningGoals">Learning Goals</Label>
                    <Textarea
                      id="learningGoals"
                      {...register('learningGoals')}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Describe your learning goals and aspirations..."
                    />
                    {errors.learningGoals && (
                      <p className="text-sm text-destructive">{errors.learningGoals.message}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Parent/Guardian Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Parent/Guardian Name</Label>
                        <Input
                          id="parentName"
                          {...register('parentName')}
                          disabled={!isEditing}
                        />
                        {errors.parentName && (
                          <p className="text-sm text-destructive">{errors.parentName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <Input
                          id="relationship"
                          {...register('relationship')}
                          disabled={!isEditing}
                          placeholder="e.g., Father, Mother, Guardian"
                        />
                        {errors.relationship && (
                          <p className="text-sm text-destructive">{errors.relationship.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                        <Input
                          id="parentPhone"
                          type="tel"
                          {...register('parentPhone')}
                          disabled={!isEditing}
                        />
                        {errors.parentPhone && (
                          <p className="text-sm text-destructive">{errors.parentPhone.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentGuardianIdNo">Parent/Guardian ID No</Label>
                        <Input
                          id="parentGuardianIdNo"
                          {...register('parentGuardianIdNo')}
                          disabled={!isEditing}
                          placeholder="Enter ID number"
                        />
                        {errors.parentGuardianIdNo && (
                          <p className="text-sm text-destructive">{errors.parentGuardianIdNo.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={displayEmail} disabled />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address
                </p>
              </div>

              <Separator />

              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...registerPassword('currentPassword')}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  <div></div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerPassword('newPassword')}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword('confirmPassword')}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Image Cropper Modal */}
      <ImageCropper
        image={imageToCrop || ''}
        open={showCropper}
        onClose={() => {
          setShowCropper(false)
          setImageToCrop(null)
        }}
        onCropComplete={handleCropComplete}
        aspect={1}
        cropShape="round"
      />
    </div>
  )
}
