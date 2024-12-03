"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

  import React from "react";

  interface PasswordDetailsProps {
    title: string;
    data?: {
      websiteName?: string;
      username?: string;
      password?: string;
      url?: string;
      category?: string;
      creationDate?: string;
      modificationDate?: string;
      notes?: string;
    };
    button_exit: string;
  }
  
  export const PasswordDetails = ({ title, data, button_exit }: PasswordDetailsProps) => {
    return (
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website_name" className="text-right">
              Website Name
            </Label>
            <Input
              id="website_name"
              defaultValue={data?.websiteName || ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue={data?.username || ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              defaultValue={data?.password || ""}
              className="col-span-3"
              type="password"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Website URL
            </Label>
            <Input
              id="url"
              defaultValue={data?.url || ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              disabled
              defaultValue={data?.category || ""}
              className="col-span-3 read-only"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creation_date" className="text-right">
              Created at
            </Label>
            <Input
              id="creation_date"
              disabled
              defaultValue={data?.creationDate || ""}
              className="col-span-3 read-only"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 mb-4">
            <Label htmlFor="modification_date" className="text-right">
              Last Modification Date
            </Label>
            <Input
              id="modification_date"
              disabled
              defaultValue={data?.modificationDate || ""}
              className="col-span-3 read-only"
            />
          </div>
          <Label htmlFor="notes" className="text-left">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Type your notes here."
            defaultValue={data?.notes || ""}
          />
        </div>
        <DialogFooter>
          <Button type="submit">{button_exit}</Button>
        </DialogFooter>
      </DialogContent>
    );
  };
  