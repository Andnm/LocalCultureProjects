"use client";

import {
  statisticsAccount,
  statisticsAccountByBusinessSector,
  statisticsBusinessFollowProvince,
  statisticsProject,
  statisticsProjectByBusinessType,
  statisticsSpecializationField,
} from "@/src/redux/features/statisticsSlice";
import { useAppDispatch } from "@/src/redux/store";
import React from "react";
import { MdAccountBalance } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import {
  LiaBusinessTimeSolid,
  LiaChalkboardTeacherSolid,
} from "react-icons/lia";
import { PiStudentLight } from "react-icons/pi";
import { MdOutlineAgriculture } from "react-icons/md";
import { MdOutlineHandyman } from "react-icons/md";
import { MdCardTravel } from "react-icons/md";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { SiMinds } from "react-icons/si";
import { PiPlant } from "react-icons/pi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { getColorByProjectStatus } from "@/src/utils/handleFunction";
import toast from "react-hot-toast";
import PieChart from "./_components/PieChart";
import { GrUserManager } from "react-icons/gr";

const getIcon = (key: string) => {
  switch (key.toLowerCase()) {
    case "lecturer":
      return <LiaChalkboardTeacherSolid />;
    case "business":
      return <LiaBusinessTimeSolid />;
    case "student":
      return <PiStudentLight />;
    case "responsibleperson":
      return <GrUserManager  />;
    case "nông nghiệp":
      return <MdOutlineAgriculture />;
    case "thủ công nghiệp":
      return <MdOutlineHandyman />;
    case "du lịch":
      return <MdCardTravel />;
    case "lên ý tưởng":
      return <HiOutlineLightBulb />;
    case "triển khai thực tế":
      return <PiPlant />;
    default:
      return <MdOutlineMiscellaneousServices />;
  }
};

