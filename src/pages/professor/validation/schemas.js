import { z } from "zod";

/* ---------------- PERSONAL STEP ---------------- */
export const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter valid phone number"),
  country: z.string().min(1, "Country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  profilePhoto: z.any().refine((file) => file, {
    message: "Profile photo is required",
  }),
});

/* ---------------- ACADEMIC STEP ---------------- */
export const academicSchema = z.object({
  highestDegree: z.string().min(1, "Highest degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  university: z.string().min(1, "University is required"),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, "Enter valid year (YYYY)"),
  specializations: z.string().min(1, "Specializations required"),
  certifications: z.string().min(1, "Certifications required"),
  degreeCertificate: z.any().refine((file) => file, {
    message: "Degree certificate is required",
  }),
});

/* ---------------- EXPERIENCE STEP ---------------- */
export const experienceSchema = z.object({
  yearsExperience: z
    .string()
    .regex(/^\d+$/, "Enter valid number of years"),

  teachingLevel: z.string().min(1, "Teaching level is required"),

  subjects: z.string().min(1, "Subjects are required"),

  hourlyRate: z
    .string()
    .regex(/^\d+$/, "Enter valid hourly rate"),

  availability: z
    .object({
      weekdays: z.boolean().optional(),
      weekends: z.boolean().optional(),
      mornings: z.boolean().optional(),
      afternoons: z.boolean().optional(),
      evenings: z.boolean().optional(),
    })
    .refine(
      (val) =>
        val.weekdays ||
        val.weekends ||
        val.mornings ||
        val.afternoons ||
        val.evenings,
      {
        message: "Select at least one availability slot",
      }
    ),
});
/* ---------------- VERIFICATION STEP ---------------- */
export const verificationSchema = z.object({
  governmentId: z.any().refine((file) => file, {
    message: "Government ID required",
  }),

  videoIntroduction: z.any().refine((file) => file, {
    message: "Video introduction required",
  }),

  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),

  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
});
