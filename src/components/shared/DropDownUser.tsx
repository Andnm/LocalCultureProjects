"use client";

import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserType } from "@/src/types/user.type";
import { logout } from "@/src/redux/features/authSlice";
import {
  generateFallbackAvatar,
  truncateString,
} from "@/src/utils/handleFunction";
import NotificationItems from "./_components/Notification/NotificationItems";
import NotificationList from "./_components/Notification/NotificationList";
import { getAllNotification } from "@/src/redux/features/notificationSlice";
import { useAppDispatch } from "@/src/redux/store";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import { useUserLogin } from "@/src/hook/useUserLogin";

interface UserProps {
  userData: UserType;
}

interface DropdownButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
interface DropdownMenuItemProps {
  path?: string;
  children: React.ReactNode;
}

const roleSpecificMenuItems: Record<string, { path: string; name: string }[]> =
  {
    Student: [
      { path: "/student-profile", name: "Trang cá nhân" },
      { path: "/student-board", name: "Bảng làm việc" },
      { path: "/#", name: "Lịch sử hoạt động" },
      { path: "/group", name: "Quản lý group" },
      { path: "/support", name: "Trợ giúp" },
    ],
    Business: [
      { path: "/business-profile", name: "Trang cá nhân" },
      { path: "/business-board", name: "Quản lý dự án" },
      { path: "/#", name: "Hoạt động gần đây" },
      { path: "/support", name: "Trợ giúp" },
    ],
    Lecturer: [
      { path: "/lecturer-profile", name: "Trang cá nhân" },
      { path: "/#", name: "Quản lý dự án" },
      { path: "/lecturer-board", name: "Quản lý nhóm" },
      { path: "/#", name: "Hoạt động gần đây" },
      { path: "/support", name: "Trợ giúp" },
    ],
  };

const DropdownButton: React.FC<DropdownButtonProps> = ({ children }) => (
  <Menu.Button className="btn-dropdown flex justify-center items-center rounded-3xl">
    {children}
  </Menu.Button>
);

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  path,
}) => (
  <>
    {path ? (
      <Link href={path}>
        <button className="item group flex w-full items-center rounded-md px-2 py-2 text-sm">
          {children}
        </button>
      </Link>
    ) : (
      <button className="item group flex w-full items-center rounded-md px-2 py-2 text-sm text-black">
        {children}
      </button>
    )}
  </>
);

const DropDownUser: React.FC<UserProps> = ({ userData }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userLogin, setUserLogin] = useUserLogin();

  const renderRoleSpecificMenuItems = () => {
    const roleItems = roleSpecificMenuItems[userData?.role_name || ""] || [];
    return [...roleItems].map((item, index) => (
      <DropdownMenuItem key={index} path={item.path}>
        {item.name}
      </DropdownMenuItem>
    ));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //handle notification
  const [dataNotification, setDataNotification] = React.useState<
    any | undefined
  >();

  const [newNotificationQuantity, setNewNotificationQuantity] = React.useState<
    number | undefined
  >();

  React.useEffect(() => {
    dispatch(getAllNotification()).then((result) => {
      socketInstance.on(`getNotifications-${userData?.email}`, (data: any) => {
        setNewNotificationQuantity(data.total_notifications);
        setDataNotification(data.notifications);
        // setNewNotificationQuantity(result.payload[0]);
        // setDataNotification(result.payload[1]);
      });
    });
  }, []);

  return (
    <div className="flex justify-center items-center flex-row gap-4">
      {/* Notifications Dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <DropdownButton>
          <IoIosNotificationsOutline className="w-7 h-7 object-cover rounded-3xl text-black" />
        </DropdownButton>
        {newNotificationQuantity !== 0 && (
          <span className="absolute -top-2 -right-1">
            <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-orange-500 text-white">
              {newNotificationQuantity}
            </div>
          </span>
        )}

        <Transition as={Fragment} {...commonTransitionProps}>
          <Menu.Items className="absolute z-50 right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-black">
            <NotificationList
              dataNotification={dataNotification}
              setDataNotification={setDataNotification}
              setNewNotificationQuantity={setNewNotificationQuantity}
            />
          </Menu.Items>
        </Transition>
      </Menu>

      {/* User Dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <DropdownButton>
          <img
            src={
              userData?.avatar_url || generateFallbackAvatar(userData?.fullname)
            }
            alt="User Avatar"
            className="avatar-user object-cover rounded-3xl"
          />
        </DropdownButton>

        <Transition as={Fragment} {...commonTransitionProps}>
          <Menu.Items className="menu-item absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 text-black">
              <div className="px-2 py-2">
                <p className="text-xs mb-2">TÀI KHOẢN</p>
                <div className="flex flex-row flex-wrap gap-2 items-center">
                  <div className="w-10 h-10">
                    <img
                      src={
                        userData?.avatar_url ||
                        generateFallbackAvatar(userData?.fullname)
                      }
                      alt="User Avatar"
                      className="avatar-user w-full h-full object-cover rounded-3xl"
                    />
                  </div>

                  <div className="w-[150px]">
                    <p className="text-sm overflow-x-hidden w-full">
                      {userData?.fullname}
                    </p>
                    <p className="text-xs overflow-x-hidden w-full">
                      {truncateString(userData?.email, 19)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="px-1 py-1"
              style={{ borderBottomWidth: "1px", borderTopWidth: "1.5px" }}
            >
              {renderRoleSpecificMenuItems()}
            </div>

            <div className="px-1 py-1 logout-section">
              <div
                className="flex w-full items-center rounded-md px-2 py-2 text-sm"
                onClick={handleLogout}
              >
                Đăng xuất
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

const commonTransitionProps = {
  enter: "transition ease-out duration-100",
  enterFrom: "transform opacity-0 scale-95",
  enterTo: "transform opacity-100 scale-100",
  leave: "transition ease-in duration-75",
  leaveFrom: "transform opacity-100 scale-100",
  leaveTo: "transform opacity-0 scale-95",
};

export default DropDownUser;
