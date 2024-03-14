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

const GeneralHeader = () => {
  const [isLoginModalOpen, setLoginModalOpen] = React.useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = React.useState(false);
  const [openRegisterMode, setOpenRegisterMode] = React.useState(false);

  const [userData, setUserData] = React.useState<UserType | null>(null);
  const pathName = usePathname();

  React.useEffect(() => {
    const user = getUserFromSessionStorage();
    setUserData(user);
  }, []);

  React.useEffect(() => {
    const user = getUserFromSessionStorage();
    setUserData(user);
  }, [isLoginModalOpen, isRegisterModalOpen]);

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

  //show header
  const navItemsGeneral = [
    {
      nameItem: "Thông tin kho dự án",
      path: "/about-us",
    },
    {
      nameItem: "Danh sách dự án",
      path: "/project-list",
    },
    {
      nameItem: "Bạn cần hỗ trợ ?",
      path: "/support",
    },
  ];

  const navItemsStudent = [
    {
      nameItem: "Danh sách dự án",
      path: "/project-list",
    },
    {
      nameItem: "Bảng làm việc",
      path: "/student-board",
    },
  ];

  const navItemsBusiness = [
    {
      nameItem: "Bảng làm việc",
      path: "/business-board",
    },
  ];

  const navItemLecturer = [
    {
      nameItem: "Bảng làm việc",
      path: "/lecturer-board",
    },
  ];

  const getNavItems = () => {
    if (userData && userData.role_name) {
      switch (userData.role_name) {
        case "Student":
          return navItemsStudent;
        case "Business":
          return navItemsBusiness;
        case "Lecturer":
          return navItemLecturer;
        default:
          return navItemsGeneral;
      }
    } else {
      return navItemsGeneral;
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
      className={`general-header-container border-b-2 ${
        userData && "header-white border-b-2"
      }
      top-0 z-10 h-max max-w-full border-0 rounded-none px-4 py-2 lg:px-8 lg:py-3`}
    >
      <div className="container flex items-center justify-between text-white">
        <Link
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-medium brand-name"
        >
          Kho dự án
        </Link>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>

          <div className="flex items-center justify-between gap-2">
            {userData ? (
              <DropDownUser setUserData={setUserData} userData={userData} />
            ) : (
              <>
                <button
                  className="hidden lg:inline-block btn-login"
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

                <button
                  className="hidden lg:inline-block btn-signup"
                  onClick={() => {
                    setRegisterModalOpen(true);
                  }}
                >
                  <span className="text-black hover:text-white">Đăng kí</span>
                </button>

                {isRegisterModalOpen && (
                  <Register
                    switchFromRegisterToLogin={switchFromRegisterToLogin}
                    actionClose={handleCloseAction}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralHeader;
