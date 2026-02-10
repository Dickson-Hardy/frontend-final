"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Globe, 
  Users, 
  Shield, 
  CheckCircle, 
  Award, 
  Clock, 
  FileText, 
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Heart,
  Brain,
  Microscope,
  Stethoscope,
  Pill,
  Activity
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground">About the Journal</h1>
                <p className="text-lg text-muted-foreground mt-2">Advances in Medicine & Health Sciences Journal</p>
                <p className="text-sm text-muted-foreground">The Official Journal of Bayelsa Medical University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Advances in Medicine and Health Sciences Journal (AMHSJ) is an international, peer-reviewed, 
                open-access journal committed to the advancement and dissemination of scholarly knowledge across 
                the expansive field of medicine and health sciences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The journal serves as a dynamic platform for the exchange of high-quality scientific findings that 
                shape clinical practice, influence health policy, and drive innovation in health systems worldwide.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to foster evidence-based practice, encourage interdisciplinary research, and enhance 
                public health outcomes by publishing robust, impactful studies. AMHSJ is devoted to promoting 
                scientific dialogue among researchers, academicians, healthcare providers, policymakers, and students 
                through the publication of original research articles, systematic reviews, clinical case reports, 
                brief communications, editorials, book reviews, and commentaries.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Scope of the Journal */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Scope of the Journal</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
            AMHSJ welcomes submissions that span the entire spectrum of medicine and health sciences. 
            Topics of interest include, but are not limited to:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Medicine and Clinical Sciences */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Medicine & Clinical Sciences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• General and Internal Medicine</li>
                  <li>• Surgery and Surgical Specialties</li>
                  <li>• Family and Community Medicine</li>
                  <li>• Pediatrics and Adolescent Health</li>
                  <li>• Obstetrics and Gynecology</li>
                  <li>• Psychiatry and Mental Health</li>
                  <li>• Emergency and Critical Care</li>
                  <li>• Infectious Diseases</li>
                  <li>• Chronic Diseases</li>
                  <li>• Geriatric Care</li>
                </ul>
              </CardContent>
            </Card>

            {/* Public Health */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Public Health & Allied Sciences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Public and Community Health</li>
                  <li>• Epidemiology and Biostatistics</li>
                  <li>• Environmental Health</li>
                  <li>• Health Promotion</li>
                  <li>• Global Health Systems</li>
                  <li>• Disaster Medicine</li>
                  <li>• Social Determinants of Health</li>
                  <li>• Healthcare Management</li>
                  <li>• Health Economics</li>
                  <li>• Digital Health</li>
                </ul>
              </CardContent>
            </Card>

            {/* Nursing & Pharmacy */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Nursing, Pharmacy & Rehabilitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nursing Science and Midwifery</li>
                  <li>• Clinical Pharmacy</li>
                  <li>• Pharmacology and Toxicology</li>
                  <li>• Physiotherapy</li>
                  <li>• Rehabilitation Sciences</li>
                  <li>• Complementary Medicine</li>
                  <li>• Drug Development</li>
                  <li>• Biomedical Engineering</li>
                  <li>• Assistive Technology</li>
                  <li>• Therapeutics</li>
                </ul>
              </CardContent>
            </Card>

            {/* Biomedical Sciences */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-primary" />
                  Biomedical & Life Sciences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Anatomy and Physiology</li>
                  <li>• Biochemistry and Molecular Biology</li>
                  <li>• Microbiology and Immunology</li>
                  <li>• Genetics and Genomics</li>
                  <li>• Cancer Biology</li>
                  <li>• Neurosciences</li>
                  <li>• Biotechnology</li>
                  <li>• Medical Laboratory Science</li>
                  <li>• Molecular Diagnostics</li>
                  <li>• Developmental Biology</li>
                </ul>
              </CardContent>
            </Card>

            {/* Nutrition & Food Science */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Nutrition & Food Science
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Human Nutrition and Dietetics</li>
                  <li>• Public Health Nutrition</li>
                  <li>• Food Safety</li>
                  <li>• Nutritional Epidemiology</li>
                  <li>• Agriculture and Food Security</li>
                  <li>• Veterinary Public Health</li>
                  <li>• Food Science</li>
                  <li>• Nutritional Biochemistry</li>
                  <li>• Clinical Nutrition</li>
                  <li>• Community Nutrition</li>
                </ul>
              </CardContent>
            </Card>

            {/* Interdisciplinary Fields */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Interdisciplinary & Emerging Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Scientific Ethics</li>
                  <li>• Research Integrity</li>
                  <li>• Climate Change and Health</li>
                  <li>• Population Health</li>
                  <li>• Health Policy Innovation</li>
                  <li>• Precision Medicine</li>
                  <li>• Translational Research</li>
                  <li>• AI in Medicine</li>
                  <li>• Telemedicine</li>
                  <li>• Health Informatics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Journal Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Journal Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Publication Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Title:</span>
                  <span className="text-muted-foreground">Advances in Medicine & Health Sciences Journal (AMHSJ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ISSN:</span>
                  <span className="text-muted-foreground">XXXX-XXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Language:</span>
                  <span className="text-muted-foreground">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Frequency:</span>
                  <span className="text-muted-foreground">Published by volumes (continuous publishing)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Review Process:</span>
                  <span className="text-muted-foreground">Double-blind peer review</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Review Timeline:</span>
                  <span className="text-muted-foreground">Typically within 4 weeks</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Policies & Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Open Access:</span>
                  <span className="text-muted-foreground">Fully open-access</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Licensing:</span>
                  <span className="text-muted-foreground">CC BY-NC-ND</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ethics:</span>
                  <span className="text-muted-foreground">COPE guidelines</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">APCs:</span>
                  <span className="text-muted-foreground">No charges</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Publisher:</span>
                  <span className="text-muted-foreground">Bayelsa Medical University</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Open Access Policy */}
        <section className="mb-16">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Open Access Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Advances in Medicine and Health Sciences Journal (AMHSJ) operates under a fully open-access 
                publishing model, ensuring that all published articles are immediately and permanently available 
                online without any subscription or access fees. This policy aligns with our mission to democratize 
                scientific knowledge and facilitate unrestricted global access to current research in medicine and health sciences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Under the terms of the Creative Commons Attribution-NonCommercial-NoDerivs 3.0 License (CC BY-NC-ND 3.0), 
                readers may read, download, copy, distribute, print, search, and link to the full text, provided proper 
                credit is given, the work is not altered, and it is not used commercially.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Benefits to Authors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Benefits to Authors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Rapid Review", description: "Fair peer review leading to timely publication" },
              { icon: Award, title: "Free Publication", description: "No Article Processing Charges (APCs)" },
              { icon: Globe, title: "Global Visibility", description: "Open-access indexing and digital dissemination" },
              { icon: Users, title: "Enhanced Reach", description: "Social media promotion and citation potential" },
              { icon: FileText, title: "Free Copies", description: "PDF and hard copies provided free of charge" },
              { icon: GraduationCap, title: "Recognition", description: "Opportunities for scholarly collaboration" }
            ].map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ethical Standards */}
        <section className="mb-16">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-red-800">
                <Shield className="w-6 h-6" />
                Ethical Standards and Publication Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    All manuscripts must contain original, unpublished content and demonstrate at least 80% text uniqueness, 
                    especially in the Results and Conclusion sections. Furthermore single source similarity should not be greater than 3%.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Plagiarized content or manuscripts with substantial overlap (&gt;20 and &lt;30% similarity) from previously 
                    published work will be returned for revision. A manuscript with more than 30% similarity will be rejected outright.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    The journal ensures the confidentiality and objectivity of the peer review process. Reviewers are selected based on 
                    their subject-matter expertise and must declare any potential conflicts of interest before reviewing submissions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Authors are expected to disclose any conflicts of interest, funding sources, and ethical approval for studies 
                    involving human or animal subjects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Editorial Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">editor@amhsj.org</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="text-muted-foreground">
                    <p>Bayelsa Medical University</p>
                    <p>Yenagoa, Bayelsa State</p>
                    <p>Nigeria</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Editorial Leadership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The journal is guided by an international editorial and advisory structure including specialist 
                  and international advisors who support methodological rigor and global relevance.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Featured International Advisory Member:</strong> Dr. Edmund L. C. Ong, 
                    Honorary Professor of Medicine & Consultant in Infectious Diseases (Newcastle University Medicine Malaysia) 
                    – global advisor with extensive HIV, TB and dengue research leadership across Africa and Asia.
                  </p>
                </div>
                <Link href="/editorial-board" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-4">
                  View Full Editorial Board
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Submit Your Research?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join the global community of researchers contributing to advances in medicine and health. 
            Submit your original research, reviews, or case studies to AMHSJ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                <FileText className="w-5 h-5" />
                Submit Research Paper
              </Button>
            </Link>
            <Link href="/guidelines">
              <Button variant="outline" size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                View Guidelines
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}


