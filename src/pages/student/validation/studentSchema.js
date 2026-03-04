import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Valid phone required"),
  birthDate: z.string().min(1, "Birth date required"),
  gradeLevel: z.string().min(1, "Grade level required"),
  school: z.string().min(1, "School required"),
  learningGoals: z.string().min(5, "Learning goals required"),
  subjects: z.string().min(1, "Subjects required"),

  parentName: z.string().min(1, "Parent name required"),
  parentRelationship: z.string().min(1, "Relationship required"),
  parentEmail: z.string().email("Valid parent email"),
  parentPhone: z.string().min(8, "Valid parent phone"),
  parentConsent: z.literal(true, {
    errorMap: () => ({ message: "Consent required" }),
  }),

  schoolEmail: z.string().optional(),
  studentId: z.string().optional(),
  schoolVerification: z.boolean().optional(),

  availability: z
    .array(z.string())
    .min(1, "Select at least one availability slot"),

  subscriptionTier: z.string(),

  professorPreferences: z.string().optional(),

  studentPhoto: z.any().optional(),
  studentDocument: z.any().optional(),
});