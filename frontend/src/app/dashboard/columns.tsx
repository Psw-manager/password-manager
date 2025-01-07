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
import { PasswordDetails } from "@/components/PasswordDetails";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MdDeleteForever } from "react-icons/md";
import * as React from "react";
import { useSession } from "next-auth/react";


export type Password = {
  id: string;
  site_name: string;
  username: string;
  password: string;
  site_url: string;
  category: string;
  creation_date: string;
  modification_date: string;
  notes: string;
};



export const columns: ColumnDef<Password>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "site_name",
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
    accessorKey: "site_url",
    header: "Website URL",
    enableHiding: true, // Hidden column
    enableSorting: false, // Disable sorting
  },
  {
    accessorKey: "password",
    header: "Password",
    enableHiding: true, // Hidden column
    enableSorting: false, // Disable sorting
  },
  {
    accessorKey: "creation_date",
    header: "Created At",
    enableHiding: true, // Hidden column
    enableSorting: false, // Disable sorting
  },
  {
    accessorKey: "modification_date",
    header: "Last Modified",
    enableHiding: true, // Hidden column
    enableSorting: false, // Disable sorting
  },
  {
    accessorKey: "notes",
    header: "Notes",
    enableHiding: true, // Hidden column
    enableSorting: false, // Disable sorting
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const passwordId = row.original.id;
      const passwordData = row.original; 
      const [isDeleting, setIsDeleting] = React.useState(false);
      const { data: session, status } = useSession();
      const email = session?.user?.email;
      

      const handleDelete = async () => {
        try {
          if(email){
            
          setIsDeleting(true);
          await fetch(`http://localhost:8000/api/delete-password?email=${email}&id=${passwordId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          setIsDeleting(false);
          window.location.reload();
        }
        } catch (error) {
          setIsDeleting(false);
          alert("Failed to delete password.");
          console.error("Failed to delete password:", error);
        }
      };

      return (
        <div className="flex items-center justify-end gap-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DialogTrigger>
          <PasswordDetails
            title="Password details"
            data={passwordData}
            passwordId={passwordId}
            button_exit="Save changes"
            isUpdateMode={true}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="mr-4">
              <MdDeleteForever className="text-2xl" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove your selected passwords.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} 
                  className="bg-destructive hover:bg-red-800"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>      
      );
    },
  },
];
