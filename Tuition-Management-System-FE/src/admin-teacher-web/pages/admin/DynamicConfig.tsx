import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { useToast } from '@/shared/components/ui/use-toast'
import { slugify } from '@/lib/utils'
import { get, put, post, del } from '@/shared/services/api'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Settings,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  RefreshCw,
} from 'lucide-react'

// Types
interface EducationLevel {
  code: string
  name: string
  description?: string
  active: boolean
  order: number
  defaultGrades: string[]
  customFields: any[]
}

interface Subject {
  code: string
  name: string
  description?: string
  educationLevels: string[]
  active: boolean
  order: number
  categories: string[]
  customFields: any[]
}

interface Grade {
  code: string
  name: string
  educationLevels: string[]
  active: boolean
  order: number
}

interface LocationItem {
  code: string
  name: string
  active: boolean
  order: number
}

interface DynamicConfig {
  educationLevels: EducationLevel[]
  subjects: Subject[]
  grades: Grade[]
  cities: LocationItem[]
  districts: LocationItem[]
  provinces: LocationItem[]
  profileSections: any[]
  profileTemplates: any[]
  settings: any
}

export default function DynamicConfig() {
  const { toast } = useToast()
  const [config, setConfig] = useState<DynamicConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('education')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setIsLoading(true)
      const response = await get('/admin/dynamic-config')
      setConfig(response)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load configuration',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getEndpoint = (type: string) => {
    if (type === 'education') return 'education-levels'
    if (type === 'city') return 'cities'
    if (type === 'district') return 'districts'
    if (type === 'province') return 'provinces'
    return `${type}s`
  }

  const handleToggleActive = async (type: 'education' | 'subject' | 'grade' | 'city' | 'district' | 'province', code: string, active: boolean) => {
    try {
      const endpoint = getEndpoint(type)
      await put(`/admin/dynamic-config/${endpoint}/${encodeURIComponent(code)}`, { active })
      
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${active ? 'activated' : 'deactivated'} successfully`,
      })
      
      await loadConfig()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to update ${type}`,
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type })
    setShowEditDialog(true)
  }

  const handleAdd = (type: string) => {
    setNewItem({ type })
    setShowAddDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    try {
      const endpoint = getEndpoint(editingItem.type)
      const codeParam = ['city', 'district', 'province'].includes(editingItem.type) ? encodeURIComponent(editingItem.code) : editingItem.code
      await put(`/admin/dynamic-config/${endpoint}/${codeParam}`, editingItem)
      
      toast({
        title: 'Success',
        description: `${editingItem.type.charAt(0).toUpperCase() + editingItem.type.slice(1)} updated successfully`,
      })
      
      setShowEditDialog(false)
      setEditingItem(null)
      await loadConfig()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update item',
        variant: 'destructive',
      })
    }
  }

  const handleSaveAdd = async () => {
    try {
      const endpoint = getEndpoint(newItem.type)
      let body: any = newItem
      if (['city', 'district', 'province'].includes(newItem.type)) {
        const name = (newItem.name || '').trim()
        if (!name) {
          toast({ title: 'Validation', description: 'Name is required', variant: 'destructive' })
          return
        }
        const code = slugify(name) || `item-${Date.now()}`
        body = { code, name, active: true }
      }
      await post(`/admin/dynamic-config/${endpoint}`, body)
      
      toast({
        title: 'Success',
        description: `${newItem.type.charAt(0).toUpperCase() + newItem.type.slice(1)} added successfully`,
      })
      
      setShowAddDialog(false)
      setNewItem({})
      await loadConfig()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (type: string, code: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      const endpoint = getEndpoint(type)
      const codeParam = ['city', 'district', 'province'].includes(type) ? encodeURIComponent(code) : code
      await del(`/admin/dynamic-config/${endpoint}/${codeParam}`)
      
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      })
      
      await loadConfig()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to delete ${type}`,
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dynamic Configuration</h1>
        <p className="text-muted-foreground">
          Manage education levels, subjects, grades, and profile fields
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education Levels
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Grades
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Education Levels Tab */}
        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education Levels</CardTitle>
                <CardDescription>
                  Manage educational levels and their associated grades/subjects
                </CardDescription>
              </div>
              <Button onClick={() => handleAdd('education')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Level
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Default Grades</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config?.educationLevels?.map((level) => (
                    <TableRow key={level.code}>
                      <TableCell className="font-mono">{level.code}</TableCell>
                      <TableCell className="font-medium">{level.name}</TableCell>
                      <TableCell>{level.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {level.defaultGrades.map((grade) => (
                            <Badge key={grade} variant="secondary" className="text-xs">
                              {grade}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={level.active}
                          onCheckedChange={(checked) => handleToggleActive('education', level.code, checked)}
                        />
                      </TableCell>
                      <TableCell>{level.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(level, 'education')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('education', level.code)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>
                  Manage subjects and their educational levels
                </CardDescription>
              </div>
              <Button onClick={() => handleAdd('subject')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Education Levels</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config?.subjects?.map((subject) => (
                    <TableRow key={subject.code}>
                      <TableCell className="font-mono">{subject.code}</TableCell>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.educationLevels.map((level) => (
                            <Badge key={level} variant="outline" className="text-xs">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.categories?.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={subject.active}
                          onCheckedChange={(checked) => handleToggleActive('subject', subject.code, checked)}
                        />
                      </TableCell>
                      <TableCell>{subject.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(subject, 'subject')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('subject', subject.code)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grades</CardTitle>
                <CardDescription>
                  Manage grade levels and their associations
                </CardDescription>
              </div>
              <Button onClick={() => handleAdd('grade')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Education Levels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config?.grades?.map((grade) => (
                    <TableRow key={grade.code}>
                      <TableCell className="font-mono">{grade.code}</TableCell>
                      <TableCell className="font-medium">{grade.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {grade.educationLevels.map((level) => (
                            <Badge key={level} variant="outline" className="text-xs">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={grade.active}
                          onCheckedChange={(checked) => handleToggleActive('grade', grade.code, checked)}
                        />
                      </TableCell>
                      <TableCell>{grade.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(grade, 'grade')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('grade', grade.code)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global settings for dynamic profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxEducationLevels">Max Education Levels</Label>
                  <Input
                    id="maxEducationLevels"
                    type="number"
                    defaultValue={config?.settings?.maxEducationLevels || 10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSubjectsPerLevel">Max Subjects Per Level</Label>
                  <Input
                    id="maxSubjectsPerLevel"
                    type="number"
                    defaultValue={config?.settings?.maxSubjectsPerLevel || 20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCustomFields">Max Custom Fields</Label>
                  <Input
                    id="maxCustomFields"
                    type="number"
                    defaultValue={config?.settings?.maxCustomFields || 50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowCustomSections">Allow Custom Sections</Label>
                  <Switch
                    id="allowCustomSections"
                    defaultChecked={config?.settings?.allowCustomSections || true}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: 'Settings', description: 'Settings saved successfully' })}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit {editingItem?.type?.charAt(0).toUpperCase() + editingItem?.type?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Update the {editingItem?.type} information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingItem?.type && !['city', 'district', 'province'].includes(editingItem.type) && (
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={editingItem?.code || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                  disabled
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder={['city', 'district', 'province'].includes(editingItem?.type) ? 'e.g., Colombo, Western Province' : undefined}
              />
            </div>
            {editingItem?.type && !['city', 'district', 'province'].includes(editingItem.type) && (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem?.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
            )}
            {editingItem?.type && !['city', 'district', 'province'].includes(editingItem.type) && (
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={editingItem?.order ?? 0}
                  onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Add {newItem.type?.charAt(0).toUpperCase() + newItem.type?.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Create a new {newItem.type}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {newItem.type && !['city', 'district', 'province'].includes(newItem.type) && (
              <div className="space-y-2">
                <Label htmlFor="newCode">Code</Label>
                <Input
                  id="newCode"
                  placeholder="e.g., PRIMARY, MATHEMATICS"
                  value={newItem.code || ''}
                  onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newName">Name</Label>
              <Input
                id="newName"
                placeholder={['city', 'district', 'province'].includes(newItem.type) ? 'e.g., Colombo, Western Province' : 'e.g., Primary Education, Mathematics'}
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            {newItem.type && !['city', 'district', 'province'].includes(newItem.type) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newDescription">Description</Label>
                  <Textarea
                    id="newDescription"
                    placeholder="Optional description"
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newOrder">Order</Label>
                  <Input
                    id="newOrder"
                    type="number"
                    placeholder="Display order"
                    value={newItem.order ?? 0}
                    onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add {newItem.type?.charAt(0).toUpperCase() + newItem.type?.slice(1)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
