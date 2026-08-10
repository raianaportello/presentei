import { z } from "zod";
export const businessLeadSchema = z.object({ companyName: z.string().trim().min(2).max(120), contactName: z.string().trim().min(2).max(100), email: z.email(), phone: z.string().trim().min(10).max(20), quantity: z.number().int().positive(), message: z.string().trim().max(1000).optional() });
