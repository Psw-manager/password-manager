"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface PasswordDetailsProps {
  title: string;
  data?: {
    id?: string;  // Add an ID to identify the record
    site_name?: string;
    username?: string;
    password?: string;
    site_url?: string;
    category?: string;
    creation_date?: string;
    modification_date?: string;
    notes?: string;
  };
  button_exit: string;
  isUpdateMode: boolean; // Whether it's for updating or creating
}

export const PasswordDetails = ({ title, data, button_exit, isUpdateMode }: PasswordDetailsProps) => {
  const [formData, setFormData] = useState({
    site_name: data?.site_name || "",
    username: data?.username || "",
    password: data?.password || "",
    site_url: data?.site_url || "",
    category: data?.category || "",
    creation_date: data?.creation_date || "",
    modification_date: data?.modification_date || "",
    notes: data?.notes || "",
  });

  useEffect(() => {
    if (isUpdateMode && data?.id) {
      // Fetch the existing password data if updating
      fetch(`http://localhost:8000/api/passwords/?id=${data?.id}`)
        .then((response) => response.json())
        .then((fetchedData) => {
          setFormData({
            site_name: fetchedData.site_name,
            username: fetchedData.username,
            password: fetchedData.password,
            site_url: fetchedData.site_url,
            category: fetchedData.category,
            creation_date: fetchedData.creation_date,
            modification_date: fetchedData.modification_date,
            notes: fetchedData.notes,
          });
        })
        .catch((error) => console.error("Error fetching password data:", error));
    }
  }, [isUpdateMode, data?.id]);
  
  const { data: session, status } = useSession();
  const email = session?.user?.email; 

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const method = isUpdateMode ? "PUT" : "POST"; // PUT for update, POST for create
    const endpoint = isUpdateMode ? `http://localhost:8000/api/passwords/?id=${data?.id}` : `http://localhost:8000/api/password/add/?email=${email}`; // Different endpoints for update and create

    fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Password saved successfully", responseData);
        // You can add further handling here (like closing the dialog or showing a success message)
      })
      .catch((error) => {
        console.error("Error saving password:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{isUpdateMode ? `${title}` : `${title}`}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-3">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="site_name" className="text-right">
              Website Name
            </Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="col-span-3"
              type="password"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="site_url" className="text-right">
              Website URL
            </Label>
            <Input
              id="site_url"
              value={formData.site_url}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="flex flex-col space-y-1.5">
              <Select value={formData.category} onValueChange={(value) => setFormData((prevData) => ({ ...prevData, category: value }))}>
                <SelectTrigger id="category" >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creation_date" className="text-right">
              Created at
            </Label>
            <Input
              id="creation_date"
              disabled
              value={data?.creation_date || ""}
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
              value={data?.modification_date || ""}
              className="col-span-3 read-only"
            />
          </div>
          <Label htmlFor="notes" className="text-left">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Type your notes here."
          />
        </div>
        <DialogFooter>
          <Button type="submit">{isUpdateMode ? "Update Password" : "Create Password"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
