import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { Separator } from '@/shared/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage platform settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input id="platformName" defaultValue="Tuition Management System" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Platform Description</Label>
                <Textarea
                  id="description"
                  defaultValue="A comprehensive platform for managing tuition classes and students."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Teacher Auto-Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new teacher registrations
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Student Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow students to register without teacher invitation
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize the platform appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" placeholder="https://example.com/logo.png" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input id="favicon" placeholder="https://example.com/favicon.ico" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input id="primaryColor" type="color" defaultValue="#3b82f6" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Input id="accentColor" type="color" defaultValue="#8b5cf6" />
                </div>
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New Enrollment Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify teachers when students request enrollment
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminders before scheduled sessions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Auto-logout after inactivity (minutes)
                  </p>
                </div>
                <Input type="number" defaultValue="30" className="w-20" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable rate limiting for API endpoints
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
