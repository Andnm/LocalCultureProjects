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
import {
  banAccount,
  deleteUser,
  unBanAccount,
} from "@/src/redux/features/userSlice";
import { FaBan } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import ModalAccountDetail from "./ModalAccountDetail";

registerLocale("vi", vn);
setDefaultLocale("vi");

interface ProjectTableProps {
  totalObject: any;
  dataTable: any[];
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  setOriginalDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  loadingUser: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TABLE_HEAD = [
  { name: "Tên người dùng", key: "fullname" },
  { name: "Số điện thoại", key: "phone_number" },
  { name: "Vai trò", key: "role_name" },
  { name: "Trạng thái", key: "status" },
  { name: "Trạng thái", key: "is_ban" },
  { name: "Ngày tạo", key: "createdAt" },
  { name: "", key: "" },
];

const AccountTable: React.FC<ProjectTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  setOriginalDataTable,
  loadingUser,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();

  //quản lý thông tin hiện ra
  const [selectedAccount, setSelectedAccount] = React.useState<any | null>(
    null
  );

  const [loadingHandle, setLoadingHandle] = React.useState(false);

  // state cho modal
  const [openModalConfirmActionDelete, setOpenModalConfirmActionDelete] =
    React.useState(false);
  const [
    openModalConfirmActionBanOrUnBan,
    setOpenModalConfirmActionBanOrUnBan,
  ] = React.useState(false);

  const [openModalAccountDetail, setOpenModalAccountDetail] =
    useState<boolean>(false);

  // delete flow
  const handleClickDeleteAccount = (account: any) => {
    setSelectedAccount(account);
    setOpenModalConfirmActionDelete(true);
  };

  const handleCallApiDeleteAccount = () => {
    setLoadingHandle(true);
    dispatch(deleteUser(selectedAccount.email)).then((resDelete) => {
      if (deleteUser.fulfilled.match(resDelete)) {
        toast.success("Xóa thành công!");
        // console.log("selectedAccount.email", selectedAccount.email);
        // console.log("datatable", dataTable);
        setDataTable((prevDataTable) =>
          prevDataTable.filter(
            (account) => account.email !== selectedAccount.email
          )
        );

        setOriginalDataTable((prevDataTable) =>
          prevDataTable.filter(
            (account) => account.email !== selectedAccount.email
          )
        );
      } else {

        toast.error(`${resDelete.payload}`);
      }
      setOpenModalConfirmActionDelete(false);
      setLoadingHandle(false);
    });
  };

  // ban or un ban flow
  const handleClickToBanOrUnBanAccount = (account: any) => {
    setSelectedAccount(account);
    setOpenModalConfirmActionBanOrUnBan(true);
  };

  const handleApiBanOrUnBan = () => {
    setLoadingHandle(true);

    if (selectedAccount.is_ban) {
      dispatch(unBanAccount(selectedAccount.email)).then((resUnBan) => {
        // console.log("resUnBan", resUnBan);
        if (unBanAccount.fulfilled.match(resUnBan)) {
          toast.success("Mở lại tài khoản thành công!");

          setDataTable((prevDataTable) =>
            prevDataTable.map((account) => {
              if (account.email === selectedAccount.email) {
                return { ...account, is_ban: false };
              }
              return account;
            })
          );

          setOriginalDataTable((prevDataTable) =>
            prevDataTable.map((account) => {
              if (account.email === selectedAccount.email) {
                return { ...account, is_ban: false };
              }
              return account;
            })
          );
        } else {
          toast.error(`${resUnBan.payload}`);
        }
        setOpenModalConfirmActionBanOrUnBan(false);
        setLoadingHandle(false);
      });
    } else {
      dispatch(banAccount(selectedAccount.email)).then((resBan) => {
        // console.log("resBan", resBan);
        if (banAccount.fulfilled.match(resBan)) {
          toast.success("Ban thành công!");
          setDataTable((prevDataTable) =>
            prevDataTable.map((account) => {
              if (account.email === selectedAccount.email) {
                return { ...account, is_ban: true };
              }
              return account;
            })
          );

          setOriginalDataTable((prevDataTable) =>
            prevDataTable.map((account) => {
              if (account.email === selectedAccount.email) {
                return { ...account, is_ban: true };
              }
              return account;
            })
          );
        } else {
          toast.error(`${resBan.payload}`);
        }
        setOpenModalConfirmActionBanOrUnBan(false);
        setLoadingHandle(false);
      });
    }
  };

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

            const POPOVER_OPTION = [
              {
                name: "Chi tiết",
                icon: <BiDetail />,
                onClick: () => {
                  setSelectedAccount(user);
                  setOpenModalAccountDetail(true);
                },
              },
              {
                name: "Xóa tài khoản",
                icon: <MdOutlinePersonRemove />,
                onClick: () => handleClickDeleteAccount(user),
              },
              {
                name: user.is_ban ? "Mở lại tài khoản" : "Ban tài khoản",
                icon: user.is_ban ? <MdOutlineRemoveRedEye /> : <FaBan />,
                onClick: () => handleClickToBanOrUnBanAccount(user),
              },
            ];

            return (
              <tbody key={index}>
                <tr>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={
                          user?.avatar_url ?? generateFallbackAvatar(user?.fullname)
                        }
                        alt={user?.fullname}
                        size="sm"
                      />
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
                    status={user.status ? "Đã xác thực" : "Chưa xác thực"}
                    classes={classes}
                  />

                  <StatusCell
                    status={user.is_ban ? "Đã bị ban" : "Đang hoạt động"}
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

      {openModalConfirmActionDelete && (
        <CustomModal
          open={openModalConfirmActionDelete}
          title={<h2 className="text-2xl font-semibold">Xác nhận xóa</h2>}
          body={`Bạn có chắc muốn xóa tài khoản ${selectedAccount.fullname} hay không?`}
          actionClose={() => setOpenModalConfirmActionDelete(false)}
          buttonClose={"Hủy"}
          actionConfirm={handleCallApiDeleteAccount}
          buttonConfirm={"Xác nhận"}
          styleWidth={"max-w-xl"}
          status={"Pending"}
        />
      )}

      {openModalConfirmActionBanOrUnBan && (
        <CustomModal
          open={openModalConfirmActionBanOrUnBan}
          title={<h2 className="text-2xl font-semibold">Xác nhận hành động</h2>}
          body={`Bạn có chắc muốn ${
            selectedAccount.is_ban ? "mở lại" : "ban"
          } tài khoản ${selectedAccount.email} hay không?`}
          actionClose={() => setOpenModalConfirmActionBanOrUnBan(false)}
          buttonClose={"Hủy"}
          actionConfirm={handleApiBanOrUnBan}
          buttonConfirm={"Xác nhận"}
          styleWidth={"max-w-xl"}
          status={"Pending"}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalObject}
        onPageChange={onPageChange}
      />

      {openModalAccountDetail && (
        <ModalAccountDetail
          open={openModalAccountDetail}
          onClose={() => {
            setOpenModalAccountDetail(false);
          }}
          dataAccount={selectedAccount}
        />
      )}

      {loadingUser && <SpinnerLoading />}

      {loadingHandle && <SpinnerLoading />}
    </>
  );
};

export default AccountTable;
