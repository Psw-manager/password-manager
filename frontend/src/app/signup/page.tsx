"use client";
import Image from "next/image";
import { TbCircleKeyFilled } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import axios from "axios"; 
import { useState } from "react";
import { toast } from "sonner";
import router, { useRouter } from "next/router";


const FormSchema = z.object({
  email: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  password_confirmation: z.string().min(8, { message: "Password must be at least 8 characters long." }),
}).refine(data => data.password === data.password_confirmation, {
  path: ['password_confirmation'], 
  message: "Passwords do not match.",
});

export default function SignupPage() {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setErrorMessage(""); 
  
    try {
      const { email, password } = values;  
      const response = await axios.post('http://localhost:8000/api/register/', { email, password });
  
      console.log(response.data);
      toast("Registration has been successful!", {
        action: {
          label: "X",
          onClick: () => console.log("exit"),
        },
      })
      form.reset();
      

  
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="hidden lg:flex flex-col h-full w-1/2 justify-center">
          <div className="flex flex-row space-x-6 pl-20 pr-10">
            <div className="flex items-center justify-center w-30 h-30 rounded-xl bg-white outline outline-4 outline-black p-2">
              <Image src="/login.png" alt="test" width="70" height="70" />
            </div>
            <h1 className="flex text-5xl select-none font-bold items-center">
              KeyNest
            </h1>
          </div>

          <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5"></div>
            <div className="italic text-lg">
              Keep your passwords in one place
            </div>
          </div>

          <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5"></div>
            <div className="italic text-lg">Secure data storage</div>
          </div>

          <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5"></div>
            <div className="italic text-lg">
              Generate strong passwords for websites
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center lg:w-1/2 dark:bg-[url('/background.jpg')] bg-[url('/background-lighter.jpg')]">
          <div className="w-2/3 flex flex-col items-center justify-center bg-slate-500 rounded-3xl shadow-lg p-5 space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4 w-full">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500">
                <TbCircleKeyFilled className="h-10 w-10" />
              </div>

              <h1 className="before:text-black dark:before:text-white font-extrabold text-3xl">
                Sign up!
              </h1>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-9/12 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email..." {...field} required/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your password..." type="password" {...field} required/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your password again..." type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center p-2 mt-4">
                    <Button type="submit" className="w-2/5 text-base" disabled={loading}>
                      {loading ? 'Signing up...' : 'Sign up'}
                    </Button>
                  </div>
                </form>
              </Form>
              {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
              <p className="whitespace-nowrap text-base">
                You already have an account?{" "}
                <Link href="/" className="underline hover:text-blue-800">
                  Login.{" "}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
