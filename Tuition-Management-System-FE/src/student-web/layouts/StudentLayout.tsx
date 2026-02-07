import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useAuth } from '@/shared/hooks/useAuth'
import { getInitials, cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
  User,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Settings,
  ChevronRight,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'Browse Classes', href: '/student/classes', icon: BookOpen },
  { name: 'My Classes', href: '/student/my-classes', icon: GraduationCap },
  { name: 'Teachers', href: '/student/teachers', icon: Users },
  { name: 'Messages', href: '/student/messages', icon: MessageSquare },
  { name: 'Profile', href: '/student/profile', icon: User },
]

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link to="/student/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Student</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/student/dashboard' && location.pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{getInitials(user?.name || 'Student')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Student Portal</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {navigation.find((nav) => 
                location.pathname === nav.href || 
                (nav.href !== '/student/dashboard' && location.pathname.startsWith(nav.href))
              )?.name || 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{getInitials(user?.name || 'Student')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'Student'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/student/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
