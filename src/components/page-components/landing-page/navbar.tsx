"use client";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const Navbar: FC = () => {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-4 md:px-16 lg:px-32 bg-white shadow-md sticky top-0 z-50">
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/images/decoration/logo.jpg"
          alt="QuizEasy Logo"
          width={70}
          height={70}
        />
        {/* <span className="ml-2 text-xl font-bold">QuizEasy</span> */}
      </Link>
      <div className="hidden md:flex items-center space-x-8">
        <Link href="#features" className="hover:text-blue-500">
          Features
        </Link>
        <Link href="#how-it-works" className="hover:text-blue-500">
          How It Works
        </Link>
        <Link href="#why-us" className="hover:text-blue-500">
          Why Us?
        </Link>
      </div>
      <Button asChild size="sm">
        <Link href="/home">Get Started</Link>
      </Button>
    </nav>
  );
};
