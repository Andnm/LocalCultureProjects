"use client";

import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { BiSearchAlt2 } from "react-icons/bi";

const BannerSection = () => {
  return (
    <section className="p-0 banner-section">
      <div className="overlay"></div>

      <div className="container banner-content">
        <div className="flex gap-2">
          <p className="font-semibold">An tâm với 100% dự án đã qua xác thực</p>
        </div>

        <h1 className="my-3" style={{fontSize: '2.3rem'}}>Lựa chọn dự án ưng ý của bạn</h1>

        <div className="flex gap-5">
          <p className="nav__item font-bold active">Nông nghiệp</p>

          <p className="nav__item font-bold">Thủ công nghiệp</p>
        </div>

        <div className="form-search flex items-center mt-4">
          <BiSearchAlt2 className="text-black mx-2" />
          <input className="" type="search" placeholder="Tìm kiếm dự án" />
          <button className="btn px-4 py-2" style={{width: '120px'}}>Tìm kiếm</button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <p className="font-semibold">Gợi ý: </p>
          <div className="list-suggest flex items-center gap-2">
            <div
              className="btn btn-outline-light"
            >
             
            </div>
            <div
              className="btn btn-outline-light"
            >
             
            </div>
            <div
              className="btn btn-outline-light"
            >
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
