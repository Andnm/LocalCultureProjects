"use client";
import GeneralHeader from "@/src/components/shared/GeneralHeader";
import BannerSection from "./_components/BannerSection/BannerSeciton";
import React from "react";
import Footer from "@/src/components/landing/Footer";

const HomeLayout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <GeneralHeader />
      {props.children}
      <Footer />
    </>
  );
};

export default HomeLayout;
