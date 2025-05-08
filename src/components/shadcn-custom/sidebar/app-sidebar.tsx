"use client";

import Link from "next/link";
import Image from "next/image";
import { NavMain } from "@/components/shadcn-custom/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 
  const data = {
    user: {
      name: "userName",
      email: "no email",
      avatar: "/assets/images/profile-pics/robot-avatar.png",
    },
    navMain: [
      { title: "Home", url: "/home"},
      { title: "Quizzes", url: "/quizzes"},
      { title: "Mistake Bank", url: "/mistakes"},
      { title: "Leaderboard", url: "/leaderboard"},
      // { title: "Admin page", url: "/admin", icon: LockKeyhole },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/home"}>
            <Image
              src={"/assets/images/decoration/logo-hor.jpg"}
              className="rounded-lg"
              width={150}
              height={100}
              alt="logo"
            />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* {loading ? <h1>Loading...</h1> : <NavUser user={data.user} />} */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
