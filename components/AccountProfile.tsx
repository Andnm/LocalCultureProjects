"use client";

import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { getProfileUser } from "@/src/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import {
  formatDate,
  generateFallbackAvatar,
  truncateString,
} from "@/src/utils/handleFunction";
import { Button } from "antd";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { GrSecure } from "react-icons/gr";
import { Hint } from "./hint";
import ModalChangePassword from "@/src/components/modal/password/ModalChangePassword";

const AccountProfile = () => {
  const dispatch = useAppDispatch();
  const [userLogin, setUserLogin] = useUserLogin();
  const [userData, setUserData] = React.useState<any>();
  const { loadingUser } = useAppSelector((state) => state.user);

  const [isOpenModalChangePassword, setIsOpenModalChangePassword] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(getProfileUser(userLogin?.email)).then((result) => {
      if (getProfileUser.fulfilled.match(result)) {
        setUserData(result.payload);
        // console.log("data", result.payload);
      }
    });
  }, [userLogin]);

  if (loadingUser) {
    return (
      <div className="h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  return (
    <div className="bg-gray-100" style={{ minHeight: "100vh" }}>
      <div className="container mx-auto p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="w-full">
                <img
                  className="h-auto w-full mx-auto"
                  src={
                    userData?.avatar_url
                      ? userData?.avatar_url
                      : generateFallbackAvatar(userData?.fullname)
                  }
                  alt="img"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {userData?.fullname}
              </h1>

              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Trạng thái</span>
                  <span className="ml-auto">
                    {!userData?.is_ban ? (
                      <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-500 py-1 px-2 rounded text-white text-sm">
                        Banned
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Ngày tham gia</span>
                  <span className="ml-auto">
                    {formatDate(userData?.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
            <div className="my-4">
              <Button className="btn-submit w-full" key="submit" onClick={() => setIsOpenModalChangePassword(true)}>
                <GrSecure />
                Đổi mật khẩu
              </Button>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-green-500">
                  <CgProfile />
                </span>
                <span className="tracking-wide">Thông tin</span>
                <svg
                  className="cursor-pointer -ml-1 mr-2 h-5 w-5 text-gray-400"
                  x-description="Heroicon name: mini/pencil"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"></path>
                </svg>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Tên</div>
                    <div className="px-4 py-2">{userData?.fullname}</div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Số điện thoại</div>
                    <div className="px-4 py-2">
                      {userData?.phone_number
                        ? userData?.phone_number
                        : "(Chưa cập nhật)"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Địa chỉ</div>
                    <div className="px-4 py-2">
                      {userData?.address
                        ? userData?.address
                        : "(Chưa cập nhật)"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">
                      Địa chỉ chi tiết
                    </div>
                    <div className="px-4 py-2">
                      {userData?.address_detail
                        ? userData?.address_detail
                        : "(Chưa cập nhật)"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">
                      <Hint
                        sideOffset={10}
                        description={`${userData?.email}`}
                        side={"top"}
                      >
                        <a
                          className="text-blue-800"
                          href={`mailto:${userData?.email}`}
                        >
                          {userData?.email
                            ? truncateString(userData?.email, 20)
                            : "(Chưa cập nhật)"}
                        </a>
                      </Hint>
                    </div>
                  </div>

                  {userLogin?.role_name === "Business" ? (
                    <>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                          Lĩnh vực kinh doanh
                        </div>
                        <div className="px-4 py-2">
                          {userData?.business_sector
                            ? userData?.business_sector
                            : "(Chưa cập nhật)"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Giới tính</div>
                        <div className="px-4 py-2">
                          {userData?.gender
                            ? userData?.gender
                            : "(Chưa cập nhật)"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Ngày sinh</div>
                        <div className="px-4 py-2">
                          {userData?.dob
                            ? formatDate(userData?.dob)
                            : "(Chưa cập nhật)"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="my-4"></div>

            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid gap-6">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">Mô tả</span>
                    <svg
                      className="cursor-pointer -ml-1 mr-2 h-5 w-5 text-gray-400"
                      x-description="Heroicon name: mini/pencil"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"></path>
                    </svg>
                  </div>
                  <div className="text-gray-500 text-base px-4 py-2">
                    {userLogin?.role_name === "Business" ? (
                      <>
                        {userData?.business_description
                          ? userData?.business_description
                          : "(Chưa cập nhật)"}
                      </>
                    ) : (
                      <>
                        {userData?.description
                          ? userData?.description
                          : "(Chưa cập nhật)"}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenModalChangePassword && (
        <ModalChangePassword
          open={isOpenModalChangePassword}
          onClose={() => setIsOpenModalChangePassword(false)}
        />
      )}
    </div>
  );
};

export default AccountProfile;
