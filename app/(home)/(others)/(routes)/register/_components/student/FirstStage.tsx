import React from "react";
import { StudentDataType } from "../../_types/student.type";

interface FirstStageProps {
  studentData: StudentDataType;
  setStudentData: React.Dispatch<React.SetStateAction<StudentDataType>>;
  errorStudentForm: any;
  setErrorStudentForm: any;
}

const FirstStage: React.FC<FirstStageProps> = ({
  studentData,
  setStudentData,
  errorStudentForm,
  setErrorStudentForm,
}) => {
  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    setErrorStudentForm((prevErrorStudentForm: any) => ({
      ...prevErrorStudentForm,
      [field]: "",
    }));

    if (field === "phone_number") {
      value = value.replace(/\D/g, "");
    }

    setStudentData({
      ...studentData,
      [field]: value,
    });
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <h4 className="title text-2xl font-medium">
        Thêm thông tin ngoài lề khác về bản thân bạn
      </h4>
      <p className="sub-title text-smmt-2">
        Bổ sung các thông tin cần thiết về bạn để có thể hoàn thành các bước tạo
        tài khoản{" "}
      </p>

      <div className="stage-3">
        <div className="container-input">
          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={studentData.fullname}
              onChange={(e) => handleInputChange(e, "fullname")}
            />
            <label>
              Họ và tên <span className="text-red-700">*</span>
            </label>
            {errorStudentForm.fullname && (
              <span className="error-message">{errorStudentForm.fullname}</span>
            )}
          </div>

          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={studentData.phone_number}
              onChange={(e) => handleInputChange(e, "phone_number")}
            />
            <label>
              Số điện thoại <span className="text-red-700">*</span>
            </label>

            {errorStudentForm.phone_number && (
              <span className="error-message">
                {errorStudentForm.phone_number}
              </span>
            )}
          </div>

          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={studentData.roll_number}
              onChange={(e) => handleInputChange(e, "roll_number")}
            />
            <label>
              Mã số sinh viên <span className="text-red-700">*</span>
            </label>
            {errorStudentForm.roll_number && (
              <span className="error-message">
                {errorStudentForm.roll_number}
              </span>
            )}
          </div>
        </div>

        <div className="form-group-material mt-4">
          <textarea
            rows={3}
            required={true}
            className="form-control"
            spellCheck="false"
            value={studentData.description}
            onChange={(e) => handleInputChange(e, "description")}
          />
          <label>
            Mô tả bản thân <span className="text-red-700">*</span>
          </label>

          {errorStudentForm.description && (
            <span className="error-message">
              {errorStudentForm.description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstStage;
