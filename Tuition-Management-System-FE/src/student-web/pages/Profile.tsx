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
import { Camera, Save } from 'lucide-react'

export default function StudentProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Placeholder profile data
  const profile = {
    name: user?.name || 'Alice Brown',
    email: user?.email || 'alice@example.com',
    phone: '+91 98765 43210',
    grade: '11th',
    school: 'ABC High School',
    parentName: 'Mr. & Mrs. Brown',
    parentPhone: '+91 87654 32109',
    address: 'Mumbai, India',
    bio: 'Aspiring engineer with a passion for mathematics and physics.',
    stats: {
      enrolledClasses: 3,
      completedSessions: 42,
      avgAttendance: 95,
    },
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your profile settings</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
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
                  <Badge className="mt-2">{profile.grade} Grade</Badge>

                  <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{profile.stats.enrolledClasses}</p>
                      <p className="text-xs text-muted-foreground">Classes</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{profile.stats.completedSessions}</p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{profile.stats.avgAttendance}%</p>
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      defaultValue={profile.grade}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      defaultValue={profile.school}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue={profile.address}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    defaultValue={profile.bio}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Parent/Guardian Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent Name</Label>
                      <Input
                        id="parentName"
                        defaultValue={profile.parentName}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Parent Phone</Label>
                      <Input
                        id="parentPhone"
                        defaultValue={profile.parentPhone}
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
              <CardDescription>Manage your account security</CardDescription>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
