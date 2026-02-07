import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { Separator } from '@/shared/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import {
  Globe,
  Eye,
  Save,
  Palette,
  Layout,
  MessageSquare,
  Share2,
  Copy,
  ExternalLink,
  GripVertical,
} from 'lucide-react'

// Placeholder website sections
const sections = [
  { id: 'hero', name: 'Hero Section', enabled: true },
  { id: 'about', name: 'About Me', enabled: true },
  { id: 'classes', name: 'Classes', enabled: true },
  { id: 'schedule', name: 'Schedule', enabled: true },
  { id: 'testimonials', name: 'Testimonials', enabled: true },
  { id: 'faq', name: 'FAQ', enabled: false },
  { id: 'contact', name: 'Contact', enabled: true },
]

export default function TeacherWebsite() {
  const [websiteEnabled, setWebsiteEnabled] = useState(true)
  const [customDomain, setCustomDomain] = useState('')
  
  const websiteUrl = 'https://johnsmith.tuition.com'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Public Website</h1>
          <p className="text-muted-foreground">Customize your public-facing website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </a>
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Website URL card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Your Website</p>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {websiteUrl}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={websiteEnabled}
                  onCheckedChange={setWebsiteEnabled}
                />
                <Label>{websiteEnabled ? 'Published' : 'Draft'}</Label>
              </div>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">
            <Layout className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="design">
            <Palette className="mr-2 h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="ai-chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Share2 className="mr-2 h-4 w-4" />
            SEO & Sharing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sections list */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Sections</CardTitle>
                <CardDescription>
                  Drag to reorder, toggle to enable/disable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-move"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span>{section.name}</span>
                      </div>
                      <Switch defaultChecked={section.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section content editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  The first thing visitors see on your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    defaultValue="Learn Mathematics from an Expert"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subheadline">Subheadline</Label>
                  <Textarea
                    id="subheadline"
                    defaultValue="10+ years of experience teaching calculus, algebra, and more. Join thousands of successful students."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaText">Call to Action Text</Label>
                  <Input id="ctaText" defaultValue="Enroll Now" />
                </div>
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Design Settings</CardTitle>
              <CardDescription>Customize the look and feel of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input id="primaryColor" type="color" defaultValue="#3b82f6" className="w-20" />
                    <Input defaultValue="#3b82f6" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input id="secondaryColor" type="color" defaultValue="#8b5cf6" className="w-20" />
                    <Input defaultValue="#8b5cf6" className="flex-1" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Font Family</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  {['Inter', 'Poppins', 'Roboto'].map((font) => (
                    <div
                      key={font}
                      className="p-4 rounded-lg border cursor-pointer hover:border-primary"
                    >
                      <p style={{ fontFamily: font }} className="text-lg font-semibold">
                        {font}
                      </p>
                      <p style={{ fontFamily: font }} className="text-sm text-muted-foreground">
                        The quick brown fox
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Theme Presets</Label>
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { name: 'Modern', colors: ['#3b82f6', '#1e40af'] },
                    { name: 'Warm', colors: ['#f59e0b', '#b45309'] },
                    { name: 'Cool', colors: ['#06b6d4', '#0891b2'] },
                    { name: 'Professional', colors: ['#6366f1', '#4f46e5'] },
                  ].map((preset) => (
                    <div
                      key={preset.name}
                      className="p-4 rounded-lg border cursor-pointer hover:border-primary"
                    >
                      <div className="flex gap-2 mb-2">
                        {preset.colors.map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium">{preset.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-chat">
          <Card>
            <CardHeader>
              <CardTitle>AI Chat Widget</CardTitle>
              <CardDescription>
                Let AI answer common questions from potential students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable AI Chat</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow visitors to chat with an AI assistant
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  defaultValue="Hi! 👋 I'm here to help answer your questions about our classes. How can I assist you today?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiContext">AI Context (what should the AI know?)</Label>
                <Textarea
                  id="aiContext"
                  placeholder="Describe your teaching style, class schedules, pricing, and any other relevant information..."
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  This information helps the AI provide accurate answers to visitors
                </p>
              </div>

              <div className="space-y-4">
                <Label>Common Questions</Label>
                <div className="space-y-2">
                  {[
                    'What subjects do you teach?',
                    'What are your class timings?',
                    'How much do the classes cost?',
                    'Do you offer trial classes?',
                  ].map((question, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{question}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline">
                  + Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Social Sharing</CardTitle>
              <CardDescription>
                Optimize how your website appears in search results and social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  defaultValue="John Smith - Expert Mathematics Tutor"
                />
                <p className="text-xs text-muted-foreground">60 characters recommended</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  defaultValue="Learn mathematics from an experienced tutor with 10+ years of teaching. Expert in calculus, algebra, and competitive exam preparation."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">160 characters recommended</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <div className="flex gap-2">
                  <Input
                    id="customDomain"
                    placeholder="www.yourdomain.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                  <Button variant="outline">Connect</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Point your domain to our servers to use a custom URL
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Social Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="aspect-video bg-muted rounded mb-2" />
                  <p className="font-medium">John Smith - Expert Mathematics Tutor</p>
                  <p className="text-sm text-muted-foreground">
                    Learn mathematics from an experienced tutor...
                  </p>
                  <p className="text-xs text-primary mt-1">johnsmith.tuition.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
