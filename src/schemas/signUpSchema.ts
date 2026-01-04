import { z } from "zod";

export const userNameValidation = z 
    .string() // checks if the username is string 
    .min(3, "Username must be of atleast 3 characters")
    .max(100, "Username must not be more than 100 characters")
    .regex(/^[ a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const emailValidation = z
    .string()
    .email({message: "Invalid email address"})
    
export const passwordValidation = z
    .string()
    .min(6, {message: "Password must be atleast 6 characters"})

export const signUpSchema = z.object({
    username: userNameValidation,
    email: emailValidation,
    password: passwordValidation
})
