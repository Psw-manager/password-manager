"use client";
import { useSession } from "next-auth/react";
import { Password, columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function getData(): Promise<Password[]> {
  // Fetch data from your API here.
  return [
    {
      "password_id": "728ed52f",
      "website_name": "Facebook",
      "username": "123@gmail.com",
      "category": "Media"
    },
    {
      "password_id": "a9c8d21b",
      "website_name": "Instagram",
      "username": "john_doe23@gmail.com",
      "category": "Social Media"
    },
    {
      "password_id": "b1f9e13a",
      "website_name": "Twitter",
      "username": "janedoe_1987@gmail.com",
      "category": "Social Media"
    },
    {
      "password_id": "c10e1d29",
      "website_name": "Amazon",
      "username": "shopper2020@gmail.com",
      "category": "E-commerce"
    },
    {
      "password_id": "d92a3f1b",
      "website_name": "Netflix",
      "username": "moviebuff92@gmail.com",
      "category": "Streaming"
    },
    {
      "password_id": "e6b2f19a",
      "website_name": "LinkedIn",
      "username": "business_pro22@gmail.com",
      "category": "Professional"
    },
    {
      "password_id": "f1d34a90",
      "website_name": "GitHub",
      "username": "dev_guy99@gmail.com",
      "category": "Developer"
    },
    {
      "password_id": "g123f92e",
      "website_name": "Slack",
      "username": "teamlead97@gmail.com",
      "category": "Communication"
    },
    {
      "password_id": "h87f9a21",
      "website_name": "Spotify",
      "username": "musicfan2021@gmail.com",
      "category": "Streaming"
    },
    {
      "password_id": "i4e9c1b7",
      "website_name": "YouTube",
      "username": "contentcreator45@gmail.com",
      "category": "Media"
    },
    {
      "password_id": "j2d4a5f8",
      "website_name": "Dropbox",
      "username": "cloudstorageuser@gmail.com",
      "category": "Cloud Storage"
    },
    {
      "password_id": "k1d9f8b2",
      "website_name": "PayPal",
      "username": "payments_user1@gmail.com",
      "category": "Finance"
    },
    {
      "password_id": "l7c3d5f6",
      "website_name": "Snapchat",
      "username": "snappy_user44@gmail.com",
      "category": "Social Media"
    },
    {
      "password_id": "m0e9d8f3",
      "website_name": "Pinterest",
      "username": "pinner1234@gmail.com",
      "category": "Social Media"
    },
    {
      "password_id": "n1f2d3a4",
      "website_name": "Reddit",
      "username": "redditfan2022@gmail.com",
      "category": "Community"
    },
    {
      "password_id": "o7d9f8e1",
      "website_name": "Amazon Prime",
      "username": "primeuser2021@gmail.com",
      "category": "Streaming"
    }
  ]
  
}

export default function DemoPage() {
  const { data: session, status } = useSession();  // Using useSession to check session
  const [data, setData] = useState<Password[]>([]); 
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 
    
    if (!session) {
  
      router.push("/"); 
    }
  }, [session, status, router]); 

  if (status === "loading") {
    return <p>Loading...</p>; 
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
