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
} from "@/src/utils/handleFunction";
import CustomModal from "@/src/components/shared/CustomModal";
import InfoText from "../../manage-project/_components/InfoText";
import StatusCell from "../../manage-project/_components/StatusCell";
import "@/src/styles/admin/manage-project.scss";
import { useAppDispatch } from "@/src/redux/store";
import {
  confirmProjectByAdmin,
  deleteProjectByAdmin,
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
import InfoProject from "./InfoProject";
import { useUserLogin } from "@/src/hook/useUserLogin";

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
  { name: "Doanh nghiệp", key: "fullname" },
  { name: "Tên dự án", key: "phone_number" },
  { name: "Người phụ trách", key: "role_name" },
  { name: "Ngày tạo", key: "createdAt" },
  { name: "", key: "" },
];

const AccountTable: React.FC<ProjectTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  loadingUser,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();

  const [userLogin, setUserLogin] = useUserLogin();
  //quản lý thông tin hiện ra
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );
  const [loadingHandle, setLoadingHandle] = React.useState(false);

  const [isOpenModalDetail, setIsOpenModalDetail] = React.useState(false);
  const [openModalConfirmActionDelete, setOpenModalConfirmActionDelete] =
    React.useState(false);

  const handleOpenModalDetails = (business: any) => {
    // console.log(business);
    setSelectedProject(business);
    setIsOpenModalDetail(true);
  };

  const handleConfirmProject = (id: number) => {
    // console.log("confirm nè");
    // console.log(selectedProject?.business?.email)

    dispatch(confirmProjectByAdmin(id)).then((result) => {
      if (confirmProjectByAdmin.fulfilled.match(result)) {
        // console.log(result.payload);
        const dataBodyNoti = {
          notification_type: NOTIFICATION_TYPE.CONFIRM_PROJECT,
          information: `Dự án ${selectedProject?.name_project} đã được phê duyệt`,
          sender_email: `${userLogin?.email}`,
          receiver_email: `${selectedProject?.business?.email}`,
        };

        dispatch(createNewNotification(dataBodyNoti)).then((resNoti) => {
          console.log(resNoti);
        });

        setDataTable((prevDataTable) => {
          const updatedIndex = prevDataTable.findIndex(
            (item) => item.id === result.payload.id
          );

          if (updatedIndex !== -1) {
            const newDataTable = [...prevDataTable];
            newDataTable[updatedIndex] = result.payload;
            return newDataTable;
          }

          return prevDataTable;
        });
        toast.success("Phê duyệt thành công!");
      } else if (confirmProjectByAdmin.rejected.match(result)) {
        toast.error(`${result.payload}`);
        // console.log(result.payload);
      }
    });

    setIsOpenModalDetail(false);
  };

  const handleClickRemoveProject = (business: any) => {
    setSelectedProject(business);
    setOpenModalConfirmActionDelete(true);
  };

  const handleCallApiDeleteProject = () => {
    setLoadingHandle(true)
    dispatch(deleteProjectByAdmin(selectedProject.id)).then((resDelete) => {
      if (deleteProjectByAdmin.fulfilled.match(resDelete)) {
        toast.success("Xóa thành công!");
        setDataTable((prevDataTable) =>
          prevDataTable.filter((project) => project.id !== selectedProject.id)
        );
      } else {
        toast.error(`${resDelete.payload}`);
      }
      setLoadingHandle(false);
      setOpenModalConfirmActionDelete(false);

    });
  };

  return (
    <>
      <CardBody className="px-0 ">
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

          {dataTable?.map((project: any, index) => {
            const isLast = index === dataTable.length - 1;

            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const POPOVER_OPTION = [
              {
                name: "Chi tiết",
                icon: <BiDetail />,
                onClick: () => handleOpenModalDetails(project),
              },
              ,
              {
                name: "Xóa dự án",
                icon: <MdOutlinePlaylistRemove />,
                onClick: () => handleClickRemoveProject(project),
              },
            ];

            return (
              <tbody key={index}>
                <tr>
                  <td className={classes}>
                    <div className="flex items-center gap-3 w-9 h-9 object-cover">
                      <Avatar
                        src={
                          !project?.business?.avatar_url ||
                          project?.business?.avatar_url === null
                            ? generateFallbackAvatar(
                                project?.business?.fullname
                              )
                            : project?.business?.avatar_url
                        }
                        alt={"img"}
                        size="sm"
                        style={{width: '2.25rem'}}
                      />
                      <div className="flex flex-col">
                        <InfoText>{project?.business?.fullname}</InfoText>

                        <InfoText className="opacity-70">
                          {project?.business?.email}
                        </InfoText>
                      </div>
                    </div>
                  </td>
                  <td className={classes} style={{width: '220px'}}>
                    <InfoText>{project?.name_project}</InfoText>
                  </td>

                  <td className={classes}>
                    <div className="flex flex-col">
                      <InfoText>
                        {project?.responsible_person?.fullname}
                      </InfoText>

                      <InfoText className="opacity-70">
                        {project?.responsible_person?.position}
                      </InfoText>
                    </div>
                  </td>

                  <td className={classes}>
                    <InfoText>{formatDate(project?.createdAt)}</InfoText>
                  </td>

                  <td className={classes}>
                    <PopoverOption solutions={POPOVER_OPTION} />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>

        {isOpenModalDetail && selectedProject && (
          <CustomModal
            open={isOpenModalDetail}
            title={"Thông tin dự án"}
            body={<InfoProject selectedProject={selectedProject} />}
            actionClose={() => setIsOpenModalDetail(false)}
            buttonClose={"Hủy"}
            actionConfirm={() => handleConfirmProject(selectedProject.id)}
            buttonConfirm={"Xác nhận"}
            status={selectedProject.project_status}
            styleWidth={"max-w-full"}
          />
        )}
      </CardBody>

      {openModalConfirmActionDelete && (
        <CustomModal
          open={openModalConfirmActionDelete}
          title={<h2 className="text-2xl font-semibold">Xác nhận xóa</h2>}
          body={`Bạn có chắc muốn xóa dự án ${selectedProject.name_project} ra khỏi kho hay không?`}
          actionClose={() => setOpenModalConfirmActionDelete(false)}
          buttonClose={"Hủy"}
          actionConfirm={handleCallApiDeleteProject}
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

      {loadingUser && <SpinnerLoading />}
      {loadingHandle && <SpinnerLoading />}
    </>
  );
};

export default AccountTable;
