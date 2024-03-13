"use client";

import React from "react";
import "../../styles/landing/scroll-guide-style.scss";
import { FaMouse } from "react-icons/fa";

interface ScrollGuideProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const ScrollGuide: React.FC<ScrollGuideProps> = ({ containerRef }) => {
  const [scrollPercentage, setScrollPercentage] = React.useState(0);
  const [isShaking, setIsShaking] = React.useState(false);

  //handle horizontal scroll
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY || event.detail || (event as any).wheelDelta;
    if (containerRef.current) {
      containerRef.current.scrollLeft += delta;
    }
  };

  const updateScrollPercentage = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const percentage = (scrollLeft / maxScrollLeft) * 100;
      setScrollPercentage(percentage);
    }
  };

  React.useEffect(() => {
    if (containerRef.current) {
      window.addEventListener("wheel", handleWheel, { passive: false });
      containerRef.current.addEventListener("scroll", updateScrollPercentage);

      return () => {
        window.removeEventListener("wheel", handleWheel);
        if (containerRef.current) {
          containerRef.current.removeEventListener(
            "scroll",
            updateScrollPercentage
          );
        }
      };
    }
  }, [containerRef]);

  //handle arrow
  const handleNextArrowClick = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const nextContentPosition = container.scrollLeft + container.clientWidth;
      container.scrollTo({
        left: nextContentPosition,
        behavior: "smooth",
      });
    }
  };

  const handleBackArrowClick = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const previousContentPosition =
        container.scrollLeft - container.clientWidth;
      container.scrollTo({
        left: previousContentPosition,
        behavior: "smooth",
      });
    }
  };

  //shaking effect
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollPercentage === 0) {
        setIsShaking((prevIsShaking) => !prevIsShaking);
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [scrollPercentage]);

  return (
    <div className="scroll-guide-container fixed right-7 bottom-7 flex justify-center items-center flex-nowrap">
      <button
        className={`arrow ${
          scrollPercentage === 0 ? "arrow-guide" : "arrow-box"
        }`}
        onClick={
          scrollPercentage === 0 ? handleNextArrowClick : handleBackArrowClick
        }
      >
        <div
          className={`flex justify-center items-center gap-2 ${
            isShaking ? "effect-shaking" : ""
          }`}
        >
          {scrollPercentage === 0 && <p className="">Scroll</p>}

          <svg
            className={`${scrollPercentage === 0 ? "back-rotate" : "rotate"}`}
            width="16"
            height="14"
            viewBox="0 0 16 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.996-.003l7.001 7.001-.707.707L9 14.001l-.707-.707 5.789-5.797L0 7.498v-1h14.082L8.289.703l.707-.707z"
              fillRule="nonzero"
            ></path>
          </svg>
        </div>
      </button>

      <div className="loading-bar">
        <div
          className="progress-bar"
          style={{ width: `${scrollPercentage}%` }}
        ></div>
      </div>

      <button
        className="arrow arrow-box"
        onClick={
          scrollPercentage === 100 ? handleBackArrowClick : handleNextArrowClick
        }
      >
        <svg
          className={`${scrollPercentage === 100 ? "rotate" : "back-rotate"} ${
            isShaking ? "effect-shaking" : ""
          }`}
          width="16"
          height="14"
          viewBox="0 0 16 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.996-.003l7.001 7.001-.707.707L9 14.001l-.707-.707 5.789-5.797L0 7.498v-1h14.082L8.289.703l.707-.707z"
            fillRule="nonzero"
          ></path>
        </svg>
      </button>

      {scrollPercentage === 0 && (
        <div className="hover-text flex justify-center text-start">
          <div className="mt-1">
            <FaMouse />
          </div>
          Cuộn bằng chuột của bạn hoặc bấm vào mũi tên để di chuyển tới trang
          khác
        </div>
      )}
    </div>
  );
};

export default ScrollGuide;
