import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function MastheadPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Journal Masthead</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Complete information about AMHSJ's editorial structure, publication details, and leadership team.
          </p>
        </div>

        {/* Editor-in-Chief */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Editor-in-Chief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Prof Tubonye C Harry</h3>
                  <p className="text-muted-foreground">Editor-in-Chief</p>
                </div>
                <Badge variant="outline">Contact</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deputy Editor-in-Chief */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Deputy Editor-in-Chief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Dr Sylvester Izah</h3>
                  <p className="text-muted-foreground">Deputy Editor-in-Chief</p>
                </div>
                <Badge variant="outline">Contact</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Editors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Aloysius E Ligha</h3>
                <p className="text-muted-foreground">Editor</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Phillip D Eyimina</h3>
                <p className="text-muted-foreground">Editor</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Stephen Olali</h3>
                <p className="text-muted-foreground">Editor</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Mrs Gift Timighe</h3>
                <p className="text-muted-foreground">Editor</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Godwin Angaye</h3>
                <p className="text-muted-foreground">Editor</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Chinma Daokoru-Olukole</h3>
                <p className="text-muted-foreground">Editor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Editorial Advisory Board */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">International Editorial Advisory Board</CardTitle>
            <p className="text-muted-foreground">International experts contributing to our peer review process</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Dimie Ogoina</h3>
                <p className="text-muted-foreground">Yenagoa, Nigeria</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Tarila Tebepah</h3>
                <p className="text-muted-foreground">Yenagoa, Nigeria</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Samuel Dagogo-Jack</h3>
                <p className="text-muted-foreground">Tennessee, USA</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Usiakimi Igbaseimokumo</h3>
                <p className="text-muted-foreground">Texas, USA</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Bams Abila</h3>
                <p className="text-muted-foreground">London, UK</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Ebitimitula Etebu</h3>
                <p className="text-muted-foreground">Yenagoa, Nigeria</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Iheanyi Okpala</h3>
                <p className="text-muted-foreground">Enugu, Nigeria</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Edmund L C Ong</h3>
                <p className="text-muted-foreground">Newcastle-upon-Tyne, UK</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Matthew Ogwu</h3>
                <p className="text-muted-foreground">Boone, USA</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Prof Raul Delgado Wise</h3>
                <p className="text-muted-foreground">Zacatecas, Mexico</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Milan Hait</h3>
                <p className="text-muted-foreground">Chhattisgarh, India</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Muhammad Akram</h3>
                <p className="text-muted-foreground">Islamabad, Pakistan</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Dr Noble Kurian</h3>
                <p className="text-muted-foreground">Chennai, India</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Editor-in-Chief:</h3>
                <p className="text-muted-foreground">editor@amhsj.org</p>
                <p className="text-muted-foreground">+234 813 198 1600</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Address:</h3>
                <p className="text-muted-foreground">
                  Bayelsa Medical University,<br />
                  Yenagoa, Bayelsa State, Nigeria
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About AMHSJ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The Advances in Medicine & Health Sciences Journal (AMHSJ) is an international peer-reviewed journal 
                published by volumes. It disseminates high-quality research across all medical and health science 
                specialties from researchers worldwide.
              </p>
              <p className="text-muted-foreground">
                Content is published open access and immediately free to read and download.
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">CC BY-NC-ND 3.0</Badge>
                <span className="text-sm text-muted-foreground">
                  Except where otherwise noted, content is licensed under a Creative Commons Attribution-NonCommercial-NoDerivs 3.0 License.
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Bayelsa Medical University</strong> is the official publisher of AMHSJ.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
