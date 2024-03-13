"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import { List, ListItemSuffix, Chip } from "@material-tailwind/react";

import { SiSimpleanalytics } from "react-icons/si";
import { MdOutlineAccountCircle } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { GoProjectRoadmap } from "react-icons/go";
import { GoReport } from "react-icons/go";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";

import { logout } from "@/src/redux/features/authSlice";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  suffix?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, label, suffix }) => {
  const pathName = usePathname();
  const activeNavLink = pathName === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 gap-3 rounded-lg ${
        activeNavLink ? "bg-blue-100" : "hover:bg-gray-200"
      }`}
      style={{ borderRadius: "5px" }}
    >
      {icon}
      <p>{label}</p>
      {suffix && <ListItemSuffix>{suffix}</ListItemSuffix>}
    </Link>
  );
};

interface SidebarAdminProps {
  newNotificationQuantity: number | undefined;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({
  newNotificationQuantity,
}) => {
  const sections = [
    {
      title: "Công cụ",
      features: [
        {
          href: "/dashboard",
          icon: <SiSimpleanalytics className="w-4 h-4" />,
          label: "Thống kê",
        },
        {
          href: "/notification",
          icon: <IoNotificationsOutline className="w-4 h-4" />,
          label: "Thông báo",
          suffix: (
            <Chip
              value={newNotificationQuantity}
              size="sm"
              variant="ghost"
              color="indigo"
              className="rounded-full"
              style={{ backgroundColor: "#cccccc" }}
            />
          ),
        },
      ],
    },
    {
      title: "Quản lý",
      features: [
        {
          href: "/manage-account",
          icon: <MdOutlineAccountCircle className="w-4 h-4" />,
          label: "Tài khoản",
        },
        { href: "/manage-group", icon: <GrGroup />, label: "Nhóm" },
        {
          href: "/manage-project",
          icon: <GoProjectRoadmap className="w-4 h-4" />,
          label: "Dự án",
        },
        {
          href: "/manage-report",
          icon: <GoReport className="w-4 h-4" />,
          label: "Hỗ trợ vấn đề",
        },
      ],
    },
  ];

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar-admin w-full max-w-[15rem] shadow-xl shadow-blue-gray-900/5 relative">
      <div className="mb-2 p-4">
        <h5 className="text-center text-orange-500 font-bold">Kho dự án</h5>
      </div>

      {sections.map((section, index) => (
        <div key={index}>
          <div color="blue-gray" className="flex items-center font-bold">
            <div className="bg-red-300 h-0.5 w-5 mr-2"></div>
            <p className="uppercase text-sm text-red-300">{section.title}</p>
          </div>

          <List className="px-4 py-4">
            {section.features.map((feature, featureIndex) => (
              <NavLink key={featureIndex} {...feature} />
            ))}
          </List>
        </div>
      ))}

      <div
        className="px-4 py-4 absolute bottom-0"
        style={{ color: "#455A64", width: "100%" }}
      >
        <Link
          href="#"
          className={`flex items-center px-4 py-2 gap-3 border-2 hover:bg-gray-200`}
          onClick={handleLogout}
          style={{ borderRadius: "5px" }}
        >
          <RiLogoutBoxRLine style={{ fill: "#455A64" }} />
          <p>Đăng xuất</p>
        </Link>
      </div>
    </div>
  );
};

export default SidebarAdmin;
