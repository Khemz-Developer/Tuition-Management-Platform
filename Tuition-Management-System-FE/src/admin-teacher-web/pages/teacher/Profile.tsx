import { useState } from 'react'
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
import { getInitials } from '@/lib/utils'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Camera,
  Save,
  Eye,
  Link as LinkIcon,
} from 'lucide-react'

export default function TeacherProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Placeholder profile data
  const profile = {
    name: user?.name || 'John Smith',
    email: user?.email || 'john@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    bio: 'Experienced mathematics teacher with over 10 years of teaching experience. Passionate about making complex concepts simple and accessible to all students.',
    subjects: ['Mathematics', 'Physics'],
    qualifications: ['M.Sc Mathematics', 'B.Ed'],
    experience: '10+ years',
    website: 'https://johnsmith.tuition.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johnsmith',
      youtube: 'https://youtube.com/@johnsmith',
    },
    stats: {
      totalStudents: 156,
      totalClasses: 12,
      avgRating: 4.8,
      totalReviews: 45,
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
          <Button variant="outline" asChild>
            <a href={profile.website} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              View Public Profile
            </a>
          </Button>
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
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-2xl">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute -bottom-2 -right-2 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <Badge className="mt-2" variant="success">Verified Teacher</Badge>

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
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue={profile.name}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue={profile.phone}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    defaultValue={profile.location}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue={profile.bio}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Professional Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Subjects</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Qualifications</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.qualifications.map((qual) => (
                          <Badge key={qual} variant="outline">
                            {qual}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Teaching Experience</Label>
                    <Input
                      id="experience"
                      defaultValue={profile.experience}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Social Links</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        defaultValue={profile.socialLinks.linkedin}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        defaultValue={profile.socialLinks.youtube}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
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
