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
import InfoText from "./InfoText";
import StatusCell from "./StatusCell";
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

  //quản lý thông tin hiện ra
  const [selectedProject, setSelectedProject] = React.useState<any | null>(
    null
  );

  const bodyContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Business Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Doanh nghiệp:</h3>
        <img
          src={selectedProject?.business?.avatar_url}
          alt={selectedProject?.business?.fullname}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {selectedProject?.business?.fullname}
          </h2>
          <p className="text-gray-500">{selectedProject?.business?.email}</p>
        </div>
      </div>

      {/* Responsible Person Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Người phụ trách</h3>
        <p className="text-gray-600">
          Họ và tên: {selectedProject?.responsible_person?.fullname}
        </p>
        <p className="text-gray-600">
          Chức vụ: {selectedProject?.responsible_person?.position}
        </p>
        <p className="text-gray-600">
          Email: {selectedProject?.responsible_person?.email}
        </p>
        <p className="text-gray-600">
          Số điện thoại: {selectedProject?.responsible_person?.phone_number}
        </p>
      </div>

      {/* Project Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Thông tin dự án</h3>
        <p className="text-gray-600">
          Tên dự án: {selectedProject?.name_project}
        </p>
        <p className="text-gray-600 flex gap-1">
          Trạng thái:
          <p
            className={`py-1 px-2 font-bold uppercase text-xs ${getColorByProjectStatus(
              selectedProject?.project_status
            )}`}
            style={{ borderRadius: "7px" }}
          >
            {selectedProject?.project_status === "Pending"
              ? "Chờ phê duyệt"
              : selectedProject?.project_status === "Public"
              ? "Công khai"
              : "Đang diễn ra"}
          </p>
        </p>
        <p className="text-gray-600">
          Lĩnh vực chuyên môn: {selectedProject?.specialized_field}
        </p>
        <p className="text-gray-600">
          Hướng đi dự án:{" "}
          {selectedProject?.business_type === "Project"
            ? "Triển khai dự án"
            : "Lên kế hoạch"}
        </p>

        <p className="text-gray-600">
          Mô tả về dự án:{" "}
          {selectedProject?.description_project
            ? selectedProject?.description_project
            : "(Chưa cập nhập)"}
        </p>
        <p className="text-gray-600">
          Các lưu ý khác:{" "}
          {selectedProject?.note ? selectedProject?.note : "(Chưa cập nhập)"}
        </p>
      </div>

      {/* Time Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Thời gian</h3>
        <p className="text-gray-600">
          Hạn đăng kí pitching:{" "}
          {formatDate(selectedProject?.project_registration_expired_date)}
        </p>
        <p className="text-gray-600">
          Ngày dự kiến bắt đầu:{" "}
          {formatDate(selectedProject?.project_start_date)}
        </p>
        <p className="text-gray-600">
          Ngày dự kiến kết thúc:{" "}
          {formatDate(selectedProject?.project_expected_end_date)}
        </p>
      </div>

      {/* Attachment Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Tài liệu đính kèm</h3>
        <p className="text-gray-600">
          {selectedProject?.document_related_link ? (
            <Button
              className="bg-blue-300 text-blue-900 hover:bg-blue-300 mt-2 rounded flex gap-1"
              onClick={() =>
                handleDownload(selectedProject?.document_related_link)
              }
            >
              <Download className="w-4 h-4 mr-2" /> Bấm để tải xuống
              {/* {group.document_url} */}
            </Button>
          ) : (
            "(Chưa được cập nhập)"
          )}
        </p>
      </div>
    </div>
  );

  //quản lý thông tin update
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  //up file
  // Xử lý tệp tin tại đây
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const bodyUpdate = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Doanh nghiệp:</h3>
          <img
            src={selectedProject?.business?.avatar_url}
            alt={selectedProject?.business?.fullname}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {selectedProject?.business?.fullname}
            </h2>
            <p className="text-gray-500">{selectedProject?.business?.email}</p>
          </div>
        </div>

        {/* Responsible Person Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Người phụ trách</h3>
          <label className="block">Họ và tên</label>
          <input
            type="text"
            value={selectedProject?.responsible_person?.fullname}
            onChange={(e) =>
              setSelectedProject((prevSelectedProject: any) => ({
                ...prevSelectedProject,
                responsible_person: {
                  ...prevSelectedProject.responsible_person,
                  fullname: e.target.value,
                },
              }))
            }
            className="admin-project-input-field"
          />

          <label className="block">Chức vụ</label>
          <input
            type="text"
            value={selectedProject?.responsible_person?.position}
            onChange={(e) =>
              setSelectedProject((prevSelectedProject: any) => ({
                ...prevSelectedProject,
                responsible_person: {
                  ...prevSelectedProject.responsible_person,
                  position: e.target.value,
                },
              }))
            }
            className="admin-project-input-field"
          />

          <label className="block">Email</label>
          <input
            type="text"
            value={selectedProject?.responsible_person?.email}
            onChange={(e) =>
              setSelectedProject((prevSelectedProject: any) => ({
                ...prevSelectedProject,
                responsible_person: {
                  ...prevSelectedProject.responsible_person,
                  email: e.target.value,
                },
              }))
            }
            className="admin-project-input-field"
          />

          <label className="block">Số điện thoại</label>
          <input
            type="text"
            value={selectedProject?.responsible_person?.phone_number}
            onChange={(e) =>
              setSelectedProject((prevSelectedProject: any) => ({
                ...prevSelectedProject,
                responsible_person: {
                  ...prevSelectedProject.responsible_person,
                  phone_number: e.target.value,
                },
              }))
            }
            className="admin-project-input-field"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Thông tin dự án</h3>
          {/*  */}
          <label>Tên dự án:</label>
          <input
            type="text"
            value={selectedProject?.name_project}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                name_project: e.target.value,
              })
            }
            className="admin-project-input-field"
          />

          {/*  */}
          <label>Lĩnh vực chuyên môn:</label>
          <select
            value={selectedProject?.specialized_field}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                specialized_field: e.target.value,
              })
            }
            className="admin-project-input-field"
            style={{ height: "42px" }}
          >
            <option value="" disabled>
              -- Chọn --
            </option>
            <option value="Nông nghiệp">Nông nghiệp</option>
            <option value="Thủ công nghiệp">Thủ công nghiệp</option>
          </select>

          {/*  */}
          <label>Hướng đi dự án:</label>
          <select
            value={selectedProject?.business_type}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                business_type: e.target.value,
              })
            }
            className="admin-project-input-field"
            style={{ height: "42px" }}
          >
            <option value="" disabled>
              -- Chọn --
            </option>
            <option value="Plan">Lên kế hoạch</option>
            <option value="Project">Triển khai dự án</option>
          </select>

          {/*  */}
          <label>Mô tả về dự án:</label>
          <textarea
            value={selectedProject?.description_project}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                description_project: e.target.value,
              })
            }
            className="admin-project-input-field"
          />

          {/*  */}
          <label>Các lưu ý khác:</label>
          <textarea
            value={selectedProject?.note}
            onChange={(e) =>
              setSelectedProject({
                ...selectedProject,
                note: e.target.value,
              })
            }
            className="admin-project-input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Thời gian</h3>

          <div className="flex items-center mb-1">
            <label className="w-64">Hạn đăng kí pitching:</label>
            <DatePicker
              className="cursor-pointer border"
              showIcon
              selected={
                new Date(selectedProject?.project_registration_expired_date)
              }
              dateFormat="dd/MM/yyyy"
              onChange={(date) =>
                setSelectedProject({
                  ...selectedProject,
                  project_registration_expired_date: date,
                })
              }
              placeholderText=" "
            />
          </div>

          <div className="flex items-center mb-1">
            <label className="w-64">Ngày dự kiến bắt đầu:</label>
            <DatePicker
              className="cursor-pointer border "
              showIcon
              selected={new Date(selectedProject?.project_start_date)}
              dateFormat="dd/MM/yyyy"
              onChange={(date) =>
                setSelectedProject({
                  ...selectedProject,
                  project_start_date: date,
                })
              }
              placeholderText=" "
            />
          </div>

          <div className="flex items-center mb-1">
            <label className="w-64">Ngày dự kiến kết thúc:</label>
            <DatePicker
              className="cursor-pointer border"
              showIcon
              selected={new Date(selectedProject?.project_expected_end_date)}
              dateFormat="dd/MM/yyyy"
              onChange={(date) =>
                setSelectedProject({
                  ...selectedProject,
                  project_expected_end_date: date,
                })
              }
              placeholderText=" "
            />
          </div>
        </div>

        <div>
          {!selectedProject?.document_related_link ? (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold">Tài liệu đính kèm</h3>
                <Button
                  className="bg-blue-300 text-blue-900 hover:bg-blue-300 mt-2 rounded flex gap-1"
                  onClick={handleButtonClick}
                >
                  <Download className="w-4 h-4 mr-2" /> Bấm để tải file lên
                </Button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {selectedFile && <p className="mt-2">Tệp tin đã tải: {selectedFile.name}</p>}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );

  const handleOpenModalDetails = (business: any) => {
    // console.log(business);
    setSelectedProject(business);
    setIsOpenModalDetail(true);
  };

  const handleCloseModalDetails = () => {
    setSelectedProject(null);
    setIsOpenModalDetail(false);
  };

  const handleCloseUpdateProject = () => {
    setIsEditMode(false);
  };

  const handleClickOpenInfo = (business: any) => {
    // console.log("Open info", business);
  };

  const handleClickRemoveProject = (business: any) => {
    // console.log("Remove project", business);
    alert("Tính năng chưa hỗ trợ");
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
          sender_email: "admin@gmail.com",
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

    setIsEditMode(false);
    setIsOpenModalDetail(false);
  };

  // hàm phê duyệt
  const handleConfirmProject = (id: number) => {
    // console.log("confirm nè");
    // console.log(selectedProject?.business?.email)

    dispatch(confirmProjectByAdmin(id)).then((result) => {
      if (confirmProjectByAdmin.fulfilled.match(result)) {
        // console.log(result.payload);
        const dataBodyNoti = {
          notification_type: NOTIFICATION_TYPE.CONFIRM_PROJECT,
          information: `Dự án ${selectedProject?.name_project} đã được phê duyệt`,
          sender_email: "admin@gmail.com",
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

  const handleChangeConfirmIntoUpdate = () => {
    setIsEditMode(!isEditMode);
  };

  const body = isEditMode ? bodyUpdate : bodyContent;

  const actionClose = isEditMode
    ? handleCloseUpdateProject
    : handleCloseModalDetails;

  const actionConfirm = isEditMode
    ? () => handleUpdateAndConfirmProject(selectedProject.id)
    : () => handleConfirmProject(selectedProject.id);

  const buttonConfirm = isEditMode ? "Xác nhận thay đổi" : "Phê duyệt";

  if (dataTable?.length === 0) {
    return (
      <CardBody className="text-center">
        <InfoText>Chưa có dự án nào được tạo.</InfoText>
      </CardBody>
    );
  }

  //new

  const handleDownload = (object: any) => {
    const link = document.createElement("a");
    link.href = object;
    link.download = `${object}_introduction`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                onClick: () => handleOpenModalDetails(business),
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
                onClick: () => handleClickRemoveProject(business),
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

        {isOpenModalDetail && selectedProject && (
          <CustomModal
            open={isOpenModalDetail}
            title={
              <div className="flex items-center gap-2">
                {isEditMode ? "Sửa dự án" : "Thông tin dự án"}
                {selectedProject?.project_status === "Pending" && (
                  <CiEdit
                    className="cursor-pointer"
                    onClick={handleChangeConfirmIntoUpdate}
                  />
                )}
              </div>
            }
            body={body}
            actionClose={actionClose}
            buttonClose={"Hủy"}
            actionConfirm={actionConfirm}
            buttonConfirm={buttonConfirm}
            status={selectedProject.project_status}
          />
        )}
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

export default ProjectTable;
