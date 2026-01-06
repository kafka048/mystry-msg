import dbConnect from "@/src/lib/dbconnection";
import userModel from "@/src/model/usermodel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid Credentials.",
        },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid Credentials.",
        },
        { status: 401 }
      );
    }

    const isUserVerified = user.isVerified;
    if (!isUserVerified) {
      return Response.json(
        {
          success: false,
          message: "The User is not verified. Please verify yourself first.",
        },
        { status: 403 }
      );
    }

    return Response.json(
      {
        success: true,
        message: `User signed in successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error signing in the user", error);
    return Response.json(
      {
        success: false,
        message: "Error signing in the user",
      },
      {
        status: 400,
      }
    );
  }
}
