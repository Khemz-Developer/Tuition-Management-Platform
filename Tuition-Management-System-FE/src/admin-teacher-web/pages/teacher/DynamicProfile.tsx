import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Switch } from '@/shared/components/ui/switch'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { ProfileBuilder } from '@/shared/components/ProfileBuilder'
import { DynamicFormGenerator } from '@/shared/components/DynamicFormGenerator'
import { useAuth } from '@/shared/hooks/useAuth'
import { useToast } from '@/shared/components/ui/use-toast'
import { get, put, post } from '@/shared/services/api'
import { 
  Settings, 
  Eye, 
  Save, 
  RefreshCw, 
  Layout,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ProfileSection {
  id: string
  type: 'basic' | 'education' | 'experience' | 'pricing' | 'contact' | 'availability' | 'custom'
  title: string
  description?: string
  visible: boolean
  order: number
  required: boolean
  size: 'small' | 'medium' | 'large' | 'full'
  fields?: any[]
  config?: Record<string, any>
}

interface DynamicConfig {
  educationLevels: any[]
  subjects: any[]
  grades: any[]
  profileSections: ProfileSection[]
  profileTemplates: any[]
  settings: any
}

export default function DynamicProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<DynamicConfig | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [usesDynamicProfile, setUsesDynamicProfile] = useState(false)
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([])
  const [activeTab, setActiveTab] = useState('builder')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load config and profile data in parallel
      const [configResponse, profileResponse] = await Promise.all([
        get('/teacher/dynamic-profile/config'),
        get('/teacher/dynamic-profile')
      ])

      setConfig(configResponse)
      setProfileData(profileResponse)
      setUsesDynamicProfile(profileResponse.usesDynamicProfile || false)
      
      if (profileResponse.profileLayout) {
        setProfileSections(profileResponse.profileLayout)
      } else {
        // Initialize with default sections
        const defaultSections = configResponse.profileSections?.slice(0, 5) || []
        setProfileSections(defaultSections.map((section, index) => ({
          ...section,
          order: index,
          visible: true
        })))
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load profile data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnableDynamicProfile = async () => {
    try {
      setIsSaving(true)
      await post('/teacher/dynamic-profile/enable', {})
      setUsesDynamicProfile(true)
      
      toast({
        title: 'Success',
        description: 'Dynamic profile enabled successfully',
      })
      
      await loadData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to enable dynamic profile',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDisableDynamicProfile = async () => {
    try {
      setIsSaving(true)
      await post('/teacher/dynamic-profile/disable', {})
      setUsesDynamicProfile(false)
      
      toast({
        title: 'Success',
        description: 'Dynamic profile disabled. Reverted to classic profile.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable dynamic profile',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLayout = async () => {
    try {
      setIsSaving(true)
      await put('/teacher/dynamic-profile/layout', profileSections)
      
      toast({
        title: 'Success',
        description: 'Profile layout saved successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save layout',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveFormData = async (formData: any) => {
    try {
      setIsSaving(true)
      await put('/teacher/dynamic-profile', {
        sectionData: formData,
        customFields: profileData?.dynamicProfile?.customFields || {},
      })
      
      toast({
        title: 'Success',
        description: 'Profile data saved successfully',
      })
      
      await loadData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile data',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleApplyTemplate = async (templateId: string) => {
    try {
      setIsSaving(true)
      const response = await post(`/teacher/dynamic-profile/apply-template/${templateId}`, {})
      
      toast({
        title: 'Success',
        description: 'Template applied successfully',
      })
      
      await loadData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to apply template',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const availableSections = config?.profileSections || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!usesDynamicProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Profile</h1>
          <p className="text-muted-foreground">
            Upgrade to the new dynamic profile system for complete customization
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Enable Dynamic Profile
            </CardTitle>
            <CardDescription>
              Get access to drag-and-drop profile builder, custom fields, and advanced templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will switch you from the classic profile editor to the new dynamic system. 
                Your existing profile data will be preserved and can be migrated.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Dynamic Profile Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Drag-and-drop section builder</li>
                  <li>• Custom field types</li>
                  <li>• Profile templates</li>
                  <li>• Advanced layout options</li>
                  <li>• Real-time preview</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">What happens to your data:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All existing data is preserved</li>
                  <li>• Can switch back anytime</li>
                  <li>• Gradual migration available</li>
                  <li>• No data loss guaranteed</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={handleEnableDynamicProfile} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Enable Dynamic Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Profile</h1>
          <p className="text-muted-foreground">
            Customize your profile with drag-and-drop sections and custom fields
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Dynamic Enabled
          </Badge>
          <Button variant="outline" onClick={handleDisableDynamicProfile}>
            Switch to Classic
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder" className="flex items-center">
            <Layout className="h-4 w-4 mr-2" />
            Layout Builder
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Content Editor
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4">
          <ProfileBuilder
            sections={profileSections}
            availableSections={availableSections}
            onSectionsChange={setProfileSections}
            onSave={handleSaveLayout}
            isLoading={isSaving}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {config?.profileSections && (
            <DynamicFormGenerator
              sections={config.profileSections}
              defaultValues={profileData?.dynamicProfile?.sectionData || {}}
              onSubmit={handleSaveFormData}
              isLoading={isSaving}
            />
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Templates</CardTitle>
              <CardDescription>
                Choose a pre-built template to quickly set up your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config?.profileTemplates?.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {template.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleApplyTemplate(template.id)}
                          disabled={isSaving}
                        >
                          Apply Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
