"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Mail, 
  Users, 
  BookOpen,
  ExternalLink,
  Phone,
  MapPin,
  DollarSign,
  Copyright,
  Shield,
  Target,
  Edit,
  Upload,
  Review,
  Send
} from "lucide-react"
import Link from "next/link"

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Submission Guidelines</h1>
                <p className="text-lg text-muted-foreground mt-2">Advances in Medicine & Health Sciences Journal</p>
                <p className="text-sm text-muted-foreground">The Official Journal of Bayelsa Medical University</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Please read carefully before submission. Follow these guidelines to ensure your manuscript 
              meets all requirements and avoids rejection.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Critical Compliance Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50/50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>CRITICAL: Compliance Required for Review</strong><br />
            Manuscripts that do not follow these submission guidelines and formatting requirements will be 
            <strong> REJECTED without review</strong>. To avoid rejection, ensure your manuscript meets 
            ALL requirements listed in these guidelines before submission.
          </AlertDescription>
        </Alert>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Review Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">14 days</p>
              <p className="text-sm text-muted-foreground">Peer-review timeframe</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Publication Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">4-6 weeks</p>
              <p className="text-sm text-muted-foreground">After submission</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Submit To
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-primary">editor@amhsj.org</p>
              <p className="text-sm text-muted-foreground">Email submission</p>
            </CardContent>
          </Card>
        </div>

        {/* Common Rejection Reasons */}
        <section className="mb-16">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-xl text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Common Rejection Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Incorrect formatting or template use
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Incomplete author information
                  </li>
                </ul>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Missing ethics approvals
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Improper reference formatting
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Before Submission Checklist */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Before Submission Checklist</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Pre-Submission Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Use the official manuscript template</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Complete the author checklist</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Verify all required sections</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Check figure and table quality</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Quick Start Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  New to AMHSJ? Download our resources to get started quickly.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="w-4 h-4" />
                    Author Checklist
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="w-4 h-4" />
                    Manuscript Template
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  All submissions must not have been published previously in any printed or electronic media.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Article Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Article Types</h2>
          <p className="text-muted-foreground text-center mb-8">
            AMHSJ accepts the following types of submissions. All papers will be peer-reviewed by at least three independent referees.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Original Research Articles</CardTitle>
                <Badge variant="secondary">Reports of original research</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Word Limit:</span>
                    <span className="text-muted-foreground">3000 words max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Abstract:</span>
                    <span className="text-muted-foreground">300 words max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">References:</span>
                    <span className="text-muted-foreground">APA format</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Figures:</span>
                    <span className="text-muted-foreground">250 words each</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Review Articles</CardTitle>
                <Badge variant="secondary">Comprehensive reviews</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Word Limit:</span>
                    <span className="text-muted-foreground">3500 words max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Abstract:</span>
                    <span className="text-muted-foreground">300 words max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">References:</span>
                    <span className="text-muted-foreground">APA format</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Figures:</span>
                    <span className="text-muted-foreground">250 words each</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Case/Audit Reports</CardTitle>
                <Badge variant="secondary">Clinical case reports</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Word Limit:</span>
                    <span className="text-muted-foreground">800 words max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Abstract:</span>
                    <span className="text-muted-foreground">300 words max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">References:</span>
                    <span className="text-muted-foreground">APA format</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Figures:</span>
                    <span className="text-muted-foreground">250 words each</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Letters</CardTitle>
                <Badge variant="secondary">Brief communications</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Word Limit:</span>
                    <span className="text-muted-foreground">As appropriate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Abstract:</span>
                    <span className="text-muted-foreground">Not required</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">References:</span>
                    <span className="text-muted-foreground">APA format</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Figures:</span>
                    <span className="text-muted-foreground">Minimal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important Note:</strong> Allow 250 words for each table, figure or group of eight references 
              when calculating total word count.
            </AlertDescription>
          </Alert>
        </section>

        {/* Submission Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Submission Process</h2>
          <p className="text-muted-foreground text-center mb-8">
            Follow these steps to submit your manuscript
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Edit className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Prepare Your Manuscript</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Format according to guidelines and prepare all required files
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Register on our submission platform with ORCID integration
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">3. Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Submit manuscript, figures, and supplementary materials
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">4. Review & Submit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Review all information and complete submission
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                <Send className="w-5 h-5" />
                Start Submission
              </Button>
            </Link>
          </div>
        </section>

        {/* Manuscript Preparation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Manuscript Preparation</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  General Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Font: Times New Roman, size 12, double-spaced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Single column format using Microsoft Word</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Pages numbered consecutively</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Word count provided (excluding references, tables, legends)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>References in APA format</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Title Page Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Full title of the article</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Names and up to 2 degrees of all authors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Department(s) and institution(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Five keywords</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Corresponding author name, email and postal address</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Abstract Structure */}
        <section className="mb-16">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Abstract Structure
              </CardTitle>
              <p className="text-muted-foreground">
                Required structure for abstracts (maximum 300 words)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { number: 1, title: "Background", description: "Study rationale, context, and what was previously known" },
                  { number: 2, title: "Objectives", description: "Clear statement of study aims and research questions" },
                  { number: 3, title: "Methods", description: "Study design, participants, procedures, and analytical methods" },
                  { number: 4, title: "Results", description: "Main findings with key data and statistical significance" },
                  { number: 5, title: "Conclusion", description: "Principal conclusions and their clinical/scientific implications" }
                ].map((section) => (
                  <Card key={section.number} className="text-center">
                    <CardHeader className="pb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary-foreground font-bold text-sm">{section.number}</span>
                      </div>
                      <CardTitle className="text-sm">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note for Original Articles:</strong> All original article contributions should contain a structured 
                  abstract not exceeding 300 words following the Background, Objectives, Methods, Results, and Conclusion format.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Covering Letter & Submission Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Covering Letter & Submission Requirements</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Covering Letter Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Must identify the corresponding author</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Must be signed by all co-authors</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Only those who have contributed significantly should be included as authors</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Corresponding author should explain any authors unable to sign</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>All authors must sign declaration and copyright form when manuscript is accepted</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Email Submission Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium">Submit to:</span>
                  </div>
                  <p className="text-primary font-mono">editor@amhsj.org</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Peer-review timeframe:</span>
                    <Badge variant="secondary">14 days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Publication target:</span>
                    <Badge variant="secondary">4-6 weeks after submission</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Anonymization:</span>
                    <span className="text-muted-foreground">Manuscripts anonymized including peer-reviewer comments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Peer Review Criteria */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Peer Review Criteria</h2>
          <p className="text-muted-foreground text-center mb-8">
            Criteria used by reviewers to evaluate manuscripts
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Structure & Content</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Does the title reflect the contents?</li>
                  <li>• Does abstract reflect all study aspects?</li>
                  <li>• Is study rationale adequately described?</li>
                  <li>• Are objectives clearly stated?</li>
                  <li>• Do results justify the conclusions?</li>
                  <li>• Is the paper clearly written?</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Methodology & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Is study design appropriate?</li>
                  <li>• Is sample size appropriate?</li>
                  <li>• Are data collection methods described?</li>
                  <li>• Are bias minimization techniques documented?</li>
                  <li>• Are data analysis methods appropriate?</li>
                  <li>• Is statistical significance documented?</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion & References</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Are key findings clearly stated?</li>
                  <li>• Are differences with other studies discussed?</li>
                  <li>• Are implications clearly explained?</li>
                  <li>• Are references appropriate and up-to-date?</li>
                  <li>• Do references follow APA style?</li>
                  <li>• Any important references missing?</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ethics & Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Are ethical considerations described?</li>
                  <li>• Is ethics approval documented?</li>
                  <li>• Are results credible and logical?</li>
                  <li>• Are there grammar/language problems?</li>
                  <li>• Is interpretation warranted by data?</li>
                  <li>• Are conflicts of interest declared?</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Authorship & Publication Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Authorship & Publication Information</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  ICMJE Authorship Criteria
                </CardTitle>
                <p className="text-sm text-muted-foreground">All authors must meet ALL four criteria:</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Substantial contributions to conception/design OR data acquisition/analysis/interpretation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Drafting the work OR revising it critically for important intellectual content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Final approval of the version to be published</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Agreement to be accountable for all aspects of the work</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Additional Requirements:</p>
                  <p className="text-sm text-muted-foreground">• Financial conflicts of interest must be declared</p>
                  <p className="text-sm text-muted-foreground">• AMHSJ supports ORCID. Authors encouraged to use ORCID iDs during peer review</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Publication Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Open Access Policy:</span>
                    <span className="text-muted-foreground text-sm">Free, unrestricted online access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">License:</span>
                    <span className="text-muted-foreground text-sm">CC BY-NC-ND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Publication Fee:</span>
                    <Badge variant="secondary">US $100.00</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payable to:</span>
                    <span className="text-muted-foreground text-sm">MDCAN, NDUTH Chapter</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Copyright & Citation:</p>
                  <p className="text-sm text-muted-foreground">• AMHSJ retains copyright of all published work</p>
                  <p className="text-sm text-muted-foreground">• Citation format: Nig Del Med J 2017; 2: 1-5</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Editorial Contact & Important Information</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Manuscript Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium">Submit to:</span>
                  </div>
                  <p className="text-primary font-mono">editor@amhsj.org</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Peer-review:</span>
                    <Badge variant="secondary">14 days</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Publication:</span>
                    <Badge variant="secondary">4-6 weeks after submission</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Anonymization:</span>
                    <span className="text-muted-foreground">Manuscripts anonymized including reviewer comments</span>
                  </div>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Report Issues:</strong> Plagiarism & Research Fraud should be reported to the Editor-in-Chief.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Journal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">ISSN:</span>
                    <span className="text-muted-foreground">To be assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">License:</span>
                    <span className="text-muted-foreground">CC BY-NC-ND (Open Access)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Reference Style:</span>
                    <span className="text-muted-foreground">APA format</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Citation Example:</span>
                    <span className="text-muted-foreground">Nig Del Med J 2017; 2: 1-5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Publication Fee:</span>
                    <Badge variant="secondary">US $100.00 upon acceptance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Submit Your Research?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Follow these guidelines carefully to ensure your manuscript meets all requirements. 
            Download our templates and start your submission process today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                <Send className="w-5 h-5" />
                Start Submission
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Download Templates
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
