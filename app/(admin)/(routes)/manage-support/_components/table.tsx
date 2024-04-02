"use client";

import React, { Fragment } from "react";
import "@/src/styles/admin/manage-project.scss";
import { MdOutlinePersonRemove } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
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
  generateFallbackAvatar,
  getColorByProjectStatus,
  sortData,
  truncateString,
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
import PopoverOption from "@/src/components/shared/PopoverOption";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

registerLocale("vi", vn);
setDefaultLocale("vi");

interface ProjectTableProps {
  totalObject: any;
  dataTable: any[];
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  loadingUser: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TABLE_HEAD = [
  { name: "Người gửi", key: "fullname" },
  { name: "Loại hỗ trợ", key: "support_type" },
  { name: "Nội dung", key: "support_content" },
  { name: "Hình ảnh", key: "support_image" },
  { name: "Ngày tạo", key: "createdAt" },
  { name: "", key: "" },
];

const POPOVER_OPTION = [
  {
    name: "Chi tiết",
    icon: <BiDetail />,
    onClick: () => {},
  },

  {
    name: "Xóa tài khoản",
    icon: <MdOutlinePersonRemove />,
    onClick: () => {},
  },
];

const SupportTable: React.FC<ProjectTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  loadingUser,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();
console.log("dataTable", dataTable)
  //quản lý thông tin hiện ra
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );

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

          {dataTable?.map((user: any, index) => {
            const isLast = index === dataTable.length - 1;

            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tbody key={index}>
                <tr>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <InfoText>{user?.fullname}</InfoText>

                        <InfoText className="opacity-70">
                          {truncateString(user?.email, 35)}
                        </InfoText>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <InfoText className={user?.phone_number ? "" : "italic"}>
                      {user?.phone_number
                        ? user?.phone_number
                        : "(Chưa cập nhập)"}
                    </InfoText>
                  </td>

                  <td className={classes}>
                    <InfoText>{user?.role?.role_name}</InfoText>
                  </td>

                  <StatusCell
                    status={user.status ? "Active" : "Inactive"}
                    classes={classes}
                  />

                  <td className={classes}>
                    <InfoText>{formatDate(user?.createdAt)}</InfoText>
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

      {loadingUser && <SpinnerLoading />}
    </>
  );
};

export default SupportTable;
