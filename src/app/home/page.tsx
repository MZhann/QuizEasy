"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      <div className="flex items-center px-20 gap-4 mt-5">
        <Image src={'/assets/images/decoration/mini-man.png'} width={70} height={70} alt="mini man" />
        <p className="text-lg leading-5 text-gray-500 mt-2 italic">&quot;You can <span className="text-cyan-700 font-bold">create a quiz</span> or find whatever <span className="text-cyan-700 font-bold">quiz</span> you need!<br/> You can work on your <span className="text-cyan-700 font-bold">mistakes</span> or compete with others to get on top of the <span className="text-cyan-700 font-bold">leaderboard</span>&quot;</p>

      </div>



      <div className="w-full px-20 pt-10 mx-auto grid grid-cols-3 gap-6 z-20">
        {menuItems.map(({ title, route, description }, index) => (
          <Link key={index} href={route} passHref>
            <div
              className={`h-40 ${
              index % 2 === 0
                ? "bg-[url('/assets/images/decoration/main-page-block-bg.svg')]"
                : "bg-[url('/assets/images/decoration/background-2.svg')] text-orange-700"
              } bg-cover bg-center rounded-xl flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:saturate-150`}
            >
              <h2 className="underline text-2xl font-bold uppercase text-center">
              {title}
              </h2>
              <p className="text-center mt-2 text-sm leading-tight">
              {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
