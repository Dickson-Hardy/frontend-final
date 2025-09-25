"use client"

import { ArticleNumberAssignment } from "@/components/admin/article-number-assignment"

export default function ArticleNumbersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assign Article Numbers</h1>
        <p className="text-muted-foreground mt-2">
          Assign unique article numbers to published articles for SEO-friendly URLs
        </p>
      </div>

      {/* Article Number Assignment Component */}
      <ArticleNumberAssignment />
    </div>
  )
}
