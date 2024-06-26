"use client";

import React, { Fragment, useState } from "react";
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
import ModalSupportDetail from "./ModalSupportDetail";

registerLocale("vi", vn);
setDefaultLocale("vi");

interface SupportTableProps {
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

const SupportTable: React.FC<SupportTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  loadingUser,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();
  //quản lý thông tin hiện ra
  const [selectedSupport, setSelectedSupport] = React.useState<any | null>(
    null
  );

  const [openModalSupportDetail, setOpenModalSupportDetail] =
    useState<boolean>(false);

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

          {dataTable?.map((support: any, index) => {
            const isLast = index === dataTable.length - 1;

            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const POPOVER_OPTION = [
              {
                name: "Chi tiết",
                icon: <BiDetail />,
                onClick: () => {
                  setOpenModalSupportDetail(true);
                  setSelectedSupport(support);
                },
              },

              // {
              //   name: "Xóa tài khoản",
              //   icon: <MdOutlinePersonRemove />,
              //   onClick: () => {},
              // },
            ];

            return (
              <tbody key={index}>
                <tr>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <InfoText>{support?.fullname}</InfoText>

                        <InfoText className="opacity-70">
                          {truncateString(support?.email, 35)}
                        </InfoText>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <InfoText>{support?.support_type}</InfoText>
                  </td>

                  <td className={classes}>
                    <InfoText>
                      {truncateString(support?.support_content, 30)}
                    </InfoText>
                  </td>

                  <td className={classes}>
                    {support?.support_image ? (
                      <img
                        className="w-24 h-20 object-cover"
                        src={support?.support_image}
                        alt="img"
                      />
                    ) : (
                      <InfoText className="italic">Không có ảnh</InfoText>
                    )}
                  </td>

                  <td className={classes}>
                    <InfoText>{formatDate(support?.createdAt)}</InfoText>
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

      {openModalSupportDetail && (
        <ModalSupportDetail
          open={openModalSupportDetail}
          onClose={() => {
            setOpenModalSupportDetail(false);
          }}
          dataSupport={selectedSupport}
        />
      )}

      {loadingUser && <SpinnerLoading />}
    </>
  );
};

export default SupportTable;
