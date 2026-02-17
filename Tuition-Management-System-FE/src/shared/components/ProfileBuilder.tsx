import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Switch } from '@/shared/components/ui/switch'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { 
  GripVertical, 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  MoreHorizontal,
  Layout,
  User,
  BookOpen,
  Award,
  DollarSign,
  Phone,
  Calendar
} from 'lucide-react'

// Types
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

interface ProfileBuilderProps {
  sections: ProfileSection[]
  availableSections: ProfileSection[]
  onSectionsChange: (sections: ProfileSection[]) => void
  onPreview?: () => void
  onSave?: () => void
  isLoading?: boolean
}

const sectionIcons = {
  basic: User,
  education: BookOpen,
  experience: Award,
  pricing: DollarSign,
  contact: Phone,
  availability: Calendar,
  custom: Layout,
}

const sectionColors = {
  basic: 'bg-blue-100 text-blue-800',
  education: 'bg-green-100 text-green-800',
  experience: 'bg-purple-100 text-purple-800',
  pricing: 'bg-yellow-100 text-yellow-800',
  contact: 'bg-red-100 text-red-800',
  availability: 'bg-indigo-100 text-indigo-800',
  custom: 'bg-gray-100 text-gray-800',
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  sections,
  availableSections,
  onSectionsChange,
  onPreview,
  onSave,
  isLoading = false,
}) => {
  const [draggedSection, setDraggedSection] = useState<ProfileSection | null>(null)
  const [editingSection, setEditingSection] = useState<ProfileSection | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  const handleDragStart = (section: ProfileSection) => {
    setDraggedSection(section)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetSection: ProfileSection) => {
    e.preventDefault()
    
    if (!draggedSection || draggedSection.id === targetSection.id) return

    const newSections = [...sections]
    const draggedIndex = newSections.findIndex(s => s.id === draggedSection.id)
    const targetIndex = newSections.findIndex(s => s.id === targetSection.id)

    // Remove dragged section and insert at new position
    newSections.splice(draggedIndex, 1)
    newSections.splice(targetIndex, 0, draggedSection)

    // Update order values
    newSections.forEach((section, index) => {
      section.order = index
    })

    onSectionsChange(newSections)
    setDraggedSection(null)
  }

  const handleAddSection = (sectionTemplate: ProfileSection) => {
    const newSection: ProfileSection = {
      ...sectionTemplate,
      id: `${sectionTemplate.type}_${Date.now()}`,
      order: sections.length,
    }

    onSectionsChange([...sections, newSection])
  }

  const handleToggleVisibility = (sectionId: string) => {
    const newSections = sections.map(section =>
      section.id === sectionId ? { ...section, visible: !section.visible } : section
    )
    onSectionsChange(newSections)
  }

  const handleDeleteSection = (sectionId: string) => {
    const newSections = sections.filter(section => section.id !== sectionId)
    // Reorder remaining sections
    newSections.forEach((section, index) => {
      section.order = index
    })
    onSectionsChange(newSections)
  }

  const handleEditSection = (section: ProfileSection) => {
    setEditingSection({ ...section })
    setShowEditDialog(true)
  }

  const handleSaveEdit = () => {
    if (!editingSection) return

    const newSections = sections.map(section =>
      section.id === editingSection.id ? editingSection : section
    )
    onSectionsChange(newSections)
    setShowEditDialog(false)
    setEditingSection(null)
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const currentIndex = newSections.findIndex(s => s.id === sectionId)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= newSections.length) return

    // Swap sections
    [newSections[currentIndex], newSections[newIndex]] = [newSections[newIndex], newSections[currentIndex]]

    // Update order values
    newSections.forEach((section, index) => {
      section.order = index
    })

    onSectionsChange(newSections)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile Builder</h2>
          <p className="text-muted-foreground">
            Drag and drop sections to customize your teacher profile layout
          </p>
        </div>
        <div className="flex space-x-2">
          {onPreview && (
            <Button variant="outline" onClick={onPreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Layout'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Available Sections
            </CardTitle>
            <CardDescription>
              Add these sections to your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {availableSections
              .filter(template => !sections.some(s => s.type === template.type))
              .map(template => {
                const Icon = sectionIcons[template.type]
                return (
                  <div
                    key={template.type}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleAddSection(template)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{template.title}</p>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
          </CardContent>
        </Card>

        {/* Profile Sections */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layout className="h-5 w-5 mr-2" />
              Profile Layout
            </CardTitle>
            <CardDescription>
              Drag sections to reorder, click to configure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedSections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sections added yet</p>
                <p className="text-sm">Add sections from the available sections panel</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedSections.map((section, index) => {
                  const Icon = sectionIcons[section.type]
                  return (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={() => handleDragStart(section)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, section)}
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-move transition-colors ${
                        section.visible ? 'bg-background' : 'bg-muted/30 opacity-60'
                      } ${draggedSection?.id === section.id ? 'opacity-50' : ''}`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{section.title}</h3>
                          <Badge className={sectionColors[section.type]}>
                            {section.type}
                          </Badge>
                          {!section.visible && (
                            <Badge variant="outline">Hidden</Badge>
                          )}
                        </div>
                        {section.description && (
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={section.visible}
                          onCheckedChange={() => handleToggleVisibility(section.id)}
                        />
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditSection(section)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                            >
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === sortedSections.length - 1}
                            >
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteSection(section.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Section Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Customize the appearance and behavior of this section
            </DialogDescription>
          </DialogHeader>
          
          {editingSection && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingSection.description || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="size">Size</Label>
                <Select
                  value={editingSection.size}
                  onValueChange={(value: any) => setEditingSection({ ...editingSection, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={editingSection.required}
                  onCheckedChange={(checked) => setEditingSection({ ...editingSection, required: checked })}
                />
                <Label htmlFor="required">Required Section</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
