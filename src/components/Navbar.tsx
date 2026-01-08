"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // 🔒 NAVBAR VISIBILITY RULES
  if (!session) return null;
  if (pathname === "/") return null;

  const user = session.user as User;

  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-950">
      <div className="flex h-20 items-center justify-between px-6">
        
        {/* Brand */}
        <Link
          href="/dashboard"
          className="text-[28px] font-extrabold tracking-tight text-neutral-100"
        >
          Mystery Message
        </Link>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="
                px-4 py-2
                text-[22px] font-semibold
                text-neutral-200
                rounded-md
                hover:bg-neutral-800
                hover:text-neutral-100
                focus-visible:ring-0
                transition-none
              "
            >
              {user?.username || user?.email}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 border border-neutral-800 bg-neutral-900 p-1"
          >
            <DropdownMenuItem
              asChild
              className="
                cursor-pointer
                text-base
                font-semibold
                text-neutral-200
                hover:bg-neutral-800
                hover:text-neutral-100
                focus:bg-neutral-800
                focus:text-neutral-100
              "
            >
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                await signOut({ redirect: false });
                router.replace("/");
              }}
              className="
                cursor-pointer
                text-base
                font-semibold
                text-neutral-200
                hover:bg-neutral-800
                hover:text-neutral-100
                focus:bg-neutral-800
                focus:text-neutral-100
              "
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
