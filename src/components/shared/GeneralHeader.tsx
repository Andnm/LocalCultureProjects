"use client";
import React from "react";
import Link from "next/link";
import { Typography } from "@material-tailwind/react";

import "../../styles/general-header-style.scss";
import { usePathname } from "next/navigation";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { useUserData } from "@/src/hook/useUserData";
import DropDownUser from "./DropDownUser";
import { UserType } from "@/src/types/user.type";
import { getUserFromSessionStorage } from "@/src/redux/utils/handleUser";
import {
  NAV_ITEMS_BUSINESS,
  NAV_ITEMS_GENERAL,
  NAV_ITEMS_LECTURER,
  NAV_ITEMS_STUDENT,
} from "@/src/constants/header_page";
import Image from "next/image";
import logo_remove_bg from "@/src/assets/logo-remove-bg.png";
import logo from "@/src/assets/logo.png";
import { useAuthContext } from "@/src/utils/context/auth-provider";
import ModalCreateProject from "./ModalCreateProject";

const GeneralHeader = () => {
  const [isLoginModalOpen, setLoginModalOpen] = React.useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = React.useState(false);
  const [openRegisterMode, setOpenRegisterMode] = React.useState(false);
  const [openModalCreateProject, setOpenModalCreateProject] =
    React.useState(false);

  const [showTopMenu, setShowTopMenu] = React.useState(false);

  const { loginInfo, setLoginInfo }: any = useAuthContext();

  const [userData, setUserData] = React.useState<any | null>(null);
  const pathName = usePathname();

  //scroll thì sẽ thêm fixed
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowTopMenu(true);
      } else {
        setShowTopMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const user = getUserFromSessionStorage();
    setUserData(user);
  }, []);

  React.useEffect(() => {
    const user = getUserFromSessionStorage();
    setUserData(user);
  }, [isLoginModalOpen, isRegisterModalOpen, loginInfo]);

  const switchFromLoginToRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
    setOpenRegisterMode(true);
  };

  const switchFromRegisterToLogin = () => {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
    setOpenRegisterMode(false);
  };

  const handleCloseAction = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
    setOpenRegisterMode(false);
  };

  const getNavItems = () => {
    if (userData && userData.role_name) {
      switch (userData.role_name) {
        case "Student":
          return NAV_ITEMS_STUDENT;
        case "Business":
          return NAV_ITEMS_BUSINESS;
        case "Lecturer":
          return NAV_ITEMS_LECTURER;
        default:
          return NAV_ITEMS_GENERAL;
      }
    } else {
      return NAV_ITEMS_GENERAL;
    }
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {getNavItems().map((item, index) => (
        <Typography
          key={index}
          as="li"
          variant="small"
          color="white"
          className="p-1 font-normal nav-items"
        >
          <Link
            href={item?.path}
            className={`flex items-center ${
              pathName.includes(item?.path) && "active"
            }`}
          >
            {item?.nameItem}
          </Link>
        </Typography>
      ))}
    </ul>
  );

  return (
    <div
      className={`general-header-container ${userData && "header-white "}
      top-0 z-10 h-max max-w-full border-0 rounded-none px-4 py-2 lg:px-8 lg:py-3`}
    >
      <div className="container flex items-center justify-between text-white">
        <Link
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-medium brand-name flex items-center gap-2"
        >
          <Image src={logo_remove_bg} width={55} height={55} alt="logo" />
          <p className="text-sm brand">
            Kho Dự án Truyền thông - Quảng bá <br />
            Sản phẩm Văn hóa Bản địa Việt Nam
          </p>
        </Link>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>

          <div className="flex items-center justify-between gap-2">
            {userData ? (
              <DropDownUser setUserData={setUserData} userData={userData} />
            ) : (
              <>
                <button
                  className="hidden lg:inline-block btn-signup"
                  onClick={() => {
                    setLoginModalOpen(true);
                  }}
                >
                  <span className="text-black">Đăng nhập</span>
                </button>

                {isLoginModalOpen && (
                  <Login
                    actionClose={handleCloseAction}
                    switchFromLoginToRegister={switchFromLoginToRegister}
                  />
                )}
                {/* 
                <button
                  className="hidden lg:inline-block btn-signup"
                  onClick={() => {
                    setRegisterModalOpen(true);
                  }}
                >
                  <span className="text-black hover:text-white">Đăng kí</span>
                </button> */}

                {isRegisterModalOpen && (
                  <Register
                    switchFromRegisterToLogin={switchFromRegisterToLogin}
                    actionClose={handleCloseAction}
                  />
                )}
              </>
            )}

            {(userData?.role_name !== "Student" ||
              userData?.role_name !== "Lecturer") && (
              <button
                className="hidden lg:inline-block btn-login"
                onClick={() => {
                  setOpenModalCreateProject(true);
                }}
              >
                <span className="text-black">Đăng dự án ngay</span>
              </button>
            )}

            {openModalCreateProject && (
              <ModalCreateProject
                open={openModalCreateProject}
                actionClose={() => setOpenModalCreateProject(false)}
                buttonClose="Hủy"
                actionConfirm={() => setOpenModalCreateProject(false)}
                buttonConfirm="Xác nhận"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralHeader;
