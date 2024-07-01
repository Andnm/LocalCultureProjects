"use client";
import GeneralHeader from "@/src/components/shared/GeneralHeader";
import BannerSection from "./_components/BannerSection/BannerSeciton";
import React from "react";
import Footer from "@/src/components/landing/Footer";

import logo_remove_bg from "@/src/assets/logo.png";
import Image from "next/image";
import "../../src/styles/maintenance.css";
import Link from "next/link";

const IS_MAINTENANCE = true;

const HomeLayout = (props: { children: React.ReactNode }) => {
  //trang maintenance
  if (IS_MAINTENANCE) {
    return (
      <div className="background-maintenance">
        <Link
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-medium brand-name flex items-center gap-2"
        >
          <Image src={logo_remove_bg} width={100} height={100} alt="logo" />
          <p className="text-sm brand">
            Kho Dự án Truyền thông - Quảng bá <br />
            Sản phẩm Văn hóa Bản địa Việt Nam
          </p>
        </Link>
        <div className="main-maintenance">
          <div className="content-maintenance">
            <h3 className="title-maintenance">Trang web đang sửa chữa</h3>
            <p>
              Chúng tôi xin lỗi vì sự bất tiện này, nhưng trang web đang thực
              hiện một số bảo trì để mang lại trải nghiệm tốt nhất.
            </p>
          </div>
          <div className="">
            <img
              src="/something_wrong.svg"
              alt="Error"
              className="w-80 h-auto mb-2"
            />
          </div>
        </div>

        <div className="contact-maintenance">
          <h5>Thông tin liên lạc: </h5>
          <div className="info flex flex-col">
            <p className="text-lg font-semibold">
              Hoàng Vũ Quốc Anh {" "}
              <span className="text-sm italic">(Quản lý dự án)</span>
            </p>
            <div className="h-3" />
            <p>
              Hotline: <span className="font-semibold">0367082493</span>
            </p>
            <p>
              Email: <span className="font-semibold">anhhvq@fe.edu.vn</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <GeneralHeader />
      {props.children}
      {/* <Footer /> */}
    </>
  );
};

export default HomeLayout;
