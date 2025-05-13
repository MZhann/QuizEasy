"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      const response = await loginUser(data);
      console.log(response);
      // toast({
      //   variant: "success",
      //   title: "Login Successful",
      //   description: "Welcome back!",
      // });
      setIsLoading(false)
      router.push("/home"); // Redirect after successful login
    } catch (error) {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="flex w-full pt-20 justify-center min-h-screen relative z-0" style={{ backgroundImage: "url('/assets/images/decoration/pink-bg.png')" }}>
      {/* <Image  src="/assets/images/decoration/auth-bottom-left.png" className="absolute left-4 bottom-4 -z-10" width={380} height={380} alt='decor' /> 
      <Image  src="/assets/images/decoration/auth-top-left.png" className="absolute left-5 top-5 -z-10" width={320} height={320} alt='decor' /> 
      <Image  src="/assets/images/decoration/auth-top-right.png" className="absolute right-0 top-0 -z-10" width={350} height={310} alt='decor' /> 
      <Image  src="/assets/images/decoration/auth-bottom-right.png" className="absolute right-5 bottom-5 -z-10" width={450} height={410} alt='decor' />  */}
      <Card className="w-8/12 sm:w-1/2 md:w-1/3">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold text-white">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent className="w-10/12 mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
            <div>
              <Label htmlFor="email" className="pl-1 text-white">
                Enter your email
              </Label>
              <Input
                id="email"
                className="border-4 border-gray-400"
                type="email"
                placeholder="user@gmail.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="pl-1 text-white">
                Enter your password
              </Label>
              <Input
                id="password"
                type="password"
                className="border-4 border-gray-400"
                placeholder="********"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="blue"
              className="w-full bg-[#DD669D] hover:bg-[#DD669D]/70 h-10 border-4 border-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="text-white animate-spin"/> : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center flex justify-center">
          <p className="text-sm text-white">
            If you are a new user{" "}
            <Link href="/register" className="text-white underline hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
