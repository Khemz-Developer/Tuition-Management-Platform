import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { Separator } from '@/shared/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Save, Loader2 } from 'lucide-react'
import { SettingsService } from '@/shared/services/settings.service'
import { GeneralSettings, BrandingSettings } from '@/shared/types/settings.types'
import { useToast } from '@/shared/components/ui/use-toast'

export default function AdminSettings() {
  const { toast } = useToast()
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    platformName: '',
    supportEmail: '',
    description: '',
    teacherAutoApproval: false,
    allowStudentRegistration: true
  })
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const config = await SettingsService.getSettings()
      if (config.generalSettings) setGeneralSettings(config.generalSettings)
      if (config.brandingSettings) setBrandingSettings(config.brandingSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneral = async () => {
    try {
      setSaving(true)
      await SettingsService.updateGeneralSettings(generalSettings)
      toast({
        title: 'Success',
        description: 'General settings saved successfully',
      })
    } catch (error) {
      console.error('Failed to save general settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save general settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBranding = async () => {
    try {
      setSaving(true)
      await SettingsService.updateBrandingSettings(brandingSettings)
      toast({
        title: 'Success',
        description: 'Branding settings saved successfully',
      })
    } catch (error) {
      console.error('Failed to save branding settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save branding settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
                <Input
                  id="platformName"
                  value={generalSettings.platformName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Platform Description</Label>
                <Textarea
                  id="description"
                  value={generalSettings.description}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
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
                <Switch
                  checked={generalSettings.teacherAutoApproval}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, teacherAutoApproval: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Student Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow students to register without teacher invitation
                  </p>
                </div>
                <Switch
                  checked={generalSettings.allowStudentRegistration}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, allowStudentRegistration: checked })}
                />
              </div>

              <Button onClick={handleSaveGeneral} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  value={brandingSettings.logoUrl || ''}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, logoUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  placeholder="https://example.com/favicon.ico"
                  value={brandingSettings.faviconUrl || ''}
                  onChange={(e) => setBrandingSettings({ ...brandingSettings, faviconUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={brandingSettings.primaryColor}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Input
                    id="accentColor"
                    type="color"
                    value={brandingSettings.accentColor}
                    onChange={(e) => setBrandingSettings({ ...brandingSettings, accentColor: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveBranding} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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

              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                Save Changes (Not Implemented)
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

              <Button disabled>
                <Save className="mr-2 h-4 w-4" />
                Save Changes (Not Implemented)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
