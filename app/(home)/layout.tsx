"use client";
import GeneralHeader from "@/src/components/shared/GeneralHeader";
import BannerSection from "./_components/BannerSection/BannerSeciton";
import React from "react";

const HomeLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <GeneralHeader />
      {props.children}
    </div>
  );
};

export default HomeLayout;
