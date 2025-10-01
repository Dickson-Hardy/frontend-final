"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide navigation and footer on dashboard pages
  const isDashboardPage = pathname?.startsWith("/dashboard")
  
  return (
    <>
      {!isDashboardPage && <Navigation />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isDashboardPage && <Footer />}
    </>
  )
}
