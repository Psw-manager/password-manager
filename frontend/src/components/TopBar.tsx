"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaRegUser } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { TbCircleKeyFilled } from "react-icons/tb";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";

export const TopBar = () => {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const userName = session?.user?.email;

  if (!session) {
    return null;
  }

  if (session) {
    console.log("Authenticated user:", session.user);
  }

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-primary-foreground px-4 md:px-6 md:py-6 py-4">
      <nav className="hidden flex-col gap-6 text-2xl font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-2xl font-semibold md:text-base mr-6"
        >
          <TbCircleKeyFilled className="h-10 w-10" />
          <span>KeyNest</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-foreground transition-colors hover:text-foreground text-xl"
        >
          Dashboard
        </Link>
        <Link
          href="/password-generator"
          className="text-muted-foreground transition-colors hover:text-foreground text-xl whitespace-nowrap"
        >
          Generate Password
        </Link>
        <Link
          href="/totp-generator"
          className="text-muted-foreground transition-colors hover:text-foreground text-xl whitespace-nowrap"
        >
          Generate TOTP
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <RxHamburgerMenu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <TbCircleKeyFilled className="h-10 w-10" />
              <span>KeyNest</span>
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/password-generator"
              className="text-muted-foreground hover:text-foreground"
            >
              Generate Password
            </Link>
            <Link
              href="/totp-generator"
              className="text-muted-foreground hover:text-foreground "
            >
              Generate TOTP
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-between gap-2 md:ml-auto md:gap-2 lg:gap-2">
        {/* Left: Dark Mode Switch */}
        <div className="flex items-center space-x-2 p-4">
          <Switch
            id="dark-mode"
            onCheckedChange={(checked) => toggleTheme(checked)}
            checked={theme === "dark"}
          />
        </div>

        {/* Right: Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="m-2 flex items-center">
              <span className="rounded-full py-2 px-2 flex items-center">
                {userName}
                <FaRegUser className="h-5 w-5 ml-4" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                console.log("Logged out");
                signOut({ callbackUrl: "/", redirect: true });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
