"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, MapPin, GraduationCap, Award, Globe } from "lucide-react"

export default function EditorialBoardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Editorial & Advisory Board
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AMHSJ maintains a structured editorial and international advisory framework to ensure rigorous, 
              ethical and contextually relevant peer review. Profiles will be updated with full credentials, 
              affiliations and ORCID identifiers as they are confirmed.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Editor-in-Chief */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Editor-in-Chief</h2>
          <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Prof. I.A. Ibrahim</CardTitle>
                    <Badge variant="secondary" className="mt-1">Editor-in-Chief</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Affiliation forthcoming</p>
                <p className="text-muted-foreground mt-2">Biography forthcoming.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Deputy Editor-in-Chief */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Deputy Editor-in-Chief</h2>
          <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Dr. Sylvester Izah</CardTitle>
                    <Badge variant="secondary" className="mt-1">Deputy Editor-in-Chief</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Affiliation forthcoming</p>
                <p className="text-muted-foreground mt-2">Biography forthcoming.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Editors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Editors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Prof. Aloysius E. Ligha", role: "Editor" },
              { name: "Prof. Phillip D. Eyimina", role: "Editor" },
              { name: "Prof. Stephen Olali", role: "Editor" },
              { name: "Dr. Gift Timighe", role: "Editor" },
              { name: "Dr. Godwin Angaye", role: "Editor" },
              { name: "Dr. Chinma Daokoru-Olukole", role: "Editor" }
            ].map((editor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{editor.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">{editor.role}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Affiliation forthcoming</p>
                  <p className="text-muted-foreground text-sm mt-1">Biography forthcoming.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* International Editorial Advisory Board */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">International Editorial Advisory Board</h2>
          
          {/* Featured Member */}
          <div className="mb-12">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">Dr. Edmund L. C. Ong</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">MBBS, MSc, FRCP, FRCPI, DTMH</Badge>
                      <Badge variant="outline">Honorary Professor of Medicine</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Faculty of Medical Sciences, Newcastle University Medicine Malaysia</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <span>ORCID: 0000-0002-6594-0509</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    Dr Edmund L C Ong graduated from the University of Newcastle Medical School, UK and trained in 
                    Infectious Diseases, Tropical Medicine and General Internal Medicine. His research interests span 
                    opportunistic infections, evaluation of anti-infective agents, clinical epidemiology, and innovations 
                    in healthcare quality improvement and clinical audit. He serves as principal investigator or collaborator 
                    on research in HIV, Tuberculosis, and dengue fever across Nigeria, South Africa, Myanmar and Malaysia. 
                    Dr Ong has contributed to numerous textbooks on infection and co-authored more than 160 papers in 
                    peer-reviewed journals. He is an examiner for MRCP, Diploma in HIV Medicine, and MMed qualifications, 
                    and serves as International Global Advisor (Malaysia) for the Royal College of Physicians (London). 
                    He is a member and former Chairperson of the British HIV Association Audit and Standard of Care Committee.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Research Interests:</h4>
                  <p className="text-muted-foreground">
                    Opportunistic infections; Anti-infective evaluation; Clinical epidemiology; Healthcare quality improvement; 
                    Clinical audit; HIV; Tuberculosis; Dengue.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Achievements:</h4>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Principal Investigator & collaborator in multinational infectious disease studies</li>
                    <li>• International Global Advisor (Malaysia) – Royal College of Physicians (London)</li>
                    <li>• Former Chair – British HIV Association Audit & Standards of Care Committee</li>
                    <li>• Undergraduate & postgraduate examiner (MRCP, Dip HIV Med, MMed)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Research Locations:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Nigeria", "South Africa", "Myanmar", "Malaysia"].map((location) => (
                      <Badge key={location} variant="outline" className="text-xs">{location}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Advisory Board Members */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Prof. Dimie Ogoina", location: "Yenagoa, Nigeria" },
              { name: "Prof. Tarila Tebepah", location: "Yenagoa, Nigeria" },
              { name: "Prof. Samuel Dagogo-Jack", location: "Tennessee, USA" },
              { name: "Prof. Usiakimi Igbaseimokumo", location: "Texas, USA" },
              { name: "Prof. Bams Abila", location: "London, UK" },
              { name: "Prof. Ebitimitula Etebu", location: "Yenagoa, Nigeria" },
              { name: "Prof. Iheanyi Okpala", location: "Enugu, Nigeria" },
              { name: "Dr. Matthew Ogwu", location: "Boone, USA" },
              { name: "Prof. Raul Delgado Wise", location: "Zacatecas, Mexico" },
              { name: "Dr. Milan Hait", location: "Chhattisgarh, India" },
              { name: "Dr. Muhammad Akram", location: "Islamabad, Pakistan" },
              { name: "Dr. Noble Kurian", location: "Chennai, India" }
            ].map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">International Editorial Advisory Board Member</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">Biography forthcoming.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">Join Our Editorial Team</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We are always looking for qualified professionals to join our editorial and advisory board. 
            If you are interested in contributing to medical research and peer review, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="/guidelines" 
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary/10 transition-colors"
            >
              View Guidelines
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
