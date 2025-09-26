"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Download, Eye, Users, Building, Loader2 } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"
import { Volume } from "@/lib/api"

export default function VolumesPage() {
  const { data: volumes, isLoading, error } = useApi('/volumes')

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "planned":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Journal Volumes</h1>
        <p className="text-muted-foreground mt-2">Browse our published volumes and issues</p>
      </div>

      {/* Volumes List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading volumes</p>
          </div>
        ) : volumes?.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No volumes found</p>
          </div>
        ) : (
          volumes?.map((volume: Volume) => (
            <Card key={volume._id}>
              <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Volume Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold text-foreground">Volume {volume.volume}</h2>
                      <Badge className={getStatusColor(volume.status)}>
                        {volume.status}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-medium text-foreground mb-2">{volume.title}</h3>
                    <p className="text-muted-foreground mb-4">{volume.description}</p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Published: {volume.publishDate ? new Date(volume.publishDate).toLocaleDateString() : 'Not published'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{volume.articles?.length || 0} articles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Editor: {volume.editor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{volume.pages} pages</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Volume
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                {/* Articles in this Volume */}
                <div>
                  <h4 className="font-medium mb-3">Articles in this Volume</h4>
                  <div className="space-y-2">
                    {volume.articles?.map((articleId: string) => (
                      <div key={articleId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">Article {articleId}</h5>
                          <p className="text-xs text-muted-foreground">Article ID: {articleId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Article ID: {articleId}</span>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Archive Notice */}
      <Card>
        <CardHeader>
          <CardTitle>Archive Access</CardTitle>
          <CardDescription>Access to older volumes and issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Archive Access</h3>
            <p className="text-muted-foreground mb-4">
              Access to volumes from previous years is available through our archive system.
            </p>
            <Button variant="outline">
              Browse Archive
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
