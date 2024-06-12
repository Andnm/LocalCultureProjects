"use client";

import React, { Fragment, useState } from "react";
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
  sortData,
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
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GiCaptainHatProfile } from "react-icons/gi";
import PopoverOption from "@/src/components/shared/PopoverOption";
import CardInfo from "./CardInfo";
import { CardAccountInfo } from "@/components/CardAccountInfo";
import { FaStar } from "react-icons/fa";
import ModalGroupDetail from "./ModalGroupDetail";

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
  { name: "Tên nhóm", key: "group_name" },
  { name: "Thành viên", key: "members" },
  { name: "Giảng viên", key: "members" },
  { name: "Trạng thái nhóm", key: "status" },
  { name: "Ngày tạo", key: "createdAt" },
  { name: "", key: "" },
];

const GroupTable: React.FC<ProjectTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  loadingProject,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();

  //quản lý thông tin hiện ra
  const [selectedGroup, setSelectedGroup] = React.useState<any | null>(null);

  //state cho modal
  const [openModalGroupDetail, setOpenModalGroupDetail] =
    useState<boolean>(false);

  if (dataTable?.length === 0) {
    return (
      <CardBody className="text-center">
        <InfoText>Chưa có nhóm nào được tạo.</InfoText>
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
                    {head.name}
                    {index !== TABLE_HEAD.length - 1 && (
                      <span
                        className="flex flex-col"
                        style={{ position: "relative", zIndex: "9999" }}
                      >
                        <IoIosArrowUp
                          className="h-4 w-4 transition duration-300 transform hover:shadow-md hover:scale-150"
                          onClick={() =>
                            sortData(head.key, "desc", dataTable, setDataTable)
                          }
                        />
                        <IoIosArrowDown
                          className="h-4 w-4 transition duration-300 transform hover:shadow-md hover:scale-150"
                          onClick={() =>
                            sortData(head.key, "asc", dataTable, setDataTable)
                          }
                        />
                      </span>
                    )}
                  </InfoText>
                </th>
              ))}
            </tr>
          </thead>
          {dataTable?.map((group: any, index) => {
            const isLast = index === dataTable.length - 1;

            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const POPOVER_OPTION = [
              {
                name: "Chi tiết",
                icon: <BiDetail />,
                onClick: () => {
                  setSelectedGroup(group);
                  setOpenModalGroupDetail(true);
                },
              },
            ];

            return (
              <tbody key={index}>
                <tr>
                  <td className={classes}>
                    <InfoText>{group?.group_name}</InfoText>
                  </td>

                  {/* student */}
                  <td className={classes}>
                    <div className="flex flex-row gap-3">
                      {group?.members?.map((member: any, index: any) => (
                        <>
                          {member.role_in_group !== "Lecturer" && (
                            <div className="flex items-center gap-3 relative">
                              <CardAccountInfo
                                sideOffset={10}
                                side={"top"}
                                dataStudent={member}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    src={member?.user?.avatar_url}
                                    alt={member?.user?.fullname}
                                    size="sm"
                                    className="w-10 h-10 object-cover rounded-full"
                                  />
                                </div>
                              </CardAccountInfo>
                              {member.role_in_group === "Leader" && (
                                <FaStar className="text-xl text-orange-700 absolute -bottom-2 -right-1" />
                              )}
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </td>

                  {/* lecturer */}
                  <td className={classes}>
                    <div className="flex flex-col gap-3">
                      {group?.members?.map((member: any, index: any) => (
                        <>
                          {member.role_in_group === "Lecturer" && (
                            <div className="flex items-center gap-3">
                              <CardAccountInfo
                                sideOffset={10}
                                side={"top"}
                                dataStudent={member}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    src={member?.user?.avatar_url}
                                    alt={member?.user?.fullname}
                                    size="sm"
                                    className="w-10 h-10 object-cover rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <InfoText className="text-start">
                                      {member?.user?.fullname}
                                    </InfoText>

                                    <InfoText className="opacity-70">
                                      {member?.user?.email}
                                    </InfoText>
                                  </div>
                                </div>
                              </CardAccountInfo>
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </td>

                  <StatusCell status={group.group_status} classes={classes} />

                  <td className={classes}>
                    <InfoText>{formatDate(group?.createdAt)}</InfoText>
                  </td>

                  <td className={classes}>
                    <PopoverOption solutions={POPOVER_OPTION} />
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
      {openModalGroupDetail && (
        <ModalGroupDetail
          open={openModalGroupDetail}
          onClose={() => {
            setOpenModalGroupDetail(false);
          }}
          dataGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          setDataTable={setDataTable}
          dataTable={dataTable}
        />
      )}

      {loadingProject && <SpinnerLoading />}
    </>
  );
};

export default GroupTable;
