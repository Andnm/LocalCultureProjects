import React, { useState } from "react";

interface FirstStageProps {
  businessData: any;
  setBusinessData: any;
  errorBusinessData: any;
  setErrorBusinessData: any;
}

const FirstStage: React.FC<FirstStageProps> = ({
  businessData,
  setBusinessData,
  errorBusinessData,
  setErrorBusinessData,
}) => {
  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    setErrorBusinessData((prevErrorBusinessData: any) => ({
      ...prevErrorBusinessData,
      [field]: "",
    }));

    if (field === "other_business_sector") {
      value = e.target.value;
      if (value.trim()) {
        setErrorBusinessData((prevErrorBusinessData: any) => ({
          ...prevErrorBusinessData,
          business_sector: "",
        }));
      } else {
        setBusinessData({
          ...businessData,
          other_business_sector: value,
        });
      }
    }

    if (field === "business_sector") {
      value = e.target.value;
      if (value === "Khác") {
        value = "Khác";
        setBusinessData({
          ...businessData,
          [field]: value,
          other_business_sector: "",
        });
        return;
      }
    }

    setBusinessData({
      ...businessData,
      [field]: value,
    });
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessData({
      ...businessData,
      other_business_sector: e.target.value,
    });
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <h4 className="title text-2xl font-medium">
        Bổ sung một số thông tin về doanh nghiệp của bạn
      </h4>
      <p className="sub-title text-smmt-2">
        Đây là các thông tin cần thiết về doanh nghiệp để có thể hoàn thành các
        bước tạo tài khoản{" "}
      </p>

      <div className="stage-3">
        {/* name business */}
        <div className="form-group-material mb-0">
          <input
            type="text"
            required={true}
            className="form-control"
            value={businessData.fullname}
            onChange={(e) => handleInputChange(e, "fullname")}
          />
          <label>
            Tên Doanh nghiệp/Hộ kinh doanh{" "}
            <span className="text-red-700">*</span>
          </label>
          {errorBusinessData.fullname && (
            <span className="error-message">{errorBusinessData.fullname}</span>
          )}
        </div>

        {/*  */}
        <fieldset
          className="border border-gray-300 px-4"
          style={{ borderRadius: "8px" }}
        >
          <legend
            className="text-lg "
            style={{ fontSize: "12px", color: "#6d859f" }}
          >
            Lĩnh vực kinh doanh <span className="text-red-700">*</span>
          </legend>
          <div className="pb-2">
            <div className="flex flex-row justify-between">
              {["Nông nghiệp", "Thủ công nghiệp", "Du lịch", "Khác"].map(
                (option) => (
                  <label
                    key={option}
                    className="inline-flex items-center cursor-pointer"
                    style={{
                      fontSize: "15px",
                      color:
                        businessData.business_sector === option
                          ? "#000"
                          : "#ced4da",
                    }}
                  >
                    <input
                      type="radio"
                      name="business_sector"
                      value={option}
                      checked={businessData.business_sector === option}
                      onChange={(e) => handleInputChange(e, "business_sector")}
                      className="mr-2"
                    />
                    {option}
                  </label>
                )
              )}
            </div>

            {businessData.business_sector === "Khác" && (
              <input
                type="text"
                className="border border-gray-300 rounded p-2 block w-full form-control mb-2 mt-3"
                placeholder="Vui lòng nhập lĩnh vực kinh doanh khác"
                value={
                  businessData.business_sector === "Khác"
                    ? businessData.other_business_sector
                    : ""
                }
                onChange={(e) => handleInputChange(e, "other_business_sector")}
              />
            )}
          </div>
        </fieldset>
        {errorBusinessData.business_sector && (
          <span className="text-sm text-red-600">
            {errorBusinessData.business_sector}
          </span>
        )}

        {/* business description */}
        <div className="form-group-material mt-4">
          <textarea
            rows={3}
            required={true}
            className="form-control"
            spellCheck="false"
            placeholder="Không quá 300 chữ"
            value={businessData.business_description}
            onChange={(e) => handleInputChange(e, "business_description")}
          />
          <label>
            Mô tả ngắn về Doanh nghiệp/Hộ kinh doanh và sản phẩm{" "}
            <span className="text-red-700">*</span>
          </label>
          {errorBusinessData.business_description && (
            <span className="error-message">
              {errorBusinessData.business_description}
            </span>
          )}
        </div>

        {/* address */}
        <div className="form-group-material mt-4">
          <input
            type="text"
            required={true}
            className="form-control"
            value={businessData.address}
            onChange={(e) => handleInputChange(e, "address")}
          />
          <label>
            Địa chỉ <span className="text-red-700">*</span>
          </label>
          {errorBusinessData.address && (
            <span className="error-message">{errorBusinessData.address}</span>
          )}
        </div>

        {/* address detail */}
        {/* TẠM THỜI ẨN ĐI */}
        {/* <div className="form-group-material mt-4">
          <input
            type="text"
            required={true}
            className="form-control"
            value={businessData.address_detail}
            onChange={(e) => handleInputChange(e, "address_detail")}
          />
          <label>
            Địa chỉ cụ thể
            <span className="text-red-700">*</span>
          </label>
          {errorBusinessData.address_detail && (
            <span className="error-message">
              {errorBusinessData.address_detail}
            </span>
          )}
        </div> */}

        {/* link web */}
        <div className="form-group-material mt-4">
          <input
            type="text"
            className="form-control"
            value={businessData.link_web}
            onChange={(e) => handleInputChange(e, "link_web")}
          />
          <label>Website/Fanpage</label>
          {errorBusinessData.link_web && (
            <span className="error-message">{errorBusinessData.link_web}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstStage;
