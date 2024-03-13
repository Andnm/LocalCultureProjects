"use client";

import { ProjectType } from "@/src/types/project.type";
import { ViewTitleForm } from "./ViewTitleForm";
import ProgressLoading from "@/src/components/loading/ProgressLoading";
import { Button } from "@/components/ui/button";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { Drawer, IconButton } from "@material-tailwind/react";
import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { Check, Edit, MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BiDetail } from "react-icons/bi";
import { useAppDispatch } from "@/src/redux/store";
import {
  changeStatusProjectByLecturer,
  checkProjectCanDone,
} from "@/src/redux/features/projectSlice";
import toast from "react-hot-toast";
import {
  changeStatusFromEnToVn,
  getColorByProjectStatus,
  truncateString,
} from "@/src/utils/handleFunction";
import { usePathname } from "next/navigation";
import {
  confirmSummaryReport,
  getSummaryReportByProjectId,
  upSummaryReportByLeader,
  updateSummaryReportByLeader,
} from "@/src/redux/features/summaryReportSlice";
import { storage } from "@/src/utils/configFirebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { Hint } from "@/components/hint";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { createNewNotification } from "@/src/redux/features/notificationSlice";

interface ViewNavbarProps {
  dataProject: any;
  setDataProject: any;
  projectId: number;
  groupId: number;
}

const TABLE_HEAD = ["Doanh nghiệp ", "Giảng viên ", "File tổng kết"];

