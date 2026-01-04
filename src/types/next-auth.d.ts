import "next-auth";
import { DefaultSession } from "next-auth";
import { DefaultSerializer } from "node:v8";
import { string } from "zod";

declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        email?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;

    }

    interface Session {
        user: {
            _id?: string;           
            username?: string;
            email?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user']      
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;           
        username?: string;
        email?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;

    }
}
