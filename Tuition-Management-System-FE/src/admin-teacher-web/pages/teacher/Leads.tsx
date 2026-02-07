import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
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
  MoreVertical,
  Mail,
  Phone,
  MessageSquare,
  User,
  Calendar,
  UserPlus,
  Archive,
} from 'lucide-react'

// Placeholder data
const mockLeads = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    source: 'Website',
    interestedIn: 'Advanced Mathematics',
    status: 'NEW',
    notes: 'Interested in weekend batches',
    createdAt: '2024-02-06',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    source: 'Referral',
    interestedIn: 'Physics Fundamentals',
    status: 'CONTACTED',
    notes: 'Called once, will follow up',
    createdAt: '2024-02-05',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 76543 21098',
    source: 'Social Media',
    interestedIn: 'Advanced Mathematics',
    status: 'CONVERTED',
    notes: 'Enrolled in morning batch',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    phone: '+91 65432 10987',
    source: 'Website',
    interestedIn: 'Chemistry',
    status: 'LOST',
    notes: 'Budget constraints',
    createdAt: '2024-01-28',
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'NEW':
      return <Badge variant="info">New</Badge>
    case 'CONTACTED':
      return <Badge variant="warning">Contacted</Badge>
    case 'CONVERTED':
      return <Badge variant="success">Converted</Badge>
    case 'LOST':
      return <Badge variant="destructive">Lost</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function TeacherLeads() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.interestedIn.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && lead.status === activeTab.toUpperCase()
  })

  const newCount = mockLeads.filter((l) => l.status === 'NEW').length
  const contactedCount = mockLeads.filter((l) => l.status === 'CONTACTED').length
  const convertedCount = mockLeads.filter((l) => l.status === 'CONVERTED').length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage and track potential students</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Add a potential student to your pipeline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interested">Interested In</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional information..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddOpen(false)}>
                Add Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLeads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Phone className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{contactedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{convertedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>Manage your lead pipeline</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({mockLeads.length})</TabsTrigger>
              <TabsTrigger value="new">New ({newCount})</TabsTrigger>
              <TabsTrigger value="contacted">Contacted ({contactedCount})</TabsTrigger>
              <TabsTrigger value="converted">Converted ({convertedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Interested In</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No leads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                              <p className="text-sm text-muted-foreground">{lead.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>{lead.interestedIn}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.source}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Add Note
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-green-600">
                                  <User className="mr-2 h-4 w-4" />
                                  Convert to Student
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