export const ViewNavbar = ({
  dataProject,
  setDataProject,
  projectId,
  groupId,
}: ViewNavbarProps) => {
  const [userLogin, setUserLogin] = useUserLogin();
  const [open, setOpen] = React.useState(false);
  const [summaryReport, setSummaryReport] = React.useState<any>([]);

  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const extractNumberFromPath = (pathName: string): number => {
    const match = pathName.match(/\/(\d+)\/view/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const [checkProjectCanDoneStatus, setCheckProjectCanDoneStatus] =
    React.useState<boolean>(false);

  const handleDoneProject = () => {
    dispatch(checkProjectCanDone(extractNumberFromPath(pathName))).then(
      (result) => {
        if (checkProjectCanDone.fulfilled.match(result)) {
          const projectId = dataProject?.id;
          const projectStatus = "Done";
          dispatch(
            changeStatusProjectByLecturer({ projectId, projectStatus, groupId })
          ).then((res) => {
            if (changeStatusProjectByLecturer.fulfilled.match(res)) {
              const dataBodyNoti = {
                notification_type: NOTIFICATION_TYPE.DONE_PROJECT_BUSINESS,
                information: `Mentor xác nhận dự án ${dataProject?.name_project} đã hoàn thành `,
                sender_email: `${userLogin?.email}`,
                receiver_email: "business@gmail.com",
                note: projectId,
              };

              dispatch(createNewNotification(dataBodyNoti)).then((resNoti) => {
                console.log(resNoti);
              });

              const dataBodyNoti2 = {
                notification_type: NOTIFICATION_TYPE.DONE_PROJECT_STUDENT,
                information: `Mentor xác nhận dự án ${dataProject?.name_project} đã hoàn thành `,
                sender_email: `${userLogin?.email}`,
                receiver_email: "dangnguyenminhan123@gmail.com",
                note: projectId,
              };

              dispatch(createNewNotification(dataBodyNoti2)).then((resNoti) => {
                console.log(resNoti);
              });

              toast.success(`Thay đổi trạng thái dự án thành công!`);
              setDataProject(res.payload);
            } else {
              toast.error(`Lỗi khi hoàn thành ${res.payload}`);
            }
          });
        } else {
          toast.error(`Chưa thể hoàn thành dự án ${result.payload}`);
          return;
        }
      }
    );
  };

  const handleClickConfirmSummaryReport = () => {
    const bodyData = {
      project_id: extractNumberFromPath(pathName),
      groupId: groupId,
    };

    dispatch(confirmSummaryReport(bodyData)).then((result) => {
      if (confirmSummaryReport.fulfilled.match(result)) {
        toast.success("Xác nhận báo cáo thành công");
        setSummaryReport(result.payload);
        // console.log("confirm", result.payload);
      } else {
        toast.error(`${result.payload}`);
      }
    });
  };

  const [loadingUploadFile, setLoadingUploadFile] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null
  );
  const [isEditingSummaryReport, setIsEditingSummaryReport] =
    React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    setLoadingUploadFile(true);

    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Lỗi khi tải tệp lên Firebase Storage", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const bodyData = {
              summary_report_url: downloadURL,
              projectId: dataProject?.id,
              groupId: groupId,
            };

            if (summaryReport.length === 0) {
              dispatch(upSummaryReportByLeader(bodyData)).then((result) => {
                if (upSummaryReportByLeader.fulfilled.match(result)) {
                  toast.success("Tải lên báo cáo thành công");
                  setSummaryReport(result.payload);
                  setLoadingUploadFile(false);
                  setFile(null);
                } else {
                  toast.error(`${result.payload}`);
                  setLoadingUploadFile(false);
                }
              });
            } else {
              dispatch(updateSummaryReportByLeader(bodyData)).then((result) => {
                if (updateSummaryReportByLeader.fulfilled.match(result)) {
                  toast.success("Cập nhập báo cáo thành công");
                  setSummaryReport(result.payload);
                  setLoadingUploadFile(false);
                  setFile(null);
                } else {
                  toast.error(`${result.payload}`);
                  setLoadingUploadFile(false);
                }
              });
            }
          });
        }
      );
    }
  };

  const handleUploadSummaryReport = () => {
    handleUpload();
  };

  const handleDownloadFile = () => {
    const fileUrl = summaryReport.summary_report_url;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${dataProject.name_project}_SUMMARY_REPORT`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancelUploadSummaryReport = () => {
    setFile(null);
  };

  const handleUpdateSummaryReport = () => {};

  const handleClickEditSummaryReport = () => {
    setIsEditingSummaryReport(true);

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCheckProjectCanDone = () => {
    dispatch(checkProjectCanDone(extractNumberFromPath(pathName))).then(
      (result) => {
        if (checkProjectCanDone.fulfilled.match(result)) {
          setCheckProjectCanDoneStatus(result.payload);
        } else {
          setCheckProjectCanDoneStatus(false);
        }
        console.log("can done", result.payload);
      }
    );
  };

  React.useEffect(() => {
    // Gọi checkProjectCanDone ngay khi component được render
    handleCheckProjectCanDone();

    // Thiết lập interval để gọi checkProjectCanDone mỗi 3 giây
    const intervalId = setInterval(() => {
      handleCheckProjectCanDone();
    }, 3000);

    // Cleanup khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    dispatch(getSummaryReportByProjectId(extractNumberFromPath(pathName))).then(
      (result) => {
        if (getSummaryReportByProjectId.fulfilled.match(result)) {
          socketInstance.on(
            `getSummaryReports-${extractNumberFromPath(pathName)}`,
            (data: any) => {
              // console.log("ok socket");
              setSummaryReport(data.summaryReport);
              // console.log('data report', data.summaryReport)
            }
          );
          // setSummaryReport(result.payload);
          // console.log(result.payload);
        } else {
          // toast.error("Lỗi khi lấy dữ liệu");
          socketInstance.on(
            `getSummaryReports-${extractNumberFromPath(pathName)}`,
            (data: any) => {
              // console.log("ok socket fail");
              setSummaryReport(data.summaryReport);
              console.log("fail", data.summaryReport);
            }
          );
        }
      }
    );
  }, [summaryReport]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-10"
          onClick={closeDrawer}
        ></div>
      )}

      <div
        className="w-full h-14 z-20 bg-black/50 fixed top-17 flex
  items-center px-6 gap-x-4 text-white justify-between"
      >
        {pathName === `/project/${projectId}/view` && (
          <>
            <div className="flex gap-2 items-center">
              <p>Trạng thái dự án: </p>
              <div
                className={`${getColorByProjectStatus(
                  dataProject?.project_status
                )} px-3 py-1 rounded-xl`}
              >
                {changeStatusFromEnToVn(dataProject?.project_status)}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {!open && checkProjectCanDoneStatus && (
                <Button
                  onClick={openDrawer}
                  className="bg-teal-300 text-teal-900 hover:bg-teal-300 rounded"
                >
                  Tổng kết
                </Button>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="h-auto w-auto p-2" variant={"ghost"}>
                    <MoreHorizontal className="h-6 w-6 ml-[420px]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="px-0 pt-3 pb-3 bg-white ml-[420px]"
                  side="bottom"
                  align="start"
                  style={{ borderRadius: "7px" }}
                >
                  <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Các chức năng khác
                  </div>

                  <Button
                    className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                    variant={"ghost"}
                  >
                    <BiDetail className="w-3 h-3 mr-1" /> Chi tiết dự án
                  </Button>

                  {userLogin?.role_name === "Lecturer" &&
                    dataProject?.project_status === "Processing" && (
                      <Button
                        className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                        variant={"ghost"}
                        onClick={handleDoneProject}
                      >
                        <Check className="w-3 h-3 mr-1" /> Hoàn thành dự án
                      </Button>
                    )}
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        <Drawer
          overlay={false}
          placement="right"
          open={open}
          onClose={closeDrawer}
          className="p-4"
          size={700}
        >
          <div className="mb-6 flex items-center justify-between">
            <h5 className="text-black font-bold text-lg">TỔNG KẾT</h5>
            <IconButton variant="text" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>

          <div className="flex gap-2 text-black border-black">
            <Card className="h-full w-full overflow-hidden mt-32">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-5">
                      {summaryReport &&
                      summaryReport.summary_report_url &&
                      summaryReport?.isBusinessConfirmed !== undefined ? (
                        <>
                          {summaryReport?.isBusinessConfirmed ? (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Đã xác nhận
                            </Typography>
                          ) : (
                            userLogin?.role_name === "Business" && (
                              <Button
                                onClick={handleClickConfirmSummaryReport}
                                className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                              >
                                Xác nhận
                              </Button>
                            )
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          Chưa xác nhận
                        </Typography>
                      )}

                    </td>
                    
                    <td className={` pl-5 bg-blue-gray-50/50`}>

                       {summaryReport &&
                      summaryReport.summary_report_url &&
                      summaryReport?.isLecturerConfirmed !== undefined ? (
                        <>
                          {summaryReport?.isLecturerConfirmed ? (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              Đã xác nhận
                            </Typography>
                          ) : (
                            userLogin?.role_name === "Lecturer" && (
                              <Button
                                onClick={handleClickConfirmSummaryReport}
                                className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                              >
                                Xác nhận
                              </Button>
                            )
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          Chưa xác nhận
                        </Typography>
                      )}

                    
                    </td>
                    <td className="p-4">
                      {summaryReport?.summary_report_url &&
                      (summaryReport?.isBusinessConfirmed ||
                        summaryReport?.isStudentConfirmed) ? (
                        <Button
                          className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                          onClick={handleDownloadFile}
                        >
                          Tải xuống báo cáo
                        </Button>
                      ) : summaryReport?.summary_report_url ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="text-sm"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                          />

                          {file ? (
                            <p className="text-sm">
                              {truncateString(file.name, 15)}
                            </p>
                          ) : (
                            <Button
                              className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                              onClick={handleDownloadFile}
                            >
                              Tải xuống báo cáo
                            </Button>
                          )}

                          {userLogin?.role_name === "Student" && (
                            <Hint
                              sideOffset={10}
                              description={`Thay đổi báo cáo`}
                              side={"top"}
                            >
                              <Edit
                                className="cursor-pointer w-5 h-5"
                                onClick={handleClickEditSummaryReport}
                              />
                            </Hint>
                          )}
                        </div>
                      ) : userLogin?.role_name === "Student" ? (
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm">
                          Sinh viên chưa nộp báo cáo tổng kết
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          <div className="relative left-1/3 mt-5">
            {file && (
              <div className="flex gap-3">
                <Button
                  className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                  onClick={handleUploadSummaryReport}
                >
                  Tải lên báo cáo
                </Button>

                <Button
                  className="font-normal transition text-white hover:text-red-600 border border-orange-600 bg-orange-600"
                  onClick={handleCancelUploadSummaryReport}
                >
                  Hủy
                </Button>
              </div>
            )}
          </div>

          {loadingUploadFile && <SpinnerLoading />}
        </Drawer>

        <ViewTitleForm />
      </div>
    </>
  );
};
