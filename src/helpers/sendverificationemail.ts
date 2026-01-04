import { resend } from "../lib/resend" // imported the resend client that we made in another file
import VerificationEmail from "../../emails/verifcationemail" // template of the email
import { ApiResponse } from "../types/apiresponse" // type of response



export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'mystry-msg | verification code',
        react: VerificationEmail({username, otp: verifyCode})
    });
        return {
            success: true, message: "verification email sent successfully"
        }
    } catch (error) {
        console.error("error sending verification email", error)
        return {
            success: false, message: "failed to send verification email"
        }
    }
}