const Dashboard = () => {
  const [businessSectorList, setBusinessSectorList] = React.useState<[]>([]);
  const [projectData, setProjectData] = React.useState([]);
  const [businessFollowProvinceData, setBusinessFollowProvinceData] =
    React.useState<[]>([]);
  const [projectTypeListData, setProjectTypeListData] = React.useState<[]>([]);
  const [accountData, setAccountData] = React.useState([]);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(statisticsProjectByBusinessType()).then((result) => {
          if (result.payload === "") {
            setProjectTypeListData([]);
          } else {
            setProjectTypeListData(result.payload);
          }
        });

        dispatch(statisticsAccountByBusinessSector()).then((result) => {
          if (result.payload === "") {
            setBusinessSectorList([]);
          } else {
            setBusinessSectorList(result.payload);
          }
        });

        dispatch(statisticsProject()).then((result) => {
          if (result.payload === "") {
            setProjectData([]);
          } else {
            setProjectData(result.payload);
          }
        });

        dispatch(statisticsBusinessFollowProvince()).then((result) => {
          if (result.payload === "") {
            setBusinessFollowProvinceData([]);
          } else {
            setBusinessFollowProvinceData(result.payload.slice(0, 8));
          }
        });

        dispatch(statisticsAccount()).then((result) => {
          // console.log("acc", result.payload);
          if (result.payload === "") {
            setAccountData([]);
          } else {
            console.log("result.payload: ", result.payload)

            setAccountData(result.payload);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const totalAccounts = Array.isArray(accountData)
    ? accountData.reduce((total, item: any) => total + item.value, 0)
    : 0;

  const totalProject = Array.isArray(projectData)
    ? projectData.reduce((total, item: any) => total + item.value, 0)
    : 0;

  const totalBusiness = Array.isArray(accountData)
    ? accountData.reduce((total, item: any) => {
        if (item.key === "Business") {
          return total + item.value;
        } else {
          return total;
        }
      }, 0)
    : 0;

  return (
    <div className="flex overflow-hidden bg-white">
      <div
        className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
        id="sidebarBackdrop"
      ></div>
      <div
        id="main-content"
        className="h-full w-full bg-gray-50 relative overflow-y-auto"
      >
        <main>
          <div className="p-6 px-4">
            <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className=" rounded-lg xl:col-span-2">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-bold text-center">
                      Tổng quan tài khoản
                    </h2>

                    <div className="flex justify-between items-center h-full">
                      <div className="flex items-center justify-center flex-col">
                        <h3 className="text-sm font-normal text-gray-500">
                          Tổng cộng
                        </h3>
                        <span className="text-xl leading-none font-bold text-gray-900">
                          {totalAccounts}
                        </span>
                      </div>

                      <div>
                        {accountData.map((item: any, index) => (
                          <div key={index}>
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex items-center flex-row gap-2 ">
                                <div className="text-green-500 text-2xl font-bold">
                                  {getIcon(item?.key)}
                                </div>
                                <span className="text-xl leading-none font-bold text-gray-900">
                                  {item?.value}
                                </span>
                              </div>

                              <div className="text-base font-normal text-gray-500">
                                <h3>{item?.key}</h3>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-bold text-center">
                      Doanh nghiệp
                    </h2>

                    <div className="flex justify-between items-center h-full">
                      <div className="flex items-center justify-center flex-col">
                        <h3 className="text-sm font-normal text-gray-500">
                          Tổng cộng
                        </h3>
                        <span className="text-xl leading-none font-bold text-gray-900">
                          {totalBusiness}
                        </span>
                      </div>

                      <div>
                        {businessSectorList.map((item: any, index) => (
                          <div key={index}>
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex items-center flex-row gap-2 ">
                                <div className="text-green-500 text-2xl font-bold">
                                  {getIcon(item?.key)}
                                </div>
                                <span className="text-xl leading-none font-bold text-gray-900">
                                  {item?.value}
                                </span>
                              </div>

                              <div className="text-sm font-normal text-gray-500">
                                <h3>{item?.key}</h3>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-bold text-center">Dự án</h2>

                    <div className="flex justify-between items-center h-full">
                      <div className="flex items-center justify-center flex-col">
                        <h3 className="text-sm font-normal text-gray-500">
                          Tổng cộng
                        </h3>
                        <span className="text-xl leading-none font-bold text-gray-900">
                          {totalProject}
                        </span>
                      </div>

                      <div>
                        {projectTypeListData.map((item: any, index) => (
                          <div key={index}>
                            <div className="flex flex-col items-center justify-center">
                              <div className="flex items-center flex-row gap-2 ">
                                <div className="text-green-500 text-2xl font-bold">
                                  {getIcon(item?.key)}
                                </div>
                                <span className="text-xl sm:text-2xl leading-none font-bold text-gray-900">
                                  {item?.value}
                                </span>
                              </div>

                              <div className="text-sm font-normal text-gray-500">
                                <h3>{item?.key}</h3>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                  <h2 className="text-xl leading-none font-bold mb-3 text-gray-900">
                    Dự án theo trạng thái
                  </h2>

                  {projectData.length === 0 ? (
                    <p>Chưa có dự án nào được đăng</p>
                  ) : (
                    <PieChart projectData={projectData} />
                  )}
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Thống kê doanh nghiệp theo địa chỉ
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href="#"
                      className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
                      onClick={() =>
                        toast("Chưa hỗ trợ", {
                          style: {
                            borderRadius: "10px",
                            background: "orange",
                            color: "white",
                          },
                        })
                      }
                    >
                      Xem tất cả
                    </a>
                  </div>
                </div>

                <div className="flex flex-col mt-8">
                  <div className="overflow-x-auto rounded-lg">
                    <div className="align-middle inline-block min-w-full">
                      <div className="shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Địa chỉ
                              </th>
                              <th
                                scope="col"
                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider "
                              >
                                Số lượng
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {businessFollowProvinceData?.map(
                              (item: any, index: number) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0 ? "bg-gray-50" : ""
                                  }
                                >
                                  <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                                    <span className="font-semibold">
                                      {item.key}
                                    </span>
                                  </td>

                                  <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {item.value}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
              <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold leading-none text-gray-900">
                    Nhóm chăm chỉ
                  </h3>

                  <a
                    href="#"
                    className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2"
                    onClick={() =>
                      toast("Chưa hỗ trợ", {
                        style: {
                          borderRadius: "10px",
                          background: "orange",
                          color: "white",
                        },
                      })
                    }
                  >
                    Xem tất cả
                  </a>
                </div>

                <div className="flow-root">
                  <ul role="list" className="divide-y divide-gray-200">
                    <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://demo.themesberg.com/windster/images/users/neil-sims.png"
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Neil Sims
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            <a
                              className="__cf_email__"
                              data-cfemail="17727a767e7b57607e7973646372653974787a"
                            >
                              [email&#160;protected]
                            </a>
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                 
                        </div>
                      </div>
                    </li>

                    <li className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://demo.themesberg.com/windster/images/users/bonnie-green.png"
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Bonnie Green
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            <a
                              className="__cf_email__"
                              data-cfemail="d4b1b9b5bdb894a3bdbab0a7a0b1a6fab7bbb9"
                            >
                              [email&#160;protected]
                            </a>
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                        </div>
                      </div>
                    </li>

                  </ul>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
                  Dự án được đánh giá cao
                </h3>
                <div className="block w-full overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                          Top dự án
                        </th>
                        <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                          Users
                        </th>
                        <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap min-w-140-px"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          Organic Search
                        </th>
                        <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                          5,649
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">
                              30%
                            </span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-cyan-600 h-2 rounded-sm"
                                  style={{ width: "30%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          Referral
                        </th>
                        <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                          4,025
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">
                              24%
                            </span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-orange-300 h-2 rounded-sm"
                                  style={{ width: "24%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          Direct
                        </th>
                        <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                          3,105
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">
                              18%
                            </span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-teal-400 h-2 rounded-sm"
                                  style={{ width: "18%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          Social
                        </th>
                        <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                          1251
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">
                              12%
                            </span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-pink-600 h-2 rounded-sm"
                                  style={{ width: "12%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-500">
                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                          Other
                        </th>
                        <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                          734
                        </td>
                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">9%</span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-sm"
                                  style={{ width: "9%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="text-gray-500">
                        <th className="border-t-0 align-middle text-sm font-normal whitespace-nowrap p-4 pb-0 text-left">
                          Email
                        </th>
                        <td className="border-t-0 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4 pb-0">
                          456
                        </td>
                        <td className="border-t-0 align-middle text-xs whitespace-nowrap p-4 pb-0">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium">7%</span>
                            <div className="relative w-full">
                              <div className="w-full bg-gray-200 rounded-sm h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-sm"
                                  style={{ width: "7%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
