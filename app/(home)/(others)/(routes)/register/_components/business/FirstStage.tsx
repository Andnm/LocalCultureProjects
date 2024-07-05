import SelectedProvince from "@/src/components/shared/SelectedProvince";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateFallbackAvatar } from "@/src/utils/handleFunction";
import { useAppDispatch } from "@/src/redux/store";
import { searchUserForAdmin } from "@/src/redux/features/userSlice";

interface FirstStageProps {
  businessData: any;
  setBusinessData: any;
  errorBusinessData: any;
  setErrorBusinessData: any;
  userLogin?: any;
}

const FirstStage: React.FC<FirstStageProps> = ({
  businessData,
  setBusinessData,
  errorBusinessData,
  setErrorBusinessData,
  userLogin,
}) => {
  const parseAddress = (address: string) => {
    const parts = address?.split(",").map((part) => part.trim());
    const wardOriginData = parts[0]?.replace(/^Xã\s*/, "");
    const districtOriginData = parts[1]?.replace(/^Huyện\s*/, "");
    const provinceOriginData = parts[2]?.replace(/^Thành phố\s*/, "");
    return { wardOriginData, districtOriginData, provinceOriginData };
  };

  const { wardOriginData, districtOriginData, provinceOriginData } =
    parseAddress(businessData?.address || "");

  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    //xử lý search field
    if (
      field === "businessEmail" &&
      e.target.value &&
      userLogin?.role_name === "Admin"
    ) {
      setErrorBusinessData((prevErrorBusinessData: any) => ({
        ...prevErrorBusinessData,
        businessEmail: "",
      }));
      setLoadingSearchResult(true);
      setValueSearch(e.target.value);

      dispatch(
        searchUserForAdmin({
          roleName: "Business",
          searchEmail: e.target.value,
        })
      ).then((result) => {
        if (searchUserForAdmin.fulfilled.match(result)) {
          setAccountResultSearch(result.payload);
          setLoadingSearchResult(false);
        } else {
          console.log("error: ", result.payload);
        }
      });
    }

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

  //xử lý chọn email doanh nghiệp
  const [valueSearch, setValueSearch] = React.useState<string>(""); // cái này để lưu giá trị ban đầu nhập vào thực hiện cho loading effect
  const [loadingSearchResult, setLoadingSearchResult] = React.useState(false);
  const [accountResultSearch, setAccountResultSearch] = React.useState<any[]>(
    []
  );

  const dispatch = useAppDispatch();

  const handleClickSelectAccount = (selectedAccount: any) => {
    setBusinessData({
      ...businessData,
      fullname: selectedAccount.fullname || "",
      businessEmail: selectedAccount.email,
      business_sector: selectedAccount.business_sector || "",
      address: selectedAccount.address || "",
      address_detail: selectedAccount.address_detail || "",
      business_description: selectedAccount.business_description || "",
      link_web: selectedAccount.link_web || "",
    });
    setValueSearch("");
    setAccountResultSearch([]);
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <h4 className="title text-2xl font-medium">
        Bổ sung một số thông tin về doanh nghiệp của bạn
      </h4>
      <p className="sub-title text-smmt-2">
        Đây là các thông tin cần thiết về doanh nghiệp để có thể hoàn thành các
        bước đăng dự án
      </p>

      <div className="stage-3">
        {/* Địa chỉ email Doanh nghiệp, có thể có hoặc ko tùy vào data đầu vào tồn tại hay ko */}

        {businessData?.businessEmail !== undefined && (
          <div className="form-group-material mb-0 relative">
            <input
              type="text"
              required={true}
              className="form-control"
              value={businessData.businessEmail}
              onChange={(e) => handleInputChange(e, "businessEmail")}
            />
            <label>
              Địa chỉ email <span className="text-red-700">*</span>
            </label>
            {errorBusinessData.businessEmail && (
              <span className="error-message">
                {errorBusinessData.businessEmail}
              </span>
            )}

            {valueSearch && (
              <div className="absolute z-50 w-full bg-white max-h-96 overflow-y-scroll shadow-lg border flex justify-start flex-col">
                {loadingSearchResult ? (
                  <div className="flex items-center gap-3 px-2 py-2 text-gray-500 text-sm">
                    <Skeleton className="w-10 h-10 object-cover rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-60 h-5" />
                      <Skeleton className="w-60 h-5" />
                    </div>
                  </div>
                ) : accountResultSearch &&
                  Array.isArray(accountResultSearch) &&
                  accountResultSearch.length > 0 ? (
                  accountResultSearch?.map((result, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer hover:bg-gray-200 px-2 py-2 items-center gap-3 transition-all duration-300 ease-in-out"
                      onClick={() => handleClickSelectAccount(result)}
                    >
                      <img
                        src={
                          result.avatar_url ||
                          generateFallbackAvatar(result.fullname)
                        }
                        alt={result.fullname}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="font-normal text-sm">{result.fullname}</p>
                        <p className="font-normal opacity-70 text-sm">
                          {result.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-2 text-gray-500 text-sm">
                    Không tìm thấy người phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* name business */}
        <div className="form-group-material mt-4 ">
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
        {/*  
        - kiểm tra !userLogin để xem liệu userLogin có tồn tại không. Nếu không, 
        hoặc là null hoặc là undefined, thì hiển thị <SelectedProvince />.  
        
        - userLogin tồn tại, kiểm tra xem userLogin.role_name có khác "Business" không. 
        Nếu không phải "Business", thì cũng hiển thị <SelectedProvince />.

        - Nếu userLogin.role_name là "Business", kiểm tra xem userLogin.address có tồn 
        tại hoặc bằng null không. Nếu không tồn tại hoặc bằng null, thì cũng hiển thị 
        <SelectedProvince />.  
       */}

        {!userLogin ||
        userLogin?.role_name !== "Business" ||
        userLogin?.address ? (
          <SelectedProvince
            businessData={businessData}
            setBusinessData={setBusinessData}
            errorBusinessData={errorBusinessData}
            setErrorBusinessData={setErrorBusinessData}
            wardOriginData={wardOriginData}
            districtOriginData={districtOriginData}
            provinceOriginData={provinceOriginData}
          />
        ) : (
          <div className="form-group-material mt-4">
            <input
              type="text"
              required={true}
              className="form-control"
              value={businessData.address}
              readOnly
            />
            <label>
              Địa chỉ
              <span className="text-red-700">*</span>
            </label>
          </div>
        )}

        {/* address detail */}
        <div className="form-group-material mt-4">
          <input
            type="text"
            required={true}
            className="form-control"
            value={businessData.address_detail}
            onChange={(e) => handleInputChange(e, "address_detail")}
            placeholder="Số nhà, đường (Không bao gồm những thông tin đã chọn ở trên)"
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
        </div>

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
