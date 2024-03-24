"use client";

import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { BiSearchAlt2 } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BannerSection = () => {
  const router = useRouter();

  return (
    <section className="p-0 banner-section">
      {/* <div className="overlay"></div> */}
      <div className="container relative" style={{ height: "100%" }}>
        <div className="banner-content flex flex-col justify-center h-full">
          <p className="font-light text-4xl w-10/12">
            Kho Dự án Truyền thông - Quảng bá <br />
            Sản phẩm Văn hóa Bản địa Việt Nam
          </p>

          <p className="w-10/12 mt-8 text-justify" style={{width: "80%"}}>
            Dự án kết nối các doanh nghiệp nhỏ và hộ kinh doanh với sinh viên
            trường Đại học FPT nhằm lên ý tưởng và triển khai các chiến dịch
            marketing - truyền thông thực tế cho sản phẩm văn hóa bản địa của
            các doanh nghiệp này, dựa trên một mô hình truyền thông đặc thù được
            nghiên cứu và thiết kế riêng cho các loại hình sản phẩm văn hóa bản
            địa Việt Nam.
          </p>

          <div className="mt-8">
            <button
              className="btn-more"
              onClick={() => router.push("/about-us")}
            >
              <span></span>
              <p className="relative z-10">Tìm hiểu thêm</p>
            </button>
          </div>
        </div>

        <div className="absolute top-0" style={{ width: "60%", left: "50%" }}>
          <div className="img-banner">
            <img
              src="https://ss-images.saostar.vn/2020/02/15/6994345/7campusdhfpttphcm.jpg"
              alt="img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
