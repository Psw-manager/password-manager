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
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TotpGeneratorPage() {
  const [progress, setProgress] = useState(0);
  const [tokenPeriod, setTokenPeriod] = useState(30);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const handleTokenPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTokenPeriod(value);
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
          clearInterval(timer);
        }

        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tokenPeriod]);

  return (
    <>
      <div className="flex justify-center items-center h-5/6">
        <Card className="w-3/5">
          <CardHeader>
            <CardTitle>
              Insert your values below{" "}
            </CardTitle>
            
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-8">
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
                  <Label htmlFor="token_period">
                    TOKEN PERIOD (IN SECONDS)
                  </Label>
                  <Input
                    id="token_period"
                    placeholder="Insert token period in seconds"
                    onChange={handleTokenPeriodChange}
                  />
                </div>

                <Progress value={progress} className="w-[100%]" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                toast("Generated TOTP copied to your clipboard!", {
                  action: {
                    label: "X",
                    onClick: () => console.log("exit"),
                  },
                })
              }
            >
              Generate
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
