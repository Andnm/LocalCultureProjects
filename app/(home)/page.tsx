"use client";

import React, { useEffect } from "react";
import BannerSection from "./_components/BannerSection/BannerSeciton";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [userLogin, setUserLogin] = useUserLogin();
  const router = useRouter();

  useEffect(() => {
    if (userLogin?.status === false || userLogin?.role_name === null) {
      router.push("/register");
    }
  }, [userLogin]);

  return (
    <>
      <BannerSection />
    </>
  );
};

export default LandingPage;
