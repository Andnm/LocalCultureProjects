import {
  formatDate,
  generateFallbackAvatar,
  getColorByProjectStatus,
} from "@/src/utils/handleFunction";
import { Button } from "@material-tailwind/react";
import { Download } from "lucide-react";
import React from "react";

interface InfoProjectProps {
  selectedProject: any;
}

const InfoProject = ({ selectedProject }: InfoProjectProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Business Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Doanh nghiệp:</h3>
        <img
          src={
            !selectedProject?.business?.avatar_url ||
            selectedProject?.business?.avatar_url === null
              ? generateFallbackAvatar(selectedProject?.business?.fullname)
              : selectedProject?.business?.avatar_url
          }
          alt={"img"}
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
};

export default InfoProject;
