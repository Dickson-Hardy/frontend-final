"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react"
import { Step1PaperInfo } from "@/components/submission/step1-paper-info"
import { Step2Authors } from "@/components/submission/step2-authors"
import { Step3Reviewers } from "@/components/submission/step3-reviewers"
import { Step4Files } from "@/components/submission/step4-files"
import { Step5Review } from "@/components/submission/step5-review"

const steps = [
  { id: 1, title: "Research Paper Information", description: "Basic manuscript details" },
  { id: 2, title: "Authors & Affiliations", description: "Author information and institutions" },
  { id: 3, title: "Recommended Reviewers", description: "Suggest potential reviewers" },
  { id: 4, title: "Files & Documents", description: "Upload manuscript and supporting files" },
  { id: 5, title: "Review & Submit", description: "Final review and submission" },
]

export default function NewSubmissionPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 data
    title: "",
    abstract: "",
    keywords: "",
    category: "",
    researchType: "",

    // Step 2 data
    correspondingAuthor: {
      name: "",
      email: "",
      affiliation: "",
      department: "",
      country: "",
      orcid: "",
    },
    coAuthors: [],

    // Step 3 data
    recommendedReviewers: [],

    // Step 4 data
    files: {
      manuscript: null,
      figures: [],
      tables: [],
      supplementary: [],
      coverLetter: null,
      ethicsApproval: null,
      copyrightForm: null,
    },

    // Step 5 data
    termsAccepted: false,
    guidelinesAcknowledged: false,
    conflictDeclared: false,
    ethicsConfirmed: false,
  })

  const updateFormData = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveDraft = () => {
    // Save draft logic
    console.log("Saving draft...", formData)
  }

  const submitManuscript = () => {
    // Submit manuscript logic
    console.log("Submitting manuscript...", formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1PaperInfo data={formData} onUpdate={updateFormData} />
      case 2:
        return <Step2Authors data={formData} onUpdate={updateFormData} />
      case 3:
        return <Step3Reviewers data={formData} onUpdate={updateFormData} />
      case 4:
        return <Step4Files data={formData} onUpdate={updateFormData} />
      case 5:
        return <Step5Review data={formData} onUpdate={updateFormData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Submission</h1>
        <p className="text-muted-foreground mt-2">Submit your manuscript to AMHSJ following our 5-step process</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            {/* Step indicators */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center max-w-[120px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                      step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={saveDraft} className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={submitManuscript} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Manuscript
            </Button>
          ) : (
            <Button onClick={nextStep} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
