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
import React from "react";
import { CgProfile } from "react-icons/cg";

const AccountProfile = () => {
  const dispatch = useAppDispatch();
  const [userLogin, setUserLogin] = useUserLogin();
  const [userData, setUserData] = React.useState<any>();
  const { loadingUser } = useAppSelector((state) => state.user);

  React.useEffect(() => {
    dispatch(getProfileUser(userLogin?.email)).then((result) => {
      if (getProfileUser.fulfilled.match(result)) {
        setUserData(result.payload);
        console.log("data", result.payload);
      }
    });
  }, [userLogin]);

  if (loadingUser) {
    return <SpinnerLoading />;
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
                    userData?.user?.avatar_url
                      ? userData?.user?.avatar_url
                      : generateFallbackAvatar(userData?.user?.fullname)
                  }
                  alt="img"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {userData?.user?.fullname}
              </h1>

              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Trạng thái</span>
                  <span className="ml-auto">
                    {!userData?.user?.is_ban ? (
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
                    {formatDate(userData?.user?.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
            <div className="my-4"></div>
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
                    <div className="px-4 py-2">{userData?.user?.fullname}</div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Số điện thoại</div>
                    <div className="px-4 py-2">
                      {userData?.user?.phone_number
                        ? userData?.user?.phone_number
                        : "(Chưa cập nhật)"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Địa chỉ</div>
                    <div className="px-4 py-2">
                      {userData?.user?.address_detail
                        ? userData?.user?.address_detail
                        : "(Chưa cập nhật)"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">
                      <a
                        className="text-blue-800"
                        href="mailto:jane@example.com"
                      >
                        {userData?.user?.email
                          ? truncateString(userData?.user?.email, 20)
                          : "(Chưa cập nhật)"}
                      </a>
                    </div>
                  </div>

                  {userLogin?.role_name === "Business" ? (
                    <>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                          Lĩnh vực kinh doanh
                        </div>
                        <div className="px-4 py-2">
                          {userData?.user?.business_sector
                            ? userData?.user?.business_sector
                            : "(Chưa cập nhật)"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Giới tính</div>
                        <div className="px-4 py-2">
                          {userData?.user?.gender
                            ? userData?.user?.gender
                            : "(Chưa cập nhật)"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Ngày sinh</div>
                        <div className="px-4 py-2">
                          {userData?.user?.dob
                            ? formatDate(userData?.user?.dob)
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
                        {userData?.user?.business_description
                          ? userData?.user?.business_description
                          : "(Chưa cập nhật)"}
                      </>
                    ) : (
                      <>
                        {userData?.user?.description
                          ? userData?.user?.description
                          : "(Chưa cập nhật)"}
                      </>
                    )}
                  </div>
                </div>

                {userLogin?.role_name === "Business" && (
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
                          <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path
                            fill="#fff"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          />
                        </svg>
                      </span>
                      <span className="tracking-wide">Người phụ trách</span>
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
                          <div className="px-4 py-2">
                            {userData?.responsiblePerson?.fullname}
                          </div>
                        </div>

                        <div className="grid grid-cols-2">
                          <div className="px-4 py-2 font-semibold">
                            Số điện thoại
                          </div>
                          <div className="px-4 py-2">
                            {userData?.responsiblePerson?.phone_number
                              ? userData?.responsiblePerson?.phone_number
                              : "(Chưa cập nhật)"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="px-4 py-2 font-semibold">Chức vụ</div>
                          <div className="px-4 py-2">
                            {userData?.responsiblePerson?.position
                              ? userData?.responsiblePerson?.position
                              : "(Chưa cập nhật)"}
                          </div>
                        </div>

                        <div className="grid grid-cols-2">
                          <div className="px-4 py-2 font-semibold">Email</div>
                          <div className="px-4 py-2">
                            <a
                              className="text-blue-800"
                              href={`${userData?.responsiblePerson?.email}`}
                              target="_blank"
                            >
                              {userData?.responsiblePerson?.email
                                ? truncateString(
                                    userData?.responsiblePerson?.email,
                                    20
                                  )
                                : "(Chưa cập nhật)"}
                            </a>
                          </div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="px-4 py-2 font-semibold">
                            Thông tin liên lạc khách:
                          </div>
                          <div className="px-4 py-2">
                            {userData?.user?.other_contact
                              ? userData?.user?.other_contact
                              : "(Chưa cập nhật)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
