import dbConnect from "@/src/lib/dbconnection";
import userModel from "@/src/model/usermodel";
import z from "zod";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username) // whatever that comes from the url isn't that readily available at times. so it is smart to use this
        const user = await userModel.findOne({
            username: decodedUsername
        })

        if(!user){
            return Response.json({
            success: false,
            message: "error verifying username"
            }, {
            status: 500
            })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
            success: true,
            message: "account verified successfully"
            }, {
            status: 200
            })
        } else if (!isCodeNotExpired){
            return Response.json({
            success: false,
            message: "verification code expired. please sign up again to get a new code"
            }, {
            status: 400
            })

        } else {
            return Response.json({
            success: false,
            message: "verification code is not valid. please enter a valid code"
            }, {
            status: 400
            })
        }


    } catch (error) {
        console.error("error verifying username", error)
        return Response.json({
            success: false,
            message: "error verifying username"
        }, {
            status: 500
        })
        
    }
}