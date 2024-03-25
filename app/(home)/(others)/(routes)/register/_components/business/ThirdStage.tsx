import React from "react";

interface SecondStageProps {
  firstProject: any;
  setFirstProject: any;
  errorFirstProject: any;
  setErrorFirstProject: any;
}

const SecondStage: React.FC<SecondStageProps> = ({
  firstProject,
  setFirstProject,
  errorFirstProject,
  setErrorFirstProject,
}) => {
  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    setFirstProject({
      ...firstProject,
      [field]: value,
    });
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
                    name="business_sector"
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
          {errorFirstProject.business_description && (
            <span className="error-message">
              {errorFirstProject.business_description}
            </span>
          )}
        </div>

        <div className="form-group-material mb-0">
          <input
            type="text"
            required={true}
            className="form-control"
            value={firstProject.expected_budget}
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

        <div className="form-group-material mb-0">
          <input
            type="text"
            required={true}
            className="form-control"
            value={firstProject.document_related_link}
            onChange={(e) => handleInputChange(e, "document_related_link")}
          />
          <label>
            Tài liệu đính kèm
            <span className="text-red-700">*</span>
          </label>
          {errorFirstProject.document_related_link && (
            <span className="error-message">
              {errorFirstProject.document_related_link}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondStage;
