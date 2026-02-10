import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="AMHSJ Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain bg-primary-foreground rounded-full p-1"
              />
              <div>
                <h3 className="text-lg font-semibold">AMHSJ</h3>
                <p className="text-xs text-primary-foreground/80">Medical Research Journal</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed text-pretty">
              Advancing medical research and healthcare innovation through peer-reviewed excellence and global
              collaboration.
            </p>
            <div className="flex space-x-3">
              <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Twitter className="w-4 h-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href={siteConfig.links.linkedin} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href={siteConfig.links.facebook} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Facebook className="w-4 h-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              {siteConfig.footerNav.quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <div className="space-y-2 text-sm">
              {siteConfig.footerNav.resources.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/80 text-pretty">
              Subscribe to receive notifications about new articles and journal updates.
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20 mb-8" />

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-4 h-4 text-primary-foreground/60" />
            <span className="text-primary-foreground/80">editor@AMHSJ.org</span>
          </div>
          {/* <div className="flex items-center space-x-3 text-sm">
            <Phone className="w-4 h-4 text-primary-foreground/60" />
            <span className="text-primary-foreground/80">+234 813 198 1600</span>
          </div> */}
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-primary-foreground/60" />
            <span className="text-primary-foreground/80">Bayelsa Medical University, Nigeria</span>
          </div>
        </div>

        <Separator className="bg-primary-foreground/20 mb-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/60">
          <p>© 2025 Advances in Medicine and Health Sciences Journal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {siteConfig.footerNav.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-primary-foreground transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}



