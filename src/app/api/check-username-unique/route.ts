import dbConnect from "@/src/lib/dbconnection";
import z, { success } from "zod";
import userModel from "@/src/model/usermodel";
import { userNameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request){
    
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        // running the validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam) // this result holds a lot of things, which you need to study to use them effectively
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query parameters"
            }, {
                status: 400
            })
        }

        const {username} = result.data

        const existtingVerifiedUser = await userModel.findOne({ username, isVerified: true})
        if(existtingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken "
            }, {
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "Username is unique" 
        }, {
            status: 400
        })

    } catch (error) {
        console.error("error checking username", error)
        return Response.json({
            success: false,
            message: "error checking username"
        }, {
            status: 500
        })
    }
}