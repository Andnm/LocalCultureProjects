"use client";

import { AlertDialogConfirmPitching } from "@/components/alert-dialog/AlertDialogConfirmPitching";
import { getAllGroupAreMembers } from "@/src/redux/features/groupSlice";
import { getProjectById } from "@/src/redux/features/projectSlice";
import { useAppDispatch } from "@/src/redux/store";
import { ProjectType } from "@/src/types/project.type";
import { UserGroupType } from "@/src/types/user-group.type";
import {
  convertToNumberFormat,
  formatDate,
  generateFallbackAvatar,
} from "@/src/utils/handleFunction";
import { useParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUserLogin } from "@/src/hook/useUserLogin";
import Link from "next/link";

const SettingPage = () => {
  const params = useParams<{ projectId: string }>();

  const [dataProject, setDataProject] = React.useState<ProjectType | undefined>(
    undefined
  );
  const [groupList, setGroupList] = React.useState<UserGroupType[]>([]);
  const [userLogin, setUserLogin] = useUserLogin();

  const [businessUser, setBusinessUser] = React.useState<any>();
  const [responsiblePersonList, setResponsiblePersonList] = React.useState<
    any[]
  >([]);

  const dispatch = useAppDispatch();

  const handleDownloadFile = (object: any) => {
    const link = document.createElement("a");
    link.href = object;
    link.download = `${object}_introduction`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
    const projectId = parseInt(params.projectId, 10);
    let projectDetail: any = null;

    dispatch(getProjectById(projectId)).then((result) => {
      if (getProjectById.fulfilled.match(result)) {
        projectDetail = result.payload;

        setDataProject(result.payload);

        setBusinessUser(
          projectDetail?.user_projects?.find(
            (up: any) => up.user.role_name === "Business"
          )?.user
        );

        setResponsiblePersonList(
          projectDetail.user_projects
            .filter((up: any) => up.user.role_name === "ResponsiblePerson")
            .map((up: any) => up.user)
        );
      }
    });

    dispatch(getAllGroupAreMembers()).then((result) => {
      if (getAllGroupAreMembers.fulfilled.match(result)) {
        setGroupList(result.payload);
        console.log("group", result.payload);
      }
    });
  }, [params.projectId]);

  return (
    <div className="bg-gray-100">
      <div className="container p-6">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                <img
                  src={
                    businessUser?.avatar_url
                      ? businessUser?.avatar_url
                      : generateFallbackAvatar(businessUser?.fullname)
                  }
                  className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover"
                ></img>
                <h1 className="text-xl font-bold">{businessUser?.fullname}</h1>

                <p className="text-gray-700 font-sans">{businessUser?.email}</p>

                {businessUser?.link_web && (
                  <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <Link
                      href={`${businessUser?.link_web}`}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                      target="_blank"
                    >
                      Web
                    </Link>
                  </div>
                )}
              </div>
              <hr className="my-6 border-t border-gray-300" />

              <div className="flex flex-col">
                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                  Thông tin liên lạc
                </span>
                <ul>
                  <li className="mb-2">
                    <span className="font-bold">Số điện thoại: </span>{" "}
                    {businessUser?.phone_number ? (
                      businessUser?.phone_number
                    ) : (
                      <span style={{ fontStyle: "italic" }}>Chưa cập nhập</span>
                    )}
                  </li>
                  <li className="mb-2">
                    <span className="font-bold">Địa chỉ: </span>
                    {businessUser?.address_detail ? (
                      businessUser?.address_detail +
                      ", " +
                      businessUser?.address
                    ) : (
                      <span style={{ fontStyle: "italic" }}>Chưa cập nhập</span>
                    )}
                  </li>
                </ul>

                <hr className="my-6 border-t border-gray-300" />
              </div>

              <div className="flex flex-col">
                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                  Thông tin khác
                </span>

                <ul>
                  <li className="mb-2">
                    <span className="font-bold">Lĩnh vực kinh doanh: </span>{" "}
                    {businessUser?.business_sector ? (
                      businessUser?.business_sector
                    ) : (
                      <span style={{ fontStyle: "italic" }}>Chưa cập nhập</span>
                    )}
                  </li>
                  <li className="mb-2">
                    <span className="font-bold">Mô tả: </span>
                    {businessUser?.business_description ? (
                      businessUser?.business_description
                    ) : (
                      <span style={{ fontStyle: "italic" }}>Chưa cập nhập</span>
                    )}
                  </li>
                </ul>

                <hr className="my-6 border-t border-gray-300" />
              </div>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6 relative">
              <h2 className="text-xl font-bold mb-4">Tên dự án</h2>
              <p className="text-gray-700 text-2xl font-sans">
                {dataProject?.name_project}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    Loại hình Dự án
                  </h2>
                  <p className="text-gray-700 font-sans">
                    {" "}
                    {dataProject?.business_type === "Project"
                      ? "Triển khai dự án"
                      : "Lên kế hoạch"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    Tài liệu liên quan
                  </h2>
                  <p className="text-gray-700 font-sans">
                    {dataProject?.document_related_link ? (
                      dataProject.document_related_link.length > 0 ? (
                        <Button
                          className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                          onClick={() =>
                            handleDownloadFile(
                              dataProject.document_related_link
                            )
                          }
                        >
                          Tải xuống tài liệu
                        </Button>
                      ) : (
                        <span className="italic"> (Chưa được cập nhập)</span>
                      )
                    ) : (
                      <span className="italic"> (Chưa được cập nhập)</span>
                    )}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-bold mt-6 mb-4">Mục đích Dự án</h2>
              <div className="max-w-4xl">
                <pre className="text-gray-700 whitespace-pre-wrap break-words font-sans text-justify">
                  {dataProject?.purpose}
                </pre>
              </div>
              <>
                <h2 className="text-xl font-bold mt-6 mb-4">
                  Đối tượng mục tiêu
                </h2>
                <div className="max-w-4xl">
                  <pre className="text-gray-700 whitespace-pre-wrap break-words font-sans text-justify">
                    {dataProject?.target_object}
                  </pre>
                </div>

                <h2 className="text-xl font-bold mt-6 mb-4">Yêu cầu cụ thể</h2>
                <div className="max-w-4xl">
                  <pre className="text-gray-700 whitespace-pre-wrap break-words font-sans text-justify">
                    {dataProject?.request ? (
                      dataProject?.request
                    ) : (
                      <span className="italic">(Chưa được cập nhập)</span>
                    )}
                  </pre>
                </div>

                <h2 className="text-xl font-bold mt-6 mb-4">
                  Ngân sách dự kiến
                </h2>
                <p className="text-gray-700 font-sans">
                  {convertToNumberFormat(dataProject?.expected_budget)} VNĐ
                </p>
              </>

              {dataProject?.note && (
                <>
                  <h2 className="text-xl font-bold mt-6 mb-4">Chú thích</h2>
                  <pre className="text-gray-700 whitespace-pre-wrap break-words font-sans text-justify">
                    {dataProject?.note}
                  </pre>
                </>
              )}

              <h2 className="text-xl font-bold mt-6 mb-4">
                Thời gian thực hiện dự án
              </h2>
              <p className="text-gray-700 font-sans">
                {dataProject?.project_implement_time}
              </p>

              <>
                <h2 className="text-xl font-bold mt-6 mb-4">Người phụ trách</h2>
                {responsiblePersonList.map((responsiblePersonInfo, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md grid grid-cols-3 mb-4"
                  >
                    <div className="mb-4">
                      <p className="font-semibold font-sans">Họ và tên:</p>
                      <p>{responsiblePersonInfo.fullname}</p>
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold font-sans">Số điện thoại:</p>
                      <p>{responsiblePersonInfo.phone_number}</p>
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold font-sans">Email:</p>
                      <p>{responsiblePersonInfo.email}</p>
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold font-sans">Chức vụ:</p>
                      <p>
                        {responsiblePersonInfo.position ? (
                          responsiblePersonInfo.position
                        ) : (
                          <span className="italic text-gray-500">
                            Chưa cập nhập
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Thông tin liên hệ khác:</p>
                      <p>
                        {responsiblePersonInfo.other_contact ? (
                          responsiblePersonInfo.other_contact
                        ) : (
                          <span className="italic text-gray-500">
                            Chưa cập nhập
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
