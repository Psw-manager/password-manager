"use client";
import { useSession } from "next-auth/react";
import { Password, columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import { fetchPasswords } from "./fetch_dashboard";

export default function DemoPage() {
  const { data: session, status } = useSession();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const loadPasswords = async () => {
        try {
          const email = session?.user?.email; 
          
          const data = await fetchPasswords(email);
          setPasswords(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadPasswords();
    }
  }, [session, status]); 

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={passwords} />
    </div>
  )
}
