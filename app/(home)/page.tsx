"use client";

import React from "react";
import Home from "@/src/components/landing/Home";
import EarliestProjectList from "@/src/components/landing/EarliestProjectList";
import ContactUs from "@/src/components/landing/ContactUs";
import FormRegister from "@/src/components/landing/FormRegister";
import Footer from "@/src/components/landing/Footer";
import Policy from "./_components/Policy";
import BannerSection from "./_components/BannerSection/BannerSeciton";
import TopCompany from "@/src/components/landing/TopCompany";

const LandingPage = () => {
  return (
    <>
      <BannerSection />
      <div className="container">
        <Policy />
        <div className="h-px bg-gray-300"></div>
        <EarliestProjectList />
        <TopCompany />
        {/* <ContactUs /> */}
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
