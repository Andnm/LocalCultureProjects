"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/src/components/landing/Footer";

const Guideline = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop: any = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="container py-6">
        <h2 className="text-center font-bold text-3xl">
          Hướng dẫn sử dụng cho?
        </h2>

        <div className="choose-role"> 
        
        </div>
      </div>

      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top-btn">
          <span>↑</span>
        </button>
      )}

      <Footer />
    </>
  );
};

export default Guideline;
