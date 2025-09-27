"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">AMHSJ</h1>
              <p className="text-xs text-muted-foreground -mt-1">Medical Research Journal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors">
              Articles
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/editorial-board" className="text-muted-foreground hover:text-primary transition-colors">
              Editorial Board
            </Link>
            <Link href="/masthead" className="text-muted-foreground hover:text-primary transition-colors">
              Masthead
            </Link>
            <Link href="/guidelines" className="text-muted-foreground hover:text-primary transition-colors">
              Guidelines
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Submit</Button>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/articles" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Articles
              </Link>
              <Link href="/about" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link href="/editorial-board" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Editorial Board
              </Link>
              <Link href="/masthead" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Masthead
              </Link>
              <Link href="/guidelines" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Guidelines
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                Contact
              </Link>
              <div className="border-t border-border pt-2 mt-2">
                <Link href="/auth/login" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-3 py-2 text-primary hover:text-primary/80">
                  Submit Research
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
