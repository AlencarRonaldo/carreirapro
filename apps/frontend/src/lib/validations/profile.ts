import { z } from "zod"

// Profile validation schema
export const profileSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
  headline: z.string().max(255, "Headline muito longa").optional().or(z.literal("")),
  locationCity: z.string().max(255, "Cidade muito longa").optional().or(z.literal("")),
  locationState: z.string().max(255, "Estado muito longo").optional().or(z.literal("")),
  locationCountry: z.string().max(255, "País muito longo").optional().or(z.literal("")),
  linkedin: z
    .union([
      z.string().url("URL inválida"),
      z.string().length(0),
    ])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  github: z
    .union([
      z.string().url("URL inválida"),
      z.string().length(0),
    ])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  website: z
    .union([
      z.string().url("URL inválida"),
      z.string().length(0),
    ])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(50, "Telefone muito longo").optional().or(z.literal("")),
})

// Experience validation schema
export const experienceSchema = z.object({
  title: z.string().min(1, "Cargo é obrigatório").max(255, "Cargo muito longo"),
  company: z.string().min(1, "Empresa é obrigatória").max(255, "Empresa muito longa"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    if (start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de início deve ser anterior à data de fim",
        path: ["startDate"],
      })
    }
  }
})

// Education validation schema
export const educationSchema = z.object({
  institution: z.string().min(1, "Instituição é obrigatória").max(255, "Instituição muito longa"),
  degree: z.string().min(1, "Curso é obrigatório").max(255, "Curso muito longo"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    if (start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de início deve ser anterior à data de fim",
        path: ["startDate"],
      })
    }
  }
})

// Skill validation schema
export const skillSchema = z.object({
  name: z.string().min(1, "Nome da skill é obrigatório").max(100, "Nome muito longo"),
  level: z.number().int("Nível deve ser um número inteiro").min(1, "Nível mínimo é 1").max(5, "Nível máximo é 5"),
})

// LinkedIn import validation schema
export const linkedInImportSchema = z.object({
  url: z.string().url("URL inválida").refine((url) => {
    return url.includes("linkedin.com")
  }, "URL deve ser do LinkedIn"),
  overwrite: z.boolean().optional().default(false),
})

// Form step validation
export const stepValidationSchema = z.object({
  currentStep: z.number().min(1).max(4),
  completedSteps: z.array(z.number()),
})

// Types
export type ProfileFormData = z.infer<typeof profileSchema>
export type ExperienceFormData = z.infer<typeof experienceSchema>
export type EducationFormData = z.infer<typeof educationSchema>
export type SkillFormData = z.infer<typeof skillSchema>
export type LinkedInImportData = z.infer<typeof linkedInImportSchema>

// Utility functions for URL normalization
export const normalizeUrl = (url: string): string => {
  const trimmed = (url || "").trim()
  if (!trimmed) return ""
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Profile data transformation for API
export const transformProfileForAPI = (data: ProfileFormData) => {
  return {
    ...data,
    linkedin: data.linkedin ? normalizeUrl(data.linkedin) : undefined,
    github: data.github ? normalizeUrl(data.github) : undefined,
    website: data.website ? normalizeUrl(data.website) : undefined,
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    headline: data.headline?.trim() || undefined,
    locationCity: data.locationCity?.trim() || undefined,
    locationState: data.locationState?.trim() || undefined,
    locationCountry: data.locationCountry?.trim() || undefined,
  }
}