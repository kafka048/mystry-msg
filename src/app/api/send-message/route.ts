import dbConnect from "@/src/lib/dbconnection";
import userModel from "@/src/model/usermodel";
import { Message } from "@/src/model/usermodel";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }
 
    // to check if the user is existing messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = {content, createdAt: new Date()}
    user.messages.push(newMessage as Message)
    await user.save()

    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      {
        status: 200,
      }
    )

  } catch (error) {
    console.log("an unexpected error occurred", error)
    return Response.json(
      {
        success: false,
        message: "an unexpected error occurred",
      },
      {
        status: 500,
      }
    )
  }
}
