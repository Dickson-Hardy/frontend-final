"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Building2, GraduationCap } from "lucide-react"

interface Author {
  title?: string
  firstName: string
  lastName: string
  email: string
  affiliation: string
}

interface AuthorCardsProps {
  authors: Author[]
  correspondingAuthorEmail?: string
}

export function AuthorCards({ authors, correspondingAuthorEmail }: AuthorCardsProps) {
  // If no corresponding author specified, use first author's email
  const defaultCorrespondingEmail = correspondingAuthorEmail || (authors.length > 0 ? authors[0].email : null)
  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border-blue-100 dark:border-blue-900">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-foreground">Authors</h2>
        </div>
        
        <div className="space-y-4">
          {authors.map((author, index) => {
            const isCorresponding = author.email === defaultCorrespondingEmail
            const fullName = [author.title, author.firstName, author.lastName]
              .filter(Boolean)
              .join(' ')
            
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 bg-white/60 dark:bg-gray-900/40 rounded-lg border border-blue-100/50 dark:border-blue-900/50 hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {author.firstName.charAt(0)}{author.lastName.charAt(0)}
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg leading-tight">
                        {fullName}
                      </h3>
                      {isCorresponding && (
                        <Badge variant="default" className="mt-1 text-xs bg-blue-600">
                          <Mail className="w-3 h-3 mr-1" />
                          Corresponding Author
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Affiliation */}
                  {author.affiliation && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="leading-relaxed">{author.affiliation}</span>
                    </div>
                  )}

                  {/* Email */}
                  {author.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 flex-shrink-0 text-blue-500" />
                      <a 
                        href={`mailto:${author.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        {author.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Author Number Badge */}
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    Author {index + 1}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {/* Author Count Summary */}
        <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900">
          <p className="text-sm text-muted-foreground text-center">
            {authors.length} {authors.length === 1 ? 'Author' : 'Authors'} contributed to this research
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
