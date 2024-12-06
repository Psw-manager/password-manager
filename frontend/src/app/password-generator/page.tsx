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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { GrRefresh } from "react-icons/gr";
import Image from "next/image";

export default function PasswordGeneratorPage() {
  const [sliderValue, setSliderValue] = useState<number>(12);
  const [password, setPassword] = useState<string>("");
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(false);

  const handleValueChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charset = "";

    if (useUppercase) charset += uppercase;
    if (useLowercase) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (charset.length === 0) {
      toast.error("Please select at least one character set.");
      return;
    }

    const randomValues = new Uint32Array(sliderValue);
    window.crypto.getRandomValues(randomValues);

    let newPassword = "";
    for (let i = 0; i < sliderValue; i++) {
      newPassword += charset[randomValues[i] % charset.length];
    }

    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword(); 
  }, []);

  return (
    <>
      <div className="min-h-4/6 flex flex-col items-center justify-start p-6">
        <p className="text-5xl font-bold mb-6 mt-8 text-center">
          Random Password Generator
        </p>
        <h3 className="mb-6">
          Create strong and secure passwords to keep your accounts safe online.
        </h3>
        <div className="flex w-4/6 h-auto justify-center mt-2 space-x-15">
          <div className="w-2/6 p-8 mt-6">
            <Image
              src="/cyber-security.png"
              alt="Cyber Security"
              className="object-contain w-full h-60 dark:hidden opacity-65"
              width="300"
              height="300"
            />
            <Image
              src="/cyber-security-white.png"
              alt="Cyber Security"
              className="object-contain w-full h-60 hidden dark:block opacity-65"
              width="300"
              height="300"
            />
          </div>
          <div className="w-4/6 h-full p-6 flex flex-col justify-center">
            <form className="space-y-16">
              <div className="flex justify-between items-center space-y-1.5 h-1/3 ">
                <div className="relative w-4/5 h-2/3 mt-2">
                  <Input
                    id="password"
                    value={password}
                    className="text-5xl font-bold p-4 w-full pr-10 h-full"
                    readOnly
                  />

                  <GrRefresh
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer"
                    onClick={generatePassword}
                  />
                </div>
                <Button
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard
                      .writeText(password)
                      .then(() => {
                        toast(
                          "Password has been copied to your clipboard!",
                          {
                            action: {
                              label: "X",
                              onClick: () => console.log("exit"),
                            },
                          }
                        );
                      })
                      .catch((err) => {
                        toast.error("Failed to copy password to clipboard");
                        console.error("Clipboard copy failed: ", err);
                      });
                  }}
                  className="text-xl px-7 py-7"
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between space-x-6">
                <div className="text-lg font-medium w-60 text-right flex items-center">
                  <Label
                    htmlFor="no_digits"
                    className="mr-4 text-lg whitespace-nowrap p-1"
                  >
                    PASSWORD LENGTH
                  </Label>
                  <span className="text-2xl p-1 font-bold">{sliderValue}</span>
                </div>
                <Slider
                  defaultValue={[sliderValue]}
                  max={30}
                  step={1}
                  onValueChange={handleValueChange}
                  className="w-4/6 h-4"
                />
              </div>

              <div className="flex items-center space-x-8">
                <Label
                  htmlFor="no_digits"
                  className="text-lg font-medium whitespace-nowrap"
                >
                  CHARACTERS USED:
                </Label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ABC"
                      className="w-6 h-6"
                      onCheckedChange={() => setUseUppercase(!useUppercase)}
                      defaultChecked
                    />
                    <label
                      htmlFor="ABC"
                      className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      ABC
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="abc"
                      className="w-6 h-6"
                      onCheckedChange={() => setUseLowercase(!useLowercase)}
                      defaultChecked
                    />
                    <label
                      htmlFor="abc"
                      className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      abc
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="123"
                      className="w-6 h-6"
                      onCheckedChange={() => setUseNumbers(!useNumbers)}
                      defaultChecked
                    />
                    <label
                      htmlFor="123"
                      className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      123
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="#$%"
                      className="w-6 h-6"
                      onCheckedChange={() => setUseSymbols(!useSymbols)}
                    />
                    <label
                      htmlFor="#$%"
                      className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      #$%
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
