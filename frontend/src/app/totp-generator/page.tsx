"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TotpGeneratorPage() {
  const [progress, setProgress] = useState(0);
  const [tokenPeriod, setTokenPeriod] = useState(30);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [secretKey, setSecretKey] = useState("");
  const [digits, setDigits] = useState(6);
  const [totp, setTotp] = useState("");

  const handleTokenPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTokenPeriod(value);
    setTimeElapsed(0);
    setProgress(0);
  };

  const handleSecretKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretKey(e.target.value);
  };

  const handleDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDigits(Number(e.target.value));
  };

  const generateTotp = () => {
    if (!secretKey || digits <= 0 || tokenPeriod <= 0) {
      toast.error("Please provide valid inputs for the TOTP generation.");
      return;
    }

    const fakeTotp = `${Math.random().toString().slice(2, 2 + digits)}`.padStart(
      digits,
      "0"
    );
    setTotp(fakeTotp);

    toast.success("Generated TOTP copied to your clipboard!");
    navigator.clipboard.writeText(fakeTotp).catch((err) => {
      toast.error("Failed to copy TOTP to clipboard.");
      console.error("Clipboard error:", err);
    });

    // Reset progress
    setTimeElapsed(0);
    setProgress(0);
  };

  useEffect(() => {
    if (tokenPeriod <= 0) return;

    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => {
        const newTime = prevTime + 1;
        const newProgress = Math.min((newTime / tokenPeriod) * 100, 100);

        setProgress(newProgress);

        if (newProgress >= 100) {
          generateTotp();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenPeriod, secretKey, digits]);

  return (
    <>
      <div className="flex justify-center items-center h-5/6">
        <Card className="w-3/5">
          <CardHeader>
            <CardTitle>Insert your values below</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-8">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="secret_key">YOUR SECRET KEY</Label>
                  <Input
                    id="secret_key"
                    placeholder="Paste your secret key here"
                    value={secretKey}
                    onChange={handleSecretKeyChange}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="no_digits">NUMBER OF DIGITS</Label>
                  <Input
                    id="no_digits"
                    type="number"
                    placeholder="Insert number of digits for the TOTP"
                    value={digits}
                    onChange={handleDigitsChange}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="token_period">
                    TOKEN PERIOD (IN SECONDS)
                  </Label>
                  <Input
                    id="token_period"
                    type="number"
                    placeholder="Insert token period in seconds"
                    value={tokenPeriod}
                    onChange={handleTokenPeriodChange}
                  />
                </div>

                <Progress value={progress} className="w-[100%]" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={generateTotp}>
              Generate TOTP
            </Button>
            {totp && (
              <div className="text-lg font-bold">
                TOTP: <span className="text-blue-600">{totp}</span>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
