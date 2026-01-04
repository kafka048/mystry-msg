import mongoose, { Schema, Document, Mongoose } from "mongoose";

// Typescript interface for the shape of a message document
export interface Message extends Document {
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],  
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code's expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },

    messages: [messageSchema]
})

 
const userModel = 
(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)
export default userModel