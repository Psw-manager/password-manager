"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PasswordGeneratorPage() {
  return (
    <>
      <div className="min-h-4/6 flex flex-col items-center justify-start p-6">
        <p className="text-5xl font-bold mb-6 mt-8 text-center">
          Random Password Generator
        </p>
        <h3 className="mb-6">
          Create strong and secure passwords to keep your accounts safe online.
        </h3>
        <div className="flex w-4/6 h-auto justify-center mt-6 space-x-15">
          <div className="w-2/6 p-8 mt-6">
            <img
              src="/cyber-security.png"
              alt="Cyber Security"
              className="object-contain w-full h-60 dark:hidden opacity-65" // For light mode
            />
            <img
              src="/cyber-security-white.png"
              alt="Cyber Security"
              className="object-contain w-full h-60 hidden dark:block opacity-65" // For dark mode
            />
          </div>
          <div className="w-4/6 h-full p-6 flex flex-col justify-center">
            <form className="space-y-10">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="secret_key">YOUR SECRET KEY</Label>
                <Input
                  id="secret_key"
                  placeholder="Paste your secret key here"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="no_digits">NUMBER OF DIGITS</Label>
                <Input
                  id="no_digits"
                  placeholder="Insert number of digits for the TOTP"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="token_period">TOKEN PERIOD (IN SECONDS)</Label>
                <Input
                  id="token_period"
                  placeholder="Insert token period in seconds"
                />
              </div>
            </form>

            <Button
              variant="default"
              onClick={() =>
                toast("Generated password has been copied to your clipboard!", {
                  action: {
                    label: "X",
                    onClick: () => console.log("exit"),
                  },
                })
              }
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
