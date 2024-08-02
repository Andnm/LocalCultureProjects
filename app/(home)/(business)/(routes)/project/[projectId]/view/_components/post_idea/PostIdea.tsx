import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, IconButton } from "@material-tailwind/react";
import { Card, Typography } from "@material-tailwind/react";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { Modal } from "antd";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/src/redux/store";
import {
  confirmSummaryReport,
  updateSummaryReportByLeader,
  upSummaryReportByLeader,
} from "@/src/redux/features/summaryReportSlice";
import toast from "react-hot-toast";
import { storage } from "@/src/utils/configFirebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Hint } from "@/components/hint";
import { Check, Edit, MoreHorizontal } from "lucide-react";
import { truncateString } from "@/src/utils/handleFunction";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";

const { confirm } = Modal;
const TABLE_HEAD = ["Doanh nghiệp ", "Giảng viên ", "File tổng kết"];

interface PostIdeaProps {
  dataProject: any;
  groupId: number;
}

export const PostIdea = ({ dataProject, groupId }: PostIdeaProps) => {
  const [userLogin, setUserLogin] = useUserLogin();
  const [open, setOpen] = React.useState(false);
  const [summaryReport, setSummaryReport] = React.useState<any>([]);

  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const extractNumberFromPath = (pathName: string): number => {
    const match = pathName.match(/\/(\d+)\/view/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const handleClickConfirmSummaryReport = () => {
    setLoadingUploadFile(true);
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
      setLoadingUploadFile(false);
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

  const handleClickEditSummaryReport = () => {
    setIsEditingSummaryReport(true);

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-10"
          onClick={closeDrawer}
        ></div>
      )}

      <Button
        onClick={openDrawer}
        className="bg-teal-300 text-teal-900 hover:bg-teal-300 rounded"
      >
        Tổng kết
      </Button>

      <Drawer
        overlay={false}
        placement="right"
        open={open}
        onClose={closeDrawer}
        className="p-4 drawer-summary"
        style={{ zIndex: "9999" }}
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
                    {userLogin?.role_name === "Business" ||
                    userLogin?.role_name === "ResponsiblePerson" ? (
                      <>
                        {summaryReport.summary_report_url &&
                        summaryReport?.isBusinessConfirmed ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            Đã xác nhận
                          </Typography>
                        ) : (
                          <Button
                            onClick={async () => {
                              closeDrawer();
                              confirm({
                                cancelText: "Quay lại",
                                okText: "Xác nhận",
                                title:
                                  "Bạn có chắc là muốn xác nhận báo cáo tổng kết này? ",
                                async onOk() {
                                  openDrawer();
                                  handleClickConfirmSummaryReport();
                                },
                                onCancel() {
                                  openDrawer();
                                },
                              });
                            }}
                            className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                          >
                            Xác nhận
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {summaryReport.summary_report_url &&
                        summaryReport?.isBusinessConfirmed !== null ? (
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
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                Chưa xác nhận
                              </Typography>
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
                      </>
                    )}
                  </td>

                  <td className={` pl-5 bg-blue-gray-50/50`}>
                    {userLogin?.role_name === "Lecturer" ? (
                      <>
                        {summaryReport.summary_report_url &&
                        summaryReport?.isLecturerConfirmed ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            Đã xác nhận
                          </Typography>
                        ) : (
                          <Button
                            onClick={async () => {
                              closeDrawer();
                              confirm({
                                cancelText: "Quay lại",
                                okText: "Xác nhận",
                                title:
                                  "Bạn có chắc là muốn xác nhận báo cáo tổng kết này? ",
                                async onOk() {
                                  openDrawer();
                                  handleClickConfirmSummaryReport();
                                },
                                onCancel() {
                                  openDrawer();
                                },
                              });
                            }}
                            className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                          >
                            Xác nhận
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {summaryReport &&
                        summaryReport.summary_report_url &&
                        summaryReport?.isLecturerConfirmed !== null ? (
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
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                Chưa xác nhận
                              </Typography>
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
                      </>
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
    </>
  );
};

export default PostIdea;
