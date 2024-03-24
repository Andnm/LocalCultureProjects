import Link from "next/link";
import React from "react";
import "../../styles/landing/home-style.scss";
import { BsTelephone } from "react-icons/bs";
import Image from "next/image";
import logo_remove_bg from "@/src/assets/logo.png";

const Footer = () => {
  const LinkGroup: React.FC<any> = ({ children }) => {
    return (
      <>
        <ul className="flex w-full flex-row justify-between items-center gap-4">
          {children}
        </ul>
      </>
    );
  };

  const NavLink: React.FC<any> = ({ link, label }) => {
    return (
      <li>
        <a
          href={link}
          className="inline-block text-base leading-loose text-body-color hover:text-orange-400"
        >
          {label}
        </a>
      </li>
    );
  };

  return (
    <footer
      className="relative pt-16 pb-10"
      style={{ backgroundColor: "#496179" }}
    >
      <div className="container text-white flex flex-col items-center">
        <div className="w-full flex">
          <h5
            className="title w-fit relative bottom-3 font-semibold"
            style={{ width: "12.5rem" }}
          >
            LIÊN HỆ NHANH
          </h5>
          <div
            className="flex flex-row items-center gap-28"
            style={{
              flexGrow: 1,
              padding: "10px 0",
              borderColor: "white",
              borderTopWidth: "1px",
            }}
          >
            <div className="brand">
              <Link
                href="/"
                className="mr-4 cursor-pointer py-1.5 font-medium brand-name flex items-center gap-2"
              >
                <Image
                  src={logo_remove_bg}
                  width={150}
                  height={150}
                  alt="logo"
                />
                <p className="text-base font-semibold">
                  Kho Dự án Truyền thông - Quảng bá <br />
                  Sản phẩm Văn hóa Bản địa Việt Nam
                </p>
              </Link>
            </div>

            <div className="info flex flex-col">
              <p className="text-lg font-semibold">Hoàng Vũ Quốc Anh (Mr.) </p>
              <p className="text-sm italic">Quản lý dự án</p>
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

        <div className="w-full flex">
          <h5
            className="title w-fit relative bottom-3 font-semibold"
            style={{ width: "12.5rem" }}
          >
            TRUY CẬP NHANH
          </h5>
          <div
            style={{
              flexGrow: 1,
              padding: "20px 0",
              borderColor: "white",
              borderTopWidth: "1px",
            }}
          >
            <LinkGroup>
              <NavLink link="/about-us" label="Giới thiệu" />
              <NavLink link="/project-list" label="Danh sách dự án" />
              <NavLink link="/guideline" label="Hướng dẫn sử dụng" />
              <NavLink link="/contact" label="Liên hệ" />
            </LinkGroup>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
