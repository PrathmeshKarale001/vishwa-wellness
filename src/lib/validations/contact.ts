import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .email('Please enter a valid email address'),
    phone: z.string()
        .optional()
        .refine(
            (val) => !val || /^[+]?[\d\s-]{10,15}$/.test(val),
            'Please enter a valid phone number'
        ),
    interest: z.enum(['products', 'retreat', 'consultation', 'wholesale', 'other']).or(z.literal('')).optional(),
    retreat: z.string().optional(),
    message: z.string()
        .max(2000, 'Message must be less than 2000 characters')
        .optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Retreat enquiry form validation schema (retreat detail pages)
export const retreatEnquirySchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .email('Please enter a valid email address'),
    phone: z.string()
        .optional()
        .refine(
            (val) => !val || /^[+]?[\d\s-]{10,15}$/.test(val),
            'Please enter a valid phone number'
        ),
    preferredMonth: z.string().optional(),
    participants: z.string().optional(),
    message: z.string()
        .max(2000, 'Message must be less than 2000 characters')
        .optional(),
});

export type RetreatEnquiryData = z.infer<typeof retreatEnquirySchema>;

// Login form validation schema
export const loginFormSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Registration form validation schema
export const registerFormSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase, and a number'
        ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean()
        .refine((val) => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Product review validation schema
export const reviewFormSchema = z.object({
    rating: z.number()
        .min(1, 'Please select a rating')
        .max(5, 'Rating must be between 1 and 5'),
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),
    comment: z.string()
        .min(10, 'Review must be at least 10 characters')
        .max(1000, 'Review must be less than 1000 characters'),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

// Newsletter subscription validation
export const newsletterSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
