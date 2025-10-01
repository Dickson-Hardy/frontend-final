"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  FileText, 
  FileCheck, 
  Settings, 
  HelpCircle,
  Send,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Building,
  Globe,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inquiryType, setInquiryType] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you within 24-48 hours.",
      })

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()
      setInquiryType("")
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Contact AMHSJ</h1>
                <p className="text-lg text-muted-foreground mt-2">Advances in Medicine & Health Sciences Journal</p>
                <p className="text-sm text-muted-foreground">The Official Journal of Bayelsa Medical University</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Get in touch with our editorial team. We're here to support authors, reviewers, and the global 
              medical research community.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Editorial Office
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-primary">editor@amhsj.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-primary">submissions@amhsj.org</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">For editorial inquiries and submissions</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">+234 813 198 1600</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Monday - Friday, 9:00 AM - 5:00 PM WAT</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Mailing Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1 text-sm">
                <p className="font-medium">AMHSJ Editorial Office</p>
                <p>Bayelsa Medical University</p>
                <p>Yenagoa, Bayelsa State</p>
                <p>Nigeria</p>
              </div>
              <p className="text-xs text-muted-foreground">Physical correspondence address</p>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Information */}
        <Card className="mb-12 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <Badge variant="secondary">24-48 hours</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Submissions:</span>
                  <Badge variant="secondary">5-7 days</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Typical response timeframes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Send us a Message</h2>
          <p className="text-muted-foreground text-center mb-8">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Contact Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="Enter your first name" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Enter your last name" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email address" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Affiliation</Label>
                  <Input 
                    id="affiliation" 
                    name="affiliation"
                    placeholder="Your institution or organization" 
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType">Inquiry Type *</Label>
                  <Select 
                    value={inquiryType} 
                    onValueChange={setInquiryType}
                    disabled={isSubmitting}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submission">Manuscript Submission</SelectItem>
                      <SelectItem value="review">Peer Review Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="media">Media Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    name="subject"
                    placeholder="Brief subject of your inquiry" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder="Please provide details about your inquiry..." 
                    rows={6}
                    required 
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-16" />

        {/* Department Contacts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Department Contacts</h2>
          <p className="text-muted-foreground text-center mb-8">
            For specific inquiries, contact the appropriate department directly for faster assistance.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Submissions & Manuscripts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Article submissions, revision requests, publication status
                </p>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-primary">submissions@amhsj.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Peer Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Reviewer assignments, review process, editorial decisions
                </p>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-primary">review@amhsj.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Website issues, account problems, submission platform
                </p>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-primary">support@amhsj.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  General Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  General questions, partnerships, media inquiries
                </p>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm font-mono text-primary">info@amhsj.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center mb-8">
            Quick answers to common questions about AMHSJ
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does the review process take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our typical review process takes 14 days from submission to initial decision. 
                  Medical and health sciences papers receive expedited review due to our specialized editorial board.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are the publication fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AMHSJ operates on an open-access model with article processing charges (APC) of 
                  US $100.00 for accepted papers. Discounts available for developing countries and student authors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I track my submission status?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Log into your author dashboard to track your submission status in real-time, 
                  view reviewer comments, and receive notifications about editorial decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you accept non-medical research?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  While our primary focus is on medicine and health sciences research, we also welcome 
                  high-quality submissions in related areas like public health, biomedical sciences, and allied health fields.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View Complete FAQ
              </Button>
            </Link>
          </div>
        </section>

        {/* Urgent Editorial Matters */}
        <Alert className="mb-16 border-red-200 bg-red-50/50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Urgent Editorial Matters:</strong> For time-sensitive editorial issues, ethical concerns, 
            or urgent publication matters, contact the Editor-in-Chief directly at 
            <span className="font-mono ml-1">editor@amhsj.org</span> or call 
            <span className="font-medium ml-1">+234 813 198 1600</span>
          </AlertDescription>
        </Alert>

        {/* Additional Information */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Publisher Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Bayelsa Medical University</p>
                  <p className="text-sm text-muted-foreground">Official publisher of AMHSJ</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">ISSN:</span>
                    <span className="text-muted-foreground">To be assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">License:</span>
                    <span className="text-muted-foreground">CC BY-NC-ND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Open Access:</span>
                    <span className="text-muted-foreground">Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/about" className="text-sm text-primary hover:text-primary/80">
                    About the Journal
                  </Link>
                  <Link href="/guidelines" className="text-sm text-primary hover:text-primary/80">
                    Submission Guidelines
                  </Link>
                  <Link href="/editorial-board" className="text-sm text-primary hover:text-primary/80">
                    Editorial Board
                  </Link>
                  <Link href="/articles" className="text-sm text-primary hover:text-primary/80">
                    Current Issue
                  </Link>
                  <Link href="/auth/register" className="text-sm text-primary hover:text-primary/80">
                    Submit Research
                  </Link>
                  <Link href="/auth/login" className="text-sm text-primary hover:text-primary/80">
                    Author Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Submit Your Research?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions about submitting your manuscript? Contact our editorial team for guidance 
            and support throughout the submission process.
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
                <FileText className="w-5 h-5" />
                View Guidelines
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
