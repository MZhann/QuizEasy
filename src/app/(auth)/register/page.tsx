"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import clsx from "clsx";

import { registerUser } from "@/api/auth"; // Update path as needed
import { useToast } from "@/hooks/use-toast";
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

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(0);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  // Steps array for optional display/reference
  const steps = ["Personal Info", "Account Details"];
  const totalSteps = steps.length;

  // Move to next step
  const nextStep = () => setStep((prev) => prev + 1);

  // Move back a step
  const prevStep = () => setStep((prev) => prev - 1);

  // Final submit that calls registerUser
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      const payload = {
        first_name: data.name,
        last_name: data.surname,
        email: data.email,
        password: data.password,
      };

      const response = await registerUser(payload);
      console.log(response);

      toast({
        variant: "success",
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      setIsLoading(false)
      router.push("/home"); // Redirect as needed
    } catch (error) {
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="flex w-full pt-20 justify-center min-h-screen bg-[#03174C] relative z-0" style={{ backgroundImage: "url('/assets/images/decoration/pink-bg.png')" }}>
      {/* <Image src="/assets/images/decoration/auth-bottom-left.png" className="absolute left-4 bottom-4 -z-10" width={380} height={380} alt='decor' /> 
      <Image src="/assets/images/decoration/auth-top-left.png" className="absolute left-5 top-5 -z-10" width={320} height={320} alt='decor' /> 
      <Image src="/assets/images/decoration/auth-top-right.png" className="absolute right-0 top-0 -z-10" width={350} height={310} alt='decor' /> 
      <Image src="/assets/images/decoration/auth-bottom-right.png" className="absolute right-5 bottom-5 -z-10" width={450} height={410} alt='decor' />  */}
      <Card className="w-8/12 sm:w-1/2 md:w-1/3">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold text-white">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent className="w-10/12 mx-auto">
          {/* Display which step we're on (optional) */}
          {/* <div className="text-center mt-4">
            <span className="text-sm text-gray-500">{steps[step]}</span>
          </div> */}

          <form
            onSubmit={
              step === totalSteps - 1
                ? handleSubmit(onSubmit)
                : handleSubmit(nextStep)
            }
          >
            {/* Step 0: Name, Surname */}
            {step === 0 && (
              <div className="space-y-8 mt-6">
                <div>
                  <Label htmlFor="name" className="pl-1 text-white">
                    Enter your name
                  </Label>
                  <Input
                    id="name"
                    placeholder="name"
                    className="border-4 border-gray-400"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="surname" className="pl-1 text-white">
                    Enter your surname
                  </Label>
                  <Input
                    id="surname"
                    className="border-4 border-gray-400"
                    placeholder="Your surname"
                    {...register("surname", {
                      required: "Surname is required",
                    })}
                  />
                  {errors.surname && (
                    <p className="text-sm text-red-500">
                      {errors.surname.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Email, Password */}
            {step === 1 && (
              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="email" className="pl-1 text-white">
                    Enter your email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="border-4 border-mylightblue"
                    placeholder="user@gmail.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="pl-1 text-white">
                    Create a password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="border-4 border-mylightblue"
                    placeholder="******"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col items-center mt-4 ">
              <div className="flex w-full justify-between">
                {/* Back button (show only in step 1) */}
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={prevStep}
                    className="mr-2"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <span /> // placeholder to maintain spacing
                )}

                <Button disabled={isLoading} type="submit" variant="blue" className={clsx('mt-4 h-10 border-4 border-white rounded-lg bg-[#DD669D] hover:bg-[#DD669D]/70', step==0 && 'w-full')}>
                  {step === totalSteps - 1 ? isLoading ? <Loader2 className="text-white animate-spin"/>  : "Register": "Next"}
                </Button>
              </div>
              <p className="text-sm text-center w-full mt-3 text-white">
                You Have an Account?{" "}
                <Link href="/login" className="text-white underline hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  );
}
