import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Search, Shield, UserCheck, UserX, Settings } from 'lucide-react'

// Placeholder data
const mockAuditLogs = [
  {
    id: '1',
    admin: 'Admin User',
    action: 'APPROVE_TEACHER',
    targetType: 'TEACHER',
    targetId: 'teacher-1',
    description: 'Approved teacher application for John Smith',
    timestamp: '2024-02-06T10:30:00Z',
  },
  {
    id: '2',
    admin: 'Admin User',
    action: 'REJECT_TEACHER',
    targetType: 'TEACHER',
    targetId: 'teacher-2',
    description: 'Rejected teacher application for Mike Wilson',
    timestamp: '2024-02-06T09:15:00Z',
  },
  {
    id: '3',
    admin: 'Admin User',
    action: 'UPDATE_SETTINGS',
    targetType: 'SETTING',
    targetId: 'general',
    description: 'Updated platform general settings',
    timestamp: '2024-02-05T16:45:00Z',
  },
  {
    id: '4',
    admin: 'Admin User',
    action: 'SUSPEND_USER',
    targetType: 'STUDENT',
    targetId: 'student-3',
    description: 'Suspended student Carol Evans',
    timestamp: '2024-02-05T14:20:00Z',
  },
]

const getActionIcon = (action: string) => {
  if (action.includes('APPROVE')) return <UserCheck className="h-4 w-4 text-green-600" />
  if (action.includes('REJECT') || action.includes('SUSPEND')) return <UserX className="h-4 w-4 text-red-600" />
  if (action.includes('SETTINGS')) return <Settings className="h-4 w-4 text-blue-600" />
  return <Shield className="h-4 w-4 text-muted-foreground" />
}

const getActionBadge = (action: string) => {
  if (action.includes('APPROVE')) return <Badge variant="success">Approve</Badge>
  if (action.includes('REJECT')) return <Badge variant="destructive">Reject</Badge>
  if (action.includes('SUSPEND')) return <Badge variant="warning">Suspend</Badge>
  if (action.includes('UPDATE')) return <Badge variant="info">Update</Badge>
  return <Badge variant="outline">{action}</Badge>
}

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (actionFilter === 'all') return matchesSearch
    return matchesSearch && log.action.includes(actionFilter.toUpperCase())
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Review administrative actions and changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Track all admin actions</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="approve">Approvals</SelectItem>
                  <SelectItem value="reject">Rejections</SelectItem>
                  <SelectItem value="update">Updates</SelectItem>
                  <SelectItem value="suspend">Suspensions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{getActionIcon(log.action)}</TableCell>
                      <TableCell className="font-medium">{log.admin}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{log.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.targetType}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
