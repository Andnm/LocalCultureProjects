"use client";

import { truncateString } from "@/src/utils/handleFunction";
import React from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

interface SecondStageProps {
  firstProject: any;
  setFirstProject: any;
  errorFirstProject: any;
  setErrorFirstProject: any;
  selectedJuridicalFiles: any;
  setSelectedJuridicalFiles: any;
  juridicalFilesOrigin: any;
  setJuridicalFilesOrigin: any;
  errorFile: any;
  setErrorFile: any;
}

const SecondStage: React.FC<SecondStageProps> = ({
  firstProject,
  setFirstProject,
  errorFirstProject,
  setErrorFirstProject,
  selectedJuridicalFiles,
  setSelectedJuridicalFiles,
  juridicalFilesOrigin,
  setJuridicalFilesOrigin,
  errorFile,
  setErrorFile,
}) => {
  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    setErrorFile("");
    setErrorFirstProject((prevErrorFirstProject: any) => ({
      ...prevErrorFirstProject,
      [field]: "",
    }));

    if (field === "is_extent") {
      value = e.target.checked;
    } else if (field === "expected_budget") {
      value = value.replace(/\D/g, "");
    }

    if (field === "expected_budget" && parseInt(value) > 1000) {
      value = parseInt(value).toLocaleString();
    }

    setFirstProject({
      ...firstProject,
      [field]: value,
    });
  };

  // xử lý file
  const handleOnDrop = (acceptedFiles: any) => {
    setJuridicalFilesOrigin([...juridicalFilesOrigin, ...acceptedFiles]);
    setSelectedJuridicalFiles([...selectedJuridicalFiles, ...acceptedFiles]);

    acceptedFiles?.forEach((file: any) => {
      previewImage(file);
    });
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: {
      pdf: ["application/pdf"],
    },
    onDrop: handleOnDrop,
  });

  const previewImage = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target) {
        const imageUrl = e.target.result as string;

        setSelectedJuridicalFiles((prevFiles: any) =>
          prevFiles.map((prevFile: any) =>
            prevFile.name === file.name
              ? { ...prevFile, previewUrl: imageUrl }
              : prevFile
          )
        );
      }
    };
  };

  const removeImage = (path: any) => {
    setSelectedJuridicalFiles((prevFiles: any) =>
      prevFiles.filter((file: any) => file.path !== path)
    );
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <h4 className="title text-2xl font-medium">
        Bổ sung thông tin của dự án
      </h4>
      <p className="sub-title text-smmt-2">
        Đây là các thông tin cần thiết để có thể hoàn thành các bước tạo tài
        khoản của doanh nghiệp{" "}
      </p>

      <div className="stage-3">
        <div className="form-group-material mb-0">
          <input
            type="text"
            required={true}
            className="form-control"
            placeholder="Ví dụ: Chiến dịch truyền thông cho sản phẩm văn hóa bản địa ABC"
            value={firstProject.name_project}
            onChange={(e) => handleInputChange(e, "name_project")}
          />
          <label>
            Tên Dự án <span className="text-red-700">*</span>
          </label>
          {errorFirstProject.name_project && (
            <span className="error-message">
              {errorFirstProject.name_project}
            </span>
          )}
        </div>

        {/* loai hinh du an */}
        <fieldset
          className="border border-gray-300 px-4"
          style={{ borderRadius: "8px" }}
        >
          <legend
            className="text-lg"
            style={{ fontSize: "12px", color: "#6d859f", opacity: 0.7 }}
          >
            Loại hình Dự án <span className="text-red-700">*</span>
          </legend>
          <div className="pb-2">
            <div className="flex flex-row justify-around">
              {["Lên ý tưởng", "Triển khai thực tế"].map((option) => (
                <label
                  key={option}
                  className="inline-flex items-center cursor-pointer"
                  style={{
                    fontSize: "15px",
                    color:
                      firstProject.business_type === option
                        ? "#000"
                        : "#ced4da",
                  }}
                >
                  <input
                    type="radio"
                    name="business_type"
                    value={option}
                    checked={firstProject.business_type === option}
                    onChange={(e) => handleInputChange(e, "business_type")}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </fieldset>
        {errorFirstProject.business_type && (
          <span className="error-message">
            {errorFirstProject.business_type}
          </span>
        )}

        {/* mục đích */}
        <div className="form-group-material mt-4">
          <textarea
            rows={3}
            required={true}
            className="form-control"
            spellCheck="false"
            placeholder="Ví dụ: xây dựng thương hiệu/tái định vị thương hiệu/tăng nhận biết thương hiệu… cho sản phẩm văn hóa bản địa ABC"
            value={firstProject.purpose}
            onChange={(e) => handleInputChange(e, "purpose")}
          />
          <label>
            Mục đích Dự án <span className="text-red-700">*</span>
          </label>
          {errorFirstProject.purpose && (
            <span className="error-message">{errorFirstProject.purpose}</span>
          )}
        </div>

        {/* đối tượng mục tiêu */}
        <div className="form-group-material mt-4">
          <textarea
            rows={3}
            required={true}
            className="form-control"
            spellCheck="false"
            placeholder="Vui lòng cung cấp thông tin chi tiết (nếu có), bao gồm nhưng không giới hạn về: độ tuổi, giới tính, phạm vi địa lý, mức thu nhập & chi tiêu,..."
            value={firstProject.target_object}
            onChange={(e) => handleInputChange(e, "target_object")}
          />
          <label>
            Đối tượng mục tiêu <span className="text-red-700">*</span>
          </label>
          {errorFirstProject.target_object && (
            <span className="error-message">
              {errorFirstProject.target_object}
            </span>
          )}
        </div>

        {/* yêu cầu cụ thể */}
        <div className="form-group-material mt-4">
          <textarea
            rows={3}
            required={true}
            className="form-control"
            spellCheck="false"
            value={firstProject.request}
            onChange={(e) => handleInputChange(e, "request")}
          />
          <label>
            Yêu cầu cụ thể <span className="text-red-700">*</span>
          </label>
          {errorFirstProject.request && (
            <span className="error-message">{errorFirstProject.request}</span>
          )}
        </div>

        {/* thời gian thực hiện dự án */}
        <fieldset
          className="border border-gray-300 px-4"
          style={{ borderRadius: "8px" }}
        >
          <legend
            className="text-lg"
            style={{ fontSize: "12px", color: "#6d859f", opacity: 0.7 }}
          >
            Thời gian thực hiện Dự án <span className="text-red-700">*</span>
          </legend>

          <div className="pb-2">
            <div className="flex flex-col gap-2 pl-4">
              {[
                "Học kì Hè 2024 (Từ 5/2024 tới 8/2024)",
                "Học kì Thu 2024 (Từ 9/2024 tới 12/2024)",
              ].map((option) => (
                <label
                  key={option}
                  className="inline-flex items-center cursor-pointer"
                  style={{
                    fontSize: "15px",
                    color:
                      firstProject.project_implement_time === option
                        ? "#000"
                        : "#ced4da",
                  }}
                >
                  <input
                    type="radio"
                    name="project_implement_time"
                    value={option}
                    checked={firstProject.project_implement_time === option}
                    onChange={(e) =>
                      handleInputChange(e, "project_implement_time")
                    }
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </fieldset>
        {errorFirstProject.project_implement_time && (
          <span className="error-message">
            {errorFirstProject.project_implement_time}
          </span>
        )}

        <div className="form-group-material my-6">
          <input
            type="checkbox"
            id="extendDeadline"
            value={firstProject.is_extent}
            onChange={(e) => handleInputChange(e, "is_extent")}
          />
          <label htmlFor="extendDeadline" className="ml-2 text-justify">
            Quý DN có muốn gia hạn đề bài sang kỳ tiếp theo nếu không có nhóm
            phù hợp trong kỳ hiện tại không
          </label>
        </div>

        {/* ngân sách dự kiến */}
        <div className="form-group-material mt-4">
          <input
            type="text"
            required={true}
            className="form-control"
            value={
              firstProject.expected_budget !== 0
                ? firstProject.expected_budget
                : ""
            }
            onChange={(e) => handleInputChange(e, "expected_budget")}
          />
          <label>
            Ngân sách dự kiến
            <span className="text-red-700">*</span>
          </label>
          {errorFirstProject.expected_budget && (
            <span className="error-message">
              {errorFirstProject.expected_budget}
            </span>
          )}
        </div>

        <div className="form-group-material mt-4">
          <textarea
            rows={3}
            required={true}
            className="form-control"
            spellCheck="false"
            placeholder="Không quá 300 chữ"
            value={firstProject.note}
            onChange={(e) => handleInputChange(e, "note")}
          />
          <label>Các lưu ý khác (nếu có)</label>
          {errorFirstProject.note && (
            <span className="error-message">{errorFirstProject.note}</span>
          )}
        </div>

        <div className="stage-2">
          <label
            style={{ cursor: "pointer" }}
            htmlFor="select_photos"
            className="photo-upload mb-2 block"
            {...getRootProps({ isFocused, isDragAccept, isDragReject })}
          >
            <p className="title">Tài liệu đính kèm</p>

            <FiUploadCloud />

            <h5 className="photo-upload-title">
              Chọn hoặc kéo thả tệp tại đây{" "}
            </h5>
            <p>Chỉ nhận file PDF và tệp có dung lượng không trên 10MB</p>
          </label>

          {selectedJuridicalFiles.length > 0 && (
            <div className="form-group mb-0 mt-4">
              <div className="photo-uploaded">
                <p className="font-semibold text-sm text-center">
                  Các file đã đăng
                </p>

                <ul className="list-photo">
                  {selectedJuridicalFiles.map((file: any) => (
                    <li key={file.path}>
                      <div className="photo-item">
                        {file.previewUrl ? (
                          <p>{truncateString(file.path, 20)}</p>
                        ) : (
                          <p>Loading...</p>
                        )}
                        <div className="delete-item">
                          <MdDeleteOutline
                            onClick={() => removeImage(file.path)}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {fileRejections.length > 0 && (
            <div className="form-group mb-0 mt-6">
              <div className="photo-uploaded">
                <p className="font-semibold text-sm text-center">
                  File bị từ chối
                </p>

                <ul className="list-photo">
                  {fileRejections.map((file: any, index) => (
                    <li key={index}>
                      <div className="photo-item">
                        <img src={file.previewUrl} alt={file.file.path} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {errorFile && <span className="error-message">{errorFile}</span>}
        </div>
      </div>
    </div>
  );
};

export default SecondStage;
