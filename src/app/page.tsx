"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/api/user";

const menuItems = [
  {
    title: "Create Quiz",
    route: "/create-quiz",
    description: "Create your own custom test on any topic",
  },
  {
    title: "Quizzes",
    route: "/quizzes",
    description: "Take available AI-generated quizzes",
  },
  {
    title: "Mistakes",
    route: "/mistakes",
    description: "Practice questions you’ve previously answered incorrectly",
  },
  {
    title: "Leaderboard",
    route: "/leaderboard",
    description: "See how you rank among other students",
  },
];

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getProfile();
      } catch (e) {
        console.error("Error fetching profile:", e);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <>
      <h2 className="text-2xl font-semibold mt-10 px-20">Home page</h2>
      <div className="w-full px-20 pt-10 mx-auto grid grid-cols-3 gap-6">
        {menuItems.map(({ title, route, description }, index) => (
          <Link key={index} href={route} passHref>
            <div className="h-40 bg-[url('/assets/images/decoration/main-page-block-bg.svg')] bg-cover bg-center rounded-xl flex flex-col items-center justify-center text-white cursor-pointer transition-transform hover:scale-105">
              <h2 className="underline text-2xl font-bold uppercase text-center">
                {title}
              </h2>
              <p className="text-center mt-2 text-white/90 text-sm leading-tight">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
