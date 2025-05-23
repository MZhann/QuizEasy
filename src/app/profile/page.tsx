'use client'

import { useState, useEffect } from "react";
import { getProfile } from "@/api/user"; // Adjust the import path as needed
import {ProfileResponse} from "@/types/userTypes"
import ProfileData from "@/components/page-components/profile-page/profile-data";
import { Loader2 } from "lucide-react";
import UserStats from "@/components/page-components/profile-page/statistics-section";
import MyGeneratedQuizzes from "@/components/page-components/profile-page/generated-quizes";

const Profile = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggerProfileInfo, setTriggerProfileInfo] = useState<boolean>(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [triggerProfileInfo]);

  if (loading) {
    return <div className="text-center mt-10 w-full flex justify-center items-center h-[]"><Loader2 className="size-12 text-mylightblue animate-spin" /></div>;
  }

  if (error || !profile) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full items-center px-20 pt-10">
      <ProfileData firstName={profile.first_name} lastName={profile.last_name} email={profile.email} setTriggerProfileInfo={setTriggerProfileInfo} triggerProfileInfo = {triggerProfileInfo} />
      <UserStats />
      <MyGeneratedQuizzes />
    </div>
  );
};

export default Profile;
