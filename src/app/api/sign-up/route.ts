import dbConnect from "@/src/lib/dbconnection"; 
import userModel from "@/src/model/usermodel"; 
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendverificationemail";
  



export async function POST(request: Request){
    await dbConnect()

    try {
        const {email, username, password } = await request.json()
        const existingUserVerifiedByUserName = await userModel.findOne({
            username,
            isVerified: true
         })
        
        if(existingUserVerifiedByUserName){
            return Response.json({
                success: false, // this success is for the signup request. since username already taken, the signup process wasn't a success.
                message: "Username is already taken"
            }, { status: 400 })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const existingUserByEmail = await userModel.findOne({
            email
        })        

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "A user already exists with this email."
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        } else {

            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            // expiry date is an object therefore we can modify the value inspite of const

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();

        } // this else block creates the user and saves it in the db

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: `User registered successfully.
            Please verify your email to continue.`
        }, { status: 201 })

        

    } catch (error) {
        console.error("error registering user", error)
        return Response.json(
        {
            success: false,
            message: "error registering user"
        }, 
        {
            status: 500  
        }
    )
        
    }
}


