"use client";

import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  ABOUT_US_HEADER,
  ANOTHER_OBJECT,
  EXAMPLE_PROJECT,
  MAIN_STUDENT_TEAM,
  MISSION,
  OBJECT_PROJECT,
  SUB_STUDENT_TEAM,
  THS_TEAM,
} from "@/src/constants/about_us_page";
import Image from "next/image";
import { TeamMemberInfo } from "@/components/TeamMemberInfo";
import Aos from "aos";
import "aos/dist/aos.css";
import { Hint } from "@/components/hint";
import logo from "@/src/assets/logo.png";

const MAX_IMG_THS = 220;
const MAX_IMG_MAIN_STUDENT = 170;
const MAX_IMG_SUB_STUDENT = 120;
const MAX_WIDTH_IMG = 300;
const MAX_HEIGH_IMG = 200;

const AboutUs = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const [showTopMenu, setShowTopMenu] = useState(false);
  const [activeSection, setActiveSection] = useState(ABOUT_US_HEADER[0].id);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const router = useRouter();

  const aboutRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef(null);
  const objectProjectRef = useRef(null);
  const feasibilityRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }

      if (aboutRef.current) {
        if (window.scrollY > (aboutRef.current?.offsetTop || 0)) {
          setShowTopMenu(true);
        } else {
          setShowTopMenu(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;

      ABOUT_US_HEADER.forEach((item) => {
        const sectionRef = getRefById(item.id);
        if (sectionRef) {
          const offset = 100;
          const topPos = sectionRef.offsetTop - offset;
          const bottomPos = topPos + sectionRef.offsetHeight;

          if (scrollPos >= topPos && scrollPos < bottomPos) {
            setActiveSection(item.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // xử lý liên quan đến scroll
  const getRefById = (id: number) => {
    switch (id) {
      case 1:
        return aboutRef.current;
      case 2:
        return missionRef.current;
      case 3:
        return objectProjectRef.current;
      case 4:
        return feasibilityRef.current;
      default:
        return null;
    }
  };

  const scrollToTop: any = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (ref: any) => {
    const offset = 40;
    const topPos = ref.current.offsetTop - offset;
    window.scrollTo({ top: topPos, behavior: "smooth" });
  };

  const handleClickItemHeader = (item: any) => {
    switch (item.id) {
      case 1:
        if (aboutRef.current) scrollToTop();
        break;
      case 2:
        if (missionRef.current) {
          scrollToSection(missionRef);
        }
        break;
      case 3:
        if (objectProjectRef.current) {
          scrollToSection(objectProjectRef);
        }
        break;
      case 4:
        if (feasibilityRef.current) {
          scrollToSection(feasibilityRef);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="about-us-container">
      {showTopMenu && (
        <div className="general-management__menu">
          <ul>
            <li>
              <a onClick={() => router.push("/")}>
                <Image src={logo} width={55} height={55} alt="logo" />
              </a>
            </li>
            {ABOUT_US_HEADER.map((item, index) => (
              <li key={index} className="flex items-center justify-center">
                <a
                  className={activeSection === item.id ? "active" : ""}
                  onClick={() => handleClickItemHeader(item)}
                >
                  {item.nameItem}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Giới thiệu */}
      <div
        ref={aboutRef}
        className="py-10"
        style={{ backgroundColor: "#f4f5f9" }}
      >
        <div className="relative">
          <div className="container banner-about-us"></div>

          <div
            className="absolute z-1 p-6 -bottom-10"
            style={{
              backgroundColor: "#EEEEEE",
              left: "40%",
              borderRadius: "25px",
            }}
          >
            <h1 className="text-2xl">
              Thông tin về <span>Chúng tôi</span>
            </h1>
          </div>
        </div>

        <div className="container banner-content flex flex-row justify-between mt-20 gap-2">
          <div style={{ width: "45%" }}>
            <h1 className="font-normal mb-5" style={{ fontSize: "30px" }}>
              Kho Dự án Truyền thông - <br />
              <span> Quảng bá sản phẩm văn hóa bản địa Việt Nam</span>
            </h1>

            <div>
              <button
                className="btn-contact"
                onClick={() => router.push("/contact")}
              >
                <span></span>
                <p className="flex items-center text-center justify-center gap-3">
                  Liên hệ{" "}
                  <MdOutlineArrowRightAlt
                    style={{
                      fill: "#5eaae3",
                    }}
                  />
                </p>
              </button>
            </div>
          </div>

          <p style={{ width: "50%" }} className="text-justify text-lg">
            Là dự án kết nối các doanh nghiệp nhỏ và hộ kinh doanh với sinh viên
            trường Đại học FPT nhằm lên ý tưởng và triển khai các chiến dịch
            marketing - truyền thông thực tế cho sản phẩm văn hóa bản địa của
            các doanh nghiệp này, dựa trên một mô hình truyền thông đặc thù được
            nghiên cứu và thiết kế riêng cho các loại hình sản phẩm văn hóa bản
            địa Việt Nam
          </p>
        </div>
      </div>

      {/* sứ mệnh */}
      <div ref={missionRef} className="py-12 container">
        <h2 data-aos="fade-in" className="font-semibold title-section mb-4">
          Sứ mệnh
        </h2>

        <div
          data-aos="fade-up"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 py-6"
        >
          {MISSION.map((item, index) => (
            <div
              key={index}
              className="border-2 border-gray-300 cursor-pointer p-4 rounded-lg h-full flex flex-col items-center transition-transform transform-gpu hover:scale-105"
              style={{
                borderRadius: "25px",
              }}
            >
              <div style={{ width: "150px", height: "200px" }}>
                <img
                  src={item.image}
                  alt={item.content}
                  loading="lazy"
                  className="mx-auto w-full h-full"
                />
              </div>

              <h4 className="text-2xl font-semibold mt-4">{item.title}</h4>
              <p className="mt-2 text-justify">{item.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Đối tượng dự án */}
      <div ref={objectProjectRef} className="background-gray">
        <div className="py-12 container flex items-center flex-col">
          <h2 data-aos="fade-down" className="font-semibold title-section">
            Đối tượng dự án
          </h2>
          <h4 data-aos="fade-down" className="font-normal subtitle-section">
            Sản phẩm văn hóa bản địa sở hữu ít nhất một trong các đặc điểm dưới
            đây:
          </h4>

          <div className="flex flex-col items-center gap-10 mt-12 mb-20">
            {OBJECT_PROJECT.map((item, index) => (
              <div
                data-aos={`${index % 2 === 0 ? "fade-right" : "fade-left"}`}
                key={index}
                className={`flex flex-row w-8/12 gap-16 items-center ${
                  index % 2 === 0 ? "flex-row-reverse" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.content}
                  loading="lazy"
                  className="mx-auto w-full h-full"
                  style={{
                    width: `${MAX_WIDTH_IMG}px`,
                    height: `${MAX_HEIGH_IMG}px`,
                  }}
                />
                <p className="mt-2 flex-grow text-lg text-center">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <h4
            data-aos="fade-down"
            className="font-normal subtitle-section"
            style={{ width: "60%" }}
          >
            Dự án hướng tới các doanh nghiệp nhỏ, hộ kinh doanh đang sản xuất -
            kinh doanh các sản phẩm văn hóa bản địa Việt Nam:
          </h4>

          <div className="py-6 flex flex-wrap gap-10 justify-center items-center mt-6">
            {ANOTHER_OBJECT.map((item, index) => (
              <div
                data-aos="flip-up"
                key={index}
                className={`flex flex-col gap-2 items-center`}
                style={{ width: "33%" }}
              >
                <div
                  style={{
                    width: `300px`,
                    height: `200px`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.content}
                    loading="lazy"
                    className="mx-auto w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-lg text-center w-9/12">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tính khả thi dự án */}
      <div
        ref={feasibilityRef}
        className="py-12 container flex flex-col justify-center items-center"
      >
        <h2 data-aos="fade-down" className="font-semibold title-section mb-4">
          Tính khả thi dự án
        </h2>
        <h4 data-aos="fade-down" className="font-normal subtitle-section">
          Đội ngũ
        </h4>

        <div data-aos="zoom-in" className="flex flex-row my-10 w-full">
          <div className="grid" style={{ width: "70%" }}>
            {/* Ths */}
            <div className="grid grid-cols-2 mb-6">
              {THS_TEAM.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="rounded-full overflow-hidden border-2 border-gray-200"
                    style={{
                      width: `${MAX_IMG_THS}px`,
                      height: `${MAX_IMG_THS}px`,
                    }}
                  >
                    <TeamMemberInfo
                      sideOffset={10}
                      side={"right"}
                      dataMember={item}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="mx-auto"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </TeamMemberInfo>
                  </div>
                  <h4
                    className="mt-2 font-bold text-lg"
                    style={{
                      color: "rgb(88, 126, 211)",
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>
              ))}
            </div>

            {/* main student */}
            <div className="grid grid-cols-2">
              {MAIN_STUDENT_TEAM.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="rounded-full overflow-hidden border-2 border-gray-200"
                    style={{
                      width: `${MAX_IMG_MAIN_STUDENT}px`,
                      height: `${MAX_IMG_MAIN_STUDENT}px`,
                    }}
                  >
                    <TeamMemberInfo
                      sideOffset={10}
                      side={"right"}
                      dataMember={item}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="mx-auto"
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </TeamMemberInfo>
                  </div>
                  <h4
                    className="mt-2 font-bold"
                    style={{
                      color: "rgb(88, 126, 211)",
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* sub student */}
          <div
            className="flex flex-col items-center gap-3"
            style={{ width: "30%" }}
          >
            {SUB_STUDENT_TEAM.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-fit">
                <div
                  className="rounded-full overflow-hidden border-2 border-gray-200 relative"
                  style={{
                    width: `${MAX_IMG_SUB_STUDENT}px`,
                    height: `${MAX_IMG_SUB_STUDENT}px`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className={`mx-auto absolute ${
                      item.id === 3 && "-bottom-9"
                    } ${item.id === 1 && "bottom-0"}`}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h4
                  className="mt-2 font-bold"
                  style={{
                    color: "rgb(88, 126, 211)",
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        <h4 data-aos="fade-down" className="font-normal subtitle-section">
          Dự án từng thực hiện
        </h4>
        <div
          data-aos="zoom-in-down"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 py-6"
        >
          {EXAMPLE_PROJECT.map((item, index) => (
            <div
              key={index}
              className=""
              style={{
                width: `${MAX_WIDTH_IMG}px`,
              }}
            >
              <div
                style={{
                  width: `${MAX_WIDTH_IMG}px`,
                  height: `${MAX_HEIGH_IMG}px`,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="mx-auto w-full h-full"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>

              <div className="h-2"> </div>

              {item?.link ? (
                <Hint
                  sideOffset={1}
                  description={`Bấm vào đây để coi chi tiết`}
                  side={"top"}
                >
                  <a
                    className="text-center text-blue-700"
                    href={item?.link}
                    target="_blank"
                  >
                    {item.name}
                  </a>
                </Hint>
              ) : (
                <p className="text-center text-blue-700">{item.name}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top-btn">
          <span>↑</span>
        </button>
      )}
    </div>
  );
};

export default AboutUs;
