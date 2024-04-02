import React from "react";

interface SecondStageProps {
  responsiblePerson: any;
  setResponsiblePerson: any;
  errorResponsiblePerson: any;
  setErrorResponsiblePerson: any;
}

const SecondStage: React.FC<SecondStageProps> = ({
  responsiblePerson,
  setResponsiblePerson,
  errorResponsiblePerson,
  setErrorResponsiblePerson,
}) => {
  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    setErrorResponsiblePerson((prevErrorResponsiblePerson: any) => ({
      ...prevErrorResponsiblePerson,
      [field]: "",
    }));

    if (field === "phone_number") {
      value = value.replace(/\D/g, "");
    }

    setResponsiblePerson({
      ...responsiblePerson,
      [field]: value,
    });
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <h4 className="title text-2xl font-medium">
        Bổ sung thông tin của người phụ trách dự án
      </h4>
      <p className="sub-title text-smmt-2">
        Đây là các thông tin cần thiết để có thể hoàn thành các bước tạo tài
        khoản của doanh nghiệp{" "}
      </p>

      <div className="stage-3">
        <div className="container-input">
          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={responsiblePerson.fullname}
              onChange={(e) => handleInputChange(e, "fullname")}
            />
            <label>
              Họ và tên <span className="text-red-700">*</span>
            </label>
            {errorResponsiblePerson.fullname && (
              <span className="error-message">
                {errorResponsiblePerson.fullname}
              </span>
            )}
          </div>

          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={responsiblePerson.phone_number}
              onChange={(e) => handleInputChange(e, "phone_number")}
            />
            <label>
              Số điện thoại <span className="text-red-700">*</span>
            </label>
            {errorResponsiblePerson.phone_number && (
              <span className="error-message">
                {errorResponsiblePerson.phone_number}
              </span>
            )}
          </div>

          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={responsiblePerson.position}
              onChange={(e) => handleInputChange(e, "position")}
            />
            <label>
              Chức vụ <span className="text-red-700">*</span>
            </label>
            {errorResponsiblePerson.position && (
              <span className="error-message">
                {errorResponsiblePerson.position}
              </span>
            )}
          </div>

          <div className="form-group-material mb-0">
            <input
              type="text"
              required={true}
              className="form-control"
              value={responsiblePerson.email}
              onChange={(e) => handleInputChange(e, "email")}
            />
            <label>
              Email <span className="text-red-700">*</span>
            </label>
            {errorResponsiblePerson.email && (
              <span className="error-message">
                {errorResponsiblePerson.email}
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
            value={responsiblePerson.other_contact}
            onChange={(e) => handleInputChange(e, "other_contact")}
            placeholder="Zalo/facebook/..."
          />
          <label>Thông tin liên hệ khác</label>
          {errorResponsiblePerson.other_contact && (
            <span className="error-message">{errorResponsiblePerson.other_contact}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondStage;
