import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
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
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  Upload,
  FileText,
  Video,
  Image,
  Link as LinkIcon,
  MoreVertical,
  Download,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
} from 'lucide-react'

// Placeholder data
const mockMaterials = [
  {
    id: '1',
    title: 'Calculus Notes - Chapter 1',
    description: 'Introduction to derivatives and limits',
    type: 'document',
    fileType: 'PDF',
    size: '2.4 MB',
    class: 'Advanced Mathematics',
    unit: 'Unit 1: Derivatives',
    uploadedAt: '2024-01-20',
    downloads: 45,
  },
  {
    id: '2',
    title: 'Introduction to Derivatives',
    description: 'Video lecture on basic derivative concepts',
    type: 'video',
    duration: '15:30',
    class: 'Advanced Mathematics',
    unit: 'Unit 1: Derivatives',
    uploadedAt: '2024-01-18',
    views: 120,
  },
  {
    id: '3',
    title: 'Practice Problems Set 1',
    description: 'Practice worksheet for derivatives',
    type: 'document',
    fileType: 'PDF',
    size: '1.1 MB',
    class: 'Advanced Mathematics',
    unit: 'Unit 1: Derivatives',
    uploadedAt: '2024-01-25',
    downloads: 38,
  },
  {
    id: '4',
    title: 'Physics Formulas Reference',
    description: 'Quick reference sheet for mechanics formulas',
    type: 'document',
    fileType: 'PDF',
    size: '0.8 MB',
    class: 'Physics Fundamentals',
    unit: 'Unit 2: Mechanics',
    uploadedAt: '2024-01-22',
    downloads: 62,
  },
  {
    id: '5',
    title: 'Khan Academy - Calculus',
    description: 'External resource for additional practice',
    type: 'link',
    url: 'https://khanacademy.org/calculus',
    class: 'Advanced Mathematics',
    unit: 'Unit 1: Derivatives',
    uploadedAt: '2024-01-15',
    clicks: 28,
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <FileText className="h-8 w-8 text-red-500" />
    case 'video':
      return <Video className="h-8 w-8 text-blue-500" />
    case 'image':
      return <Image className="h-8 w-8 text-green-500" />
    case 'link':
      return <LinkIcon className="h-8 w-8 text-purple-500" />
    default:
      return <FileText className="h-8 w-8 text-muted-foreground" />
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'document':
      return <Badge variant="outline">Document</Badge>
    case 'video':
      return <Badge variant="info">Video</Badge>
    case 'image':
      return <Badge variant="success">Image</Badge>
    case 'link':
      return <Badge variant="secondary">Link</Badge>
    default:
      return <Badge>{type}</Badge>
  }
}

export default function TeacherContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const filteredMaterials = mockMaterials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === 'all' || material.class === selectedClass
    const matchesType = selectedType === 'all' || material.type === selectedType
    return matchesSearch && matchesClass && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
          <p className="text-muted-foreground">Manage your teaching materials and resources</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Material</DialogTitle>
              <DialogDescription>
                Add new content to your library
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Material title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Advanced Mathematics</SelectItem>
                      <SelectItem value="2">Physics Fundamentals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Unit 1: Derivatives</SelectItem>
                      <SelectItem value="2">Unit 2: Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, PPT, MP4, or images up to 100MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsUploadOpen(false)}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Advanced Mathematics">Advanced Mathematics</SelectItem>
                <SelectItem value="Physics Fundamentals">Physics Fundamentals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="link">Links</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials grid */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No materials found</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first material to get started
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="flex flex-col">
              <CardContent className="pt-6 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getTypeIcon(material.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{material.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {material.description}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {getTypeBadge(material.type)}
                  <Badge variant="outline">{material.class}</Badge>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
                  <span>
                    {material.type === 'document' && material.size}
                    {material.type === 'video' && material.duration}
                    {material.type === 'link' && 'External'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
