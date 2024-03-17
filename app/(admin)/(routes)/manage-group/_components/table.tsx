"use client";

import React, { Fragment } from "react";
import "@/src/styles/admin/manage-project.scss";
import { RiExpandUpDownLine } from "react-icons/ri";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BiDetail } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { Popover, Transition } from "@headlessui/react";
import {
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
} from "@material-tailwind/react";
import {
  formatDate,
  getColorByProjectStatus,
} from "@/src/utils/handleFunction";
import CustomModal from "@/src/components/shared/CustomModal";
import InfoText from "../../manage-project/_components/InfoText";
import StatusCell from "../../manage-project/_components/StatusCell";
import "@/src/styles/admin/manage-project.scss";
import { useAppDispatch } from "@/src/redux/store";
import {
  confirmProjectByAdmin,
  updateProjectByAdmin,
} from "@/src/redux/features/projectSlice";
import toast from "react-hot-toast";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import Pagination from "@/src/components/shared/Pagination";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { Download } from "lucide-react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import vn from "date-fns/locale/vi";
registerLocale("vi", vn);
setDefaultLocale("vi");

interface ProjectTableProps {
  totalObject: any;
  dataTable: any[];
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  loadingProject: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TABLE_HEAD = [
  "Doanh nghiệp",
  "Tên dự án",
  "Người phụ trách",
  "Trạng thái",
  "Ngày tạo",
  "",
];

const AccountTable: React.FC<ProjectTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  loadingProject,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();

  //quản lý thông tin hiện ra
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );

  if (dataTable?.length === 0) {
    return (
      <CardBody className="text-center">
        <InfoText>Chưa có dự án nào được tạo.</InfoText>
      </CardBody>
    );
  }

  return (
    <>
      <CardBody className="px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <InfoText className="flex items-center gap-2 leading-none opacity-70">
                    {head}
                    {index !== TABLE_HEAD.length - 1 && (
                      <RiExpandUpDownLine className="h-4 w-4" />
                    )}
                  </InfoText>
                </th>
              ))}
            </tr>
          </thead>
          {dataTable?.map((business: any, index) => {
            const isLast = index === dataTable.length - 1;

            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const solutions = [
              {
                name: "Chi tiết",
                icon: <BiDetail />,
                onClick: () => {},
              },

              //Tạm thời ẩn đi
              // {
              //   name: "Sửa thông tin",
              //   icon: <CiEdit />,
              //   onClick: () => handleClickOpenInfo(business),
              // },
              {
                name: "Xóa dự án",
                icon: <MdOutlinePlaylistRemove />,
                onClick: () => {},
              },
            ];

            return (
              <tbody key={index}>
                <tr>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={business?.business?.avatar_url}
                        alt={business?.business?.fullname}
                        size="sm"
                      />
                      <div className="flex flex-col">
                        <InfoText>{business?.business?.fullname}</InfoText>

                        <InfoText className="opacity-70">
                          {business?.business?.email}
                        </InfoText>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <InfoText>{business?.name_project}</InfoText>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <InfoText>
                        {business?.responsible_person?.fullname}
                      </InfoText>

                      <InfoText className="opacity-70">
                        {business?.responsible_person?.position}
                      </InfoText>
                    </div>
                  </td>

                  <StatusCell
                    status={business.project_status}
                    classes={classes}
                  />

                  <td className={classes}>
                    <InfoText>{formatDate(business?.createdAt)}</InfoText>
                  </td>

                  <td className={classes}>
                    <Popover className="relative">
                      {({ open }) => (
                        <>
                          <Popover.Button
                            className={`
                ${open ? "text-red" : "text-black"}
                group inline-flex items-cente
                px-3 py-2 text-base font-medium hover:text-red focus:outline-none 
                focus-visible:ring-2 focus-visible:ring-white/75`}
                          >
                            <BiDotsHorizontalRounded />
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 -translate-y-3"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-10"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="popover absolute left-1/2 z-10 mt-3 w-screen max-w-max -translate-x-full transform px-4 sm:px-0">
                              <div className="rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="relative grid bg-white">
                                  {solutions.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-row gap-2 items-center px-5 py-3 cursor-pointer hover:bg-gray-200"
                                      onClick={() => item.onClick()}
                                    >
                                      {item.icon}
                                      {item.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </CardBody>

      <Pagination
        currentPage={currentPage}
        totalItems={totalObject}
        onPageChange={onPageChange}
      />

      {loadingProject && <SpinnerLoading />}
    </>
  );
};

export default AccountTable;
