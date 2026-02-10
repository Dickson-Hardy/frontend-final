"use client"

import { Bell, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"

export function Header() {
  const isMobile = useIsMobile()

  return (
    <header className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-background border-b border-border">
      {/* Search - Hidden on mobile, visible on tablet+ */}
      <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search submissions, reviews, authors..." className="pl-10" />
        </div>
      </div>

      {/* Mobile: Show title/logo on the left */}
      <div className="sm:hidden flex items-center gap-2">
        <h1 className="text-lg font-semibold">AMHSJ</h1>
      </div>

      {/* Mobile: Search Icon Button */}
      <div className="sm:hidden flex-1 flex justify-center">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-[10px] md:text-xs"
              >
                7
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-w-sm">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">New submission received</p>
                <p className="text-xs text-muted-foreground">"Impact of AI in Medical Diagnosis" - 2 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Review deadline approaching</p>
                <p className="text-xs text-muted-foreground">Review due in 2 days - 1 hour ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Editorial decision made</p>
                <p className="text-xs text-muted-foreground">
                  "Cardiovascular Research Methods" accepted - 3 hours ago
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu - Hidden on mobile (user can access via bottom nav More menu) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium">Dr. John Smith</p>
                <p className="text-xs text-muted-foreground">Associate Editor</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}



