"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Password = {
  password_id: string;
  website_name: string;
  username: string;
  category: string;
};

export const columns: ColumnDef<Password>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "website_name",
    header: "Website Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <Dialog >
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Password Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website_name" className="text-right">
                  Website Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">

                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div> 

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input id="password" value="**********" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  Website URL
                </Label>
                <Input id="url" value="https:localhost:3000/" className="col-span-3" />
              </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creation_date" className="text-right">
                  Created at
                </Label>
                <Input id="creation_date" disabled value="08/02/2023" className="col-span-3 read-only" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4 mb-6">
            <Label htmlFor="modification_date" className="text-right">
                  Last Modification Date
                </Label>
                <Input id="modification_date" disabled value="08/02/2023" className="col-span-3 read-only" />
              </div>

            <Label htmlFor="notes" className="text-left">
                  Notes
                </Label>
                <Textarea placeholder="Type your notes here." id="message"/>
            

            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
