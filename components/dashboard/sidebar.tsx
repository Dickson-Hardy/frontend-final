"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Settings, BarChart3, BookOpen, UserCheck, ClipboardList, MessageSquare, Bell, Home, ChevronLeft, ChevronRight, LogOut, User, Megaphone, Book, Upload, FolderOpen, Hash, Menu, X } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { logout, type UserRole } from "@/lib/auth"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

// Navigation items based on user role - this will be dynamic based on authentication
const getNavigationItems = (userRole: UserRole): NavItem[] => {
  const baseItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
  ]

  const roleSpecificItems: Record<UserRole, NavItem[]> = {
    author: [
      {
        title: "My Submissions",
        href: "/dashboard/submissions",
        icon: FileText,
        badge: "3",
        children: [
          {
            title: "Active Submissions",
            href: "/dashboard/submissions",
            icon: FileText,
          },
          {
            title: "New Submission",
            href: "/dashboard/submissions/new",
            icon: FileText,
          },
          {
            title: "Drafts",
            href: "/dashboard/submissions/drafts",
            icon: FileText,
            badge: "2",
          },
        ],
      },
      {
        title: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquare,
        badge: "2",
      },
    ],
    reviewer: [
      {
        title: "Review Assignments",
        href: "/dashboard/reviewer",
        icon: UserCheck,
        badge: "2",
      },
      {
        title: "Review History",
        href: "/dashboard/reviewer/history",
        icon: ClipboardList,
      },
      {
        title: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquare,
        badge: "3",
      },
    ],
    editorial_assistant: [
      {
        title: "Editorial Queue",
        href: "/dashboard/editorial",
        icon: BookOpen,
        badge: "8",
      },
      {
        title: "Quality Review",
        href: "/dashboard/editorial/quality",
        icon: UserCheck,
      },
      {
        title: "Statistics",
        href: "/dashboard/editorial/statistics",
        icon: BarChart3,
      },
    ],
    associate_editor: [
      {
        title: "Assigned Submissions",
        href: "/dashboard/associate-editor",
        icon: FileText,
        badge: "15",
      },
      {
        title: "Reviewer Management",
        href: "/dashboard/associate-editor/reviewers",
        icon: Users,
      },
      {
        title: "Editorial Decisions",
        href: "/dashboard/associate-editor/decisions",
        icon: ClipboardList,
      },
    ],
    editor_in_chief: [
      {
        title: "Editorial Overview",
        href: "/dashboard/editor-in-chief",
        icon: BarChart3,
        badge: "23",
      },
      {
        title: "Final Decisions",
        href: "/dashboard/editor-in-chief/decisions",
        icon: UserCheck,
      },
      {
        title: "Editorial Board",
        href: "/dashboard/editor-in-chief/board",
        icon: Users,
      },
      {
        title: "Journal Analytics",
        href: "/dashboard/editor-in-chief/analytics",
        icon: BarChart3,
      },
    ],
    admin: [
      {
        title: "System Overview",
        href: "/dashboard/admin",
        icon: BarChart3,
      },
      {
        title: "Volume Management",
        href: "/dashboard/admin/volumes",
        icon: Book,
        children: [
          {
            title: "All Volumes",
            href: "/dashboard/admin/volumes",
            icon: Book,
          },
          {
            title: "Create Volume",
            href: "/dashboard/admin/volumes/create",
            icon: Book,
          },
          {
            title: "Manage Issues",
            href: "/dashboard/admin/volumes/issues",
            icon: FolderOpen,
          },
        ],
      },
      {
        title: "Content Management",
        href: "/dashboard/admin/content",
        icon: Upload,
        children: [
          {
            title: "Upload Articles",
            href: "/dashboard/admin/content/upload",
            icon: Upload,
          },
          {
            title: "Assign Article Numbers",
            href: "/dashboard/admin/content/article-numbers",
            icon: Hash,
          },
          {
            title: "Manage News",
            href: "/dashboard/admin/content/news",
            icon: Megaphone,
          },
          {
            title: "Announcements",
            href: "/dashboard/admin/content/announcements",
            icon: Bell,
          },
        ],
      },
      {
        title: "User Management",
        href: "/dashboard/admin/users",
        icon: Users,
      },
      {
        title: "System Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
  }

  return [
    ...baseItems,
    ...roleSpecificItems[userRole],
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: "7",
    },
  ]
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const navigationItems = user ? getNavigationItems(user.role) : []

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]))
  }

  const handleLogout = () => {
    logout()
  }

  // Get primary navigation items for mobile bottom nav (limit to 4-5 most important)
  const getPrimaryNavItems = (): NavItem[] => {
    const items = navigationItems.slice(0, 5)
    return items
  }

  const primaryNavItems = getPrimaryNavItems()

  const renderNavItem = (item: NavItem, level = 0, inMobileSheet = false) => {
    const isActive = pathname === item.href
    const isExpanded = expandedItems.includes(item.href)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.href}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
            level > 0 && "ml-4",
            collapsed && !inMobileSheet && "justify-center px-2",
          )}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpanded(item.href)} className="flex items-center gap-3 flex-1 text-left">
              <item.icon className="h-4 w-4 shrink-0" />
              {(!collapsed || inMobileSheet) && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                  {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </button>
          ) : (
            <Link 
              href={item.href} 
              className="flex items-center gap-3 flex-1"
              onClick={() => inMobileSheet && setMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {(!collapsed || inMobileSheet) && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (!collapsed || inMobileSheet) && (
          <div className="mt-1 space-y-1">{item.children?.map((child) => renderNavItem(child, level + 1, inMobileSheet))}</div>
        )}
      </div>
    )
  }

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border">
          <nav className="flex items-center justify-around px-2 py-2 safe-area-bottom">
            {primaryNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-none">{item.title}</span>
                </Link>
              )
            })}
            
            {/* More Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px] text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                  <Menu className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-none">More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="AMHSJ Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <h2 className="text-sm font-semibold">AMHSJ Dashboard</h2>
                      <p className="text-xs text-muted-foreground">
                        {user ? `${user.firstName} ${user.lastName}` : "User"}
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(85vh-120px)] mt-4">
                  <nav className="space-y-1 px-2">
                    {navigationItems.map((item) => renderNavItem(item, 0, true))}
                  </nav>

                  {/* User Actions in Sheet */}
                  <div className="border-t border-border mt-4 pt-4 px-2 space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive" 
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="AMHSJ Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain bg-sidebar-primary rounded-lg p-1"
            />
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">AMHSJ</h2>
              <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">{navigationItems.map((item) => renderNavItem(item, 0, false))}</nav>
      </ScrollArea>

      {/* User Profile & Settings */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent">
              <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Role"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full p-2">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-2">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}



