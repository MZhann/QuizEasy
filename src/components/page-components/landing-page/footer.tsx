"use client";
import { FC } from "react";

export const Footer: FC = () => (
  <footer className="w-full bg-white py-8 px-4 md:px-16 lg:px-32 border-t">
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="text-sm text-gray-500">
        © {new Date().getFullYear()} QuizEasy. All rights reserved.
      </div>
      {/* <div className="flex space-x-4 mt-4 md:mt-0">
        <Link href="/terms" className="hover:text-blue-500">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-blue-500">
          Privacy Policy
        </Link>
        <Link href="#contact" className="hover:text-blue-500">
          Contact Us
        </Link>
      </div> */}
    </div>
  </footer>
);
