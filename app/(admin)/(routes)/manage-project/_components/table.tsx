"use client";

import React, { Fragment } from "react";
import "@/src/styles/admin/manage-project.scss";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BiDetail } from "react-icons/bi";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { Popover, Transition } from "@headlessui/react";
import { Button, CardBody, Avatar } from "@material-tailwind/react";
import {
  formatDate,
  generateFallbackAvatar,
  getColorByProjectStatus,
  sortData,
  truncateString,
} from "@/src/utils/handleFunction";
import CustomModal from "@/src/components/shared/CustomModal";
import InfoText from "./InfoText";
import StatusCell from "./StatusCell";
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
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useUserLogin } from "@/src/hook/useUserLogin";
import ModalViewProjectDetail from "@/src/components/shared/ModalViewProjectDetail";
import { CiEdit } from "react-icons/ci";
import ModalDetailProject from "./modal/ModalDetailProject";
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
  { name: "Doanh nghiệp", key: "business.fullname" },
  { name: "Tên dự án", key: "name_project" },
  { name: "Người phụ trách", key: "responsible_person.fullname" },
  { name: "Trạng thái", key: "project_status" },
  { name: "Ngày tạo", key: "createdAt" },
  { name: "", key: "" },
];

const ProjectTable: React.FC<ProjectTableProps> = ({
  totalObject,
  dataTable,
  setDataTable,
  loadingProject,
  currentPage,
  onPageChange,
}) => {
  const dispatch = useAppDispatch();
  const [isOpenModalDetail, setIsOpenModalDetail] = React.useState(false);
  const [userLogin, setUserLogin] = useUserLogin();
  const [openModalConfirmActionDelete, setOpenModalConfirmActionDelete] =
    React.useState(false);
  const [loadingHandle, setLoadingHandle] = React.useState(false);

  //quản lý thông tin hiện ra
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );

  const [openModalConfirmProject, setOpenModalConfirmProject] =
    React.useState(false);

  const handleOpenModalDetails = (business: any) => {
    setSelectedProject(business);
    setIsOpenModalDetail(true);
  };

  const handleCallApiConfirmProject = (id: number) => {
    // console.log("confirm nè");
    // console.log(selectedProject?.business?.email)
    setLoadingHandle(true);
    dispatch(confirmProjectByAdmin(id)).then((result) => {
      if (confirmProjectByAdmin.fulfilled.match(result)) {
        // console.log(result.payload);

        const businessUser = selectedProject?.user_projects?.find(
          (up: any) => up.user.role_name === "Business"
        )?.user;

        const dataBodyNoti = {
          notification_type: NOTIFICATION_TYPE.CONFIRM_PROJECT,
          information: `Dự án ${selectedProject?.name_project} đã được phê duyệt`,
          sender_email: `${userLogin?.email}`,
          receiver_email: `${businessUser?.email}`,
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
        console.log(result);
      }

      setLoadingHandle(false);
      setOpenModalConfirmProject(false);
      setIsOpenModalDetail(false);
    });
  };

  const handleClickRemoveProject = (business: any) => {
    // console.log("Remove project", business);
    setSelectedProject(business);
    setOpenModalConfirmActionDelete(true);
  };

  const handleCallApiDeleteProject = () => {
    setLoadingHandle(true);

    dispatch(deleteProjectByAdmin(selectedProject.id)).then((resDelete) => {
      if (deleteProjectByAdmin.fulfilled.match(resDelete)) {
        toast.success("Xóa thành công!");
        setDataTable((prevDataTable) =>
          prevDataTable.filter((project) => project.id !== selectedProject.id)
        );
      } else {
        toast.error(`${resDelete.payload}`);
      }
      setOpenModalConfirmActionDelete(false);

      setLoadingHandle(false);
    });
  };

  //handle function when open detail project
  //hàm vừa THAY ĐỔI vừa phê duyệt
  const handleUpdateAndConfirmProject = (id: number) => {
    // console.log("update nè");

    const newDataArray = {
      fullname: selectedProject?.responsible_person?.fullname,
      position: selectedProject?.responsible_person?.position,
      email_responsible_person: selectedProject?.responsible_person?.email,
      phone_number: selectedProject?.responsible_person?.phone_number,
      name_project: selectedProject?.name_project,
      business_sector: selectedProject?.business_sector,
      specialized_field: selectedProject?.specialized_field,
      purpose: selectedProject?.purpose,
      description_project: selectedProject?.description_project,
      request: selectedProject?.request,
      note: selectedProject?.note,
      document_related_link: selectedProject?.document_related_link,
      project_registration_expired_date:
        selectedProject?.project_registration_expired_date,
      project_start_date: selectedProject?.project_start_date,
      project_expected_end_date: selectedProject?.project_expected_end_date,
    };

    const dataResponse = {
      id: id,
      data: newDataArray,
    };

    dispatch(updateProjectByAdmin(dataResponse)).then((result: any) => {
      if (updateProjectByAdmin.fulfilled.match(result)) {
        const dataBodyNoti = {
          notification_type: NOTIFICATION_TYPE.UPDATE_PROJECT,
          information: `Dự án ${selectedProject?.name_project} đã được sửa đổi và phê duyệt`,
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

        toast.success("Cập nhập dự án thành công!");
      } else if (updateProjectByAdmin.rejected.match(result)) {
        toast.error(`${result.payload}`);
        // console.log(result.payload);
      }
    });

    setIsOpenModalDetail(false);
  };

  if (dataTable?.length === 0) {
    return (
      <CardBody className="text-center">
        <InfoText>Không có dự án nào phù hợp.</InfoText>
      </CardBody>
    );
  }

  //new

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
          {Array.isArray(dataTable) &&
            dataTable?.map((business: any, index) => {
              const businessUser = business?.user_projects?.find(
                (up: any) => up.user.role_name === "Business"
              )?.user;

              const responsiblePersonList = business?.user_projects
                .filter((up: any) => up.user.role_name === "ResponsiblePerson")
                .map((up: any) => up.user);

              const isLast = index === dataTable.length - 1;

              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              const solutions = [
                {
                  name: "Chi tiết",
                  icon: <BiDetail />,
                  onClick: () => handleOpenModalDetails(business),
                },
                {
                  name: "Xóa dự án",
                  icon: <MdOutlinePlaylistRemove />,
                  onClick: () => handleClickRemoveProject(business),
                },
              ];

              return (
                <tbody key={index}>
                  <tr>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            !businessUser?.avatar_url ||
                            businessUser?.avatar_url === null
                              ? generateFallbackAvatar(businessUser?.fullname)
                              : businessUser?.avatar_url
                          }
                          alt={businessUser?.fullname}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <InfoText>{businessUser?.fullname}</InfoText>

                          {/* <InfoText className="opacity-70">
                            {truncateString(businessUser?.email, 20)}
                          </InfoText> */}
                        </div>
                      </div>
                    </td>
                    <td className={classes} style={{ width: "220px" }}>
                      <InfoText>{business?.name_project}</InfoText>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        {responsiblePersonList?.map(
                          (responsiblePerson: any, index: number) => (
                            <p className="text-sm" key={index}>
                              {responsiblePerson?.fullname}{" "}
                              <span className="italic text-xs">
                                {responsiblePerson?.position
                                  ? `(${responsiblePerson.position})`
                                  : null}
                              </span>
                            </p>
                          )
                        )}
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

        {/* {isOpenModalDetail && selectedProject && (
          <ModalViewProjectDetail
            open={isOpenModalDetail}
            title={"Thông tin dự án"}
            actionClose={() => {
              setIsOpenModalDetail(false);
            }}
            actionEdit={() => {
              setIsOpenModalDetail(false);
              setOpenModalEditProject(true);
            }}
            buttonClose={"Chỉnh sửa dự án"}
            actionConfirm={() => setOpenModalConfirmProject(true)}
            buttonConfirm={"Xác nhận phê duyệt"}
            status={selectedProject.project_status}
            selectedProject={selectedProject}
          />
        )} */}

        {isOpenModalDetail && selectedProject && (
          <ModalDetailProject
            open={isOpenModalDetail}
            onClose={() => {
              setIsOpenModalDetail(false);
            }}
            setSelectedProject={setSelectedProject}
            selectedProject={selectedProject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            status={selectedProject.project_status}
            actionConfirm={() =>
              handleCallApiConfirmProject(selectedProject.id)
            }
          />
        )}

        {openModalConfirmProject && (
          <CustomModal
            open={openModalConfirmProject}
            title={
              <h2 className="text-2xl font-semibold">Xác nhận phê duyệt</h2>
            }
            body={`Bạn có chắc muốn đăng dự án ${selectedProject.name_project} lên trên home page?`}
            actionClose={() => setOpenModalConfirmProject(false)}
            buttonClose={"Hủy"}
            actionConfirm={() =>
              handleCallApiConfirmProject(selectedProject.id)
            }
            buttonConfirm={"Xác nhận"}
            styleWidth={"max-w-xl"}
            status={"Pending"} //truyền pending để hiện button action
          />
        )}
      </CardBody>

      <Pagination
        currentPage={currentPage}
        totalItems={totalObject}
        onPageChange={onPageChange}
      />

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
          status={"Pending"} //truyền pending để hiện button action
        />
      )}

      {loadingProject && <SpinnerLoading />}
      {loadingHandle && <SpinnerLoading />}
    </>
  );
};

export default ProjectTable;

// const handleUpdateAndConfirmProject = (id: number) => {
//     // console.log("update nè");

//     const newDataArray = {
//       fullname: selectedProject?.responsible_person?.fullname,
//       position: selectedProject?.responsible_person?.position,
//       email_responsible_person: selectedProject?.responsible_person?.email,
//       phone_number: selectedProject?.responsible_person?.phone_number,
//       name_project: selectedProject?.name_project,
//       business_sector: selectedProject?.business_sector,
//       specialized_field: selectedProject?.specialized_field,
//       purpose: selectedProject?.purpose,
//       description_project: selectedProject?.description_project,
//       request: selectedProject?.request,
//       note: selectedProject?.note,
//       document_related_link: selectedProject?.document_related_link,
//       project_registration_expired_date:
//         selectedProject?.project_registration_expired_date,
//       project_start_date: selectedProject?.project_start_date,
//       project_expected_end_date: selectedProject?.project_expected_end_date,
//     };

//     const dataResponse = {
//       id: id,
//       data: newDataArray,
//     };

//     dispatch(updateProjectByAdmin(dataResponse)).then((result: any) => {
//       if (updateProjectByAdmin.fulfilled.match(result)) {
//         const dataBodyNoti = {
//           notification_type: NOTIFICATION_TYPE.UPDATE_PROJECT,
//           information: `Dự án ${selectedProject?.name_project} đã được sửa đổi và phê duyệt`,
//           sender_email: `${userLogin?.email}`,
//           receiver_email: `${selectedProject?.business?.email}`,
//         };

//         dispatch(createNewNotification(dataBodyNoti)).then((resNoti) => {
//           console.log(resNoti);
//         });

//         setDataTable((prevDataTable) => {
//           const updatedIndex = prevDataTable.findIndex(
//             (item) => item.id === result.payload.id
//           );

//           if (updatedIndex !== -1) {
//             const newDataTable = [...prevDataTable];
//             newDataTable[updatedIndex] = result.payload;
//             return newDataTable;
//           }

//           return prevDataTable;
//         });

//         toast.success("Cập nhập dự án thành công!");
//       } else if (updateProjectByAdmin.rejected.match(result)) {
//         toast.error(`${result.payload}`);
//         // console.log(result.payload);
//       }
//     });

//     setIsOpenModalDetail(false);
//   };
