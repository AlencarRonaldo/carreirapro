"use client"

import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

// Lazy load heavy components
export const LazyProfileWizard = lazy(() => 
  import("./ProfileWizard").then(module => ({ default: module.ProfileWizard }))
)

export const LazyLinkedInImportForm = lazy(() => 
  import("./forms/LinkedInImportForm")
)

export const LazyExperienceForm = lazy(() => 
  import("./forms/ExperienceForm")
)

export const LazyEducationForm = lazy(() => 
  import("./forms/EducationForm")
)

export const LazySkillsForm = lazy(() => 
  import("./forms/SkillsForm")
)

export const LazyProfileInfoForm = lazy(() => 
  import("./forms/ProfileInfoForm")
)

// Loading skeletons for better UX
export const ProfileWizardSkeleton = () => (
  <Card className="w-full max-w-4xl">
    <CardContent className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export const FormSkeleton = () => (
  <Card className="w-full">
    <CardContent className="p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </CardContent>
  </Card>
)

// Suspense wrappers with appropriate fallbacks
export const ProfileWizardWithSuspense = (props: any) => (
  <Suspense fallback={<ProfileWizardSkeleton />}>
    <LazyProfileWizard {...props} />
  </Suspense>
)

export const LinkedInImportFormWithSuspense = (props: any) => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyLinkedInImportForm {...props} />
  </Suspense>
)

export const ExperienceFormWithSuspense = (props: any) => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyExperienceForm {...props} />
  </Suspense>
)

export const EducationFormWithSuspense = (props: any) => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyEducationForm {...props} />
  </Suspense>
)

export const SkillsFormWithSuspense = (props: any) => (
  <Suspense fallback={<FormSkeleton />}>
    <LazySkillsForm {...props} />
  </Suspense>
)

export const ProfileInfoFormWithSuspense = (props: any) => (
  <Suspense fallback={<FormSkeleton />}>
    <LazyProfileInfoForm {...props} />
  </Suspense>
)