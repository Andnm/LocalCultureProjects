import { useAppDispatch } from "@/src/redux/store";
import { generateFallbackAvatar } from "@/src/utils/handleFunction";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { searchResponsibleByEmail } from "@/src/redux/features/userSlice";

interface SecondStageProps {
  responsiblePerson: any;
  setResponsiblePerson: any;
  errorResponsiblePerson: any;
  setErrorResponsiblePerson: any;
  userLogin?: any;
}

const SecondStage: React.FC<SecondStageProps> = ({
  responsiblePerson,
  setResponsiblePerson,
  errorResponsiblePerson,
  setErrorResponsiblePerson,
  userLogin,
}) => {
  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    //xử lý search field
    if (field === "email" && value && userLogin?.role_name === "Admin") {
      // console.log("come");
      setErrorResponsiblePerson((prevErrorResponsiblePerson: any) => ({
        ...prevErrorResponsiblePerson,
        email: "",
      }));
      setLoadingSearchResult(true);
      setValueSearch(e.target.value);

      dispatch(searchResponsibleByEmail(e.target.value)).then((result) => {
        if (searchResponsibleByEmail.fulfilled.match(result)) {
          setAccountResultSearch(result.payload);
          setLoadingSearchResult(false);
        } else {
          console.log("error: ", result.payload);
        }
      });
    }

    setErrorResponsiblePerson((prevErrorResponsiblePerson: any) => ({
      ...prevErrorResponsiblePerson,
      [field]: "",
    }));

    if (field === "phone_number") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setResponsiblePerson({
      ...responsiblePerson,
      [field]: value,
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
    setResponsiblePerson({
      ...responsiblePerson,
      fullname: selectedAccount.fullname || '',
      position: selectedAccount.position || '',
      phone_number: selectedAccount.phone_number || '',
      other_contact: selectedAccount.other_contact || '',
      email: selectedAccount.email || ''
    });
    setValueSearch("");
    setAccountResultSearch([]);
  };

  return (
    <div className="stage-container flex flex-col justify-center items-center">
      <h4 className="title text-2xl font-medium">
        Bổ sung thông tin của người phụ trách dự án
      </h4>
      <p className="sub-title text-smmt-2">
        Đây là các thông tin cần thiết về doanh nghiệp để có thể hoàn thành các
        bước đăng dự án
      </p>

      <div className="stage-3">
        <div className="container-input">
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

            {valueSearch && (
              <div className="absolute z-50 w-[505px] bg-white max-h-96 overflow-y-scroll shadow-lg border flex justify-start flex-col">
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
            <span className="error-message">
              {errorResponsiblePerson.other_contact}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondStage;
