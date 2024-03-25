import React, { useState } from "react";
import FirstStage from "./FirstStage";
import SecondStage from "./SecondStage";
import ThirdStage from "./ThirdStage";
import ButtonBack from "@/src/components/shared/ButtonBack";
import { BusinessDataType } from "../../_types/business.type";
import { ResponsibleType } from "../../_types/responsible.type";
import { validateEmail } from "@/src/utils/handleFunction";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import CustomModal from "@/src/components/shared/CustomModal";
import { ProjectType } from "../../_types/project.type";

interface RegisterBusinessFormProps {
  selectedRole: any;
  setSelectedRole: any;
}

const RegisterBusinessForm: React.FC<RegisterBusinessFormProps> = ({
  selectedRole,
  setSelectedRole,
}) => {
  // business
  const [businessData, setBusinessData] = useState({
    fullname: "",
    business_sector: "",
    other_business_sector: "",
    business_description: "",
    address: "",
    // address_detail: "",
    link_web: "",
  });

  const [errorBusinessData, setErrorBusinessData] = useState({
    fullname: "",
    business_sector: "",
    other_business_sector: "",
    business_description: "",
    address: "",
    // address_detail: "",
    link_web: "",
  });

  const [responsiblePerson, setResponsiblePerson] = useState({
    fullname: "",
    position: "",
    email: "",
    phone_number: "",
    zalo: "",
    facebook: "",
    businessEmail: "",
  });

  const [errorResponsiblePerson, setErrorResponsiblePerson] = useState({
    fullname: "",
    position: "",
    email: "",
    phone_number: "",
    zalo: "",
    facebook: "",
    businessEmail: "",
  });

  const [firstProject, setFirstProject] = useState({
    name_project: "",
    business_type: "",
    purpose: "",
    target_object: "",
    note: "",
    document_related_link: "",
    request: "",
    project_implement_time: "",
    project_start_date: "",
    project_actual_start_date: "",
    is_extent: false,
    project_expected_end_date: "",
    project_actual_end_date: "",
    expected_budget: 0,
    is_first_project: true,
  });

  const [errorFirstProject, setErrorFirstProject] = useState({
    name_project: "",
    business_type: "",
    purpose: "",
    target_object: "",
    note: "",
    document_related_link: "",
    request: "",
    project_implement_time: "",
    project_start_date: "",
    project_actual_start_date: "",
    is_extent: "",
    project_expected_end_date: "",
    project_actual_end_date: "",
    expected_budget: "",
    is_first_project: "",
  });

  const [stageEnabled, setStageEnabled] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalConfirmAction, setOpenModalConfirmAction] = useState(false);

  const handleStageClick = (stage: any) => {
    setCurrentStage(stage);
  };

  const getStageName = (stage: any) => {
    switch (stage) {
      case 1:
        return "Thông tin doanh nghiệp";
      case 2:
        return "Thông tin người phụ trách";
      case 3:
        return "Đăng dự án lần đầu";
      default:
        return "";
    }
  };

  const getStageContent = (stage: any) => {
    switch (stage) {
      case 1:
        return (
          <FirstStage
            businessData={businessData}
            setBusinessData={setBusinessData}
            errorBusinessData={errorBusinessData}
            setErrorBusinessData={setErrorBusinessData}
          />
        );
      case 2:
        return (
          <SecondStage
            responsiblePerson={responsiblePerson}
            setResponsiblePerson={setResponsiblePerson}
            errorResponsiblePerson={errorResponsiblePerson}
            setErrorResponsiblePerson={setErrorResponsiblePerson}
          />
        );
      case 3:
        return (
          <ThirdStage
            firstProject={firstProject}
            setFirstProject={setFirstProject}
            errorFirstProject={errorFirstProject}
            setErrorFirstProject={setErrorFirstProject}
          />
        );
      default:
        return null;
    }
  };

  const handleBackStage = () => {
    setCurrentStage(currentStage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueStage = () => {
    //check thông tin

    if (currentStage === 1) {
      let hasError = false;
      const updatedErrorBusinessData: Partial<typeof errorBusinessData> = {};

      Object.keys(businessData).forEach((key) => {
        if (key !== "other_business_sector" && key !== "link_web") {
          if (!businessData[key as keyof BusinessDataType]) {
            updatedErrorBusinessData[key as keyof typeof errorBusinessData] =
              "Vui lòng không được để trống!";
            hasError = true;
          }
        }

        if (
          key === "business_sector" &&
          businessData[key as keyof BusinessDataType] === "Khác" &&
          !businessData["other_business_sector"]
        ) {
          updatedErrorBusinessData["business_sector"] =
            "Vui lòng không để trống!";
          hasError = true;
        } else if (
          key === "other_business_sector" &&
          !businessData["other_business_sector"]
        ) {
          delete updatedErrorBusinessData["other_business_sector"];
        }
      });

      console.log("updatedErrorBusinessData", updatedErrorBusinessData);

      if (hasError) {
        setErrorBusinessData((prevErrorBusinessData) => ({
          ...prevErrorBusinessData,
          ...updatedErrorBusinessData,
        }));
      } else {
        setStageEnabled((prevState) => ({
          ...prevState,
          [currentStage + 1]: true,
        }));

        setCurrentStage(currentStage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (currentStage === 2) {
      let hasError = false;
      const updatedErrorResponsiblePerson: Partial<
        typeof errorResponsiblePerson
      > = {};

      Object.keys(responsiblePerson).forEach((key) => {
        if (key !== "zalo" && key !== "facebook" && key !== "businessEmail") {
          if (!responsiblePerson[key as keyof ResponsibleType]) {
            updatedErrorResponsiblePerson[
              key as keyof typeof errorResponsiblePerson
            ] = "Vui lòng không được để trống!";
            hasError = true;
          }
        }
      });

      if (!/^(0|84)\d{9,10}$/.test(responsiblePerson.phone_number)) {
        updatedErrorResponsiblePerson.phone_number =
          "Số điện thoại không hợp lệ!";
        hasError = true;
      }

      if (!validateEmail(responsiblePerson.email)) {
        updatedErrorResponsiblePerson.email = "Email không hợp lệ!";
        hasError = true;
      }

      console.log(
        "updatedErrorResponsiblePerson",
        updatedErrorResponsiblePerson
      );

      if (hasError) {
        setErrorResponsiblePerson((prevErrorBusinessData) => ({
          ...prevErrorBusinessData,
          ...updatedErrorResponsiblePerson,
        }));
      } else {
        setStageEnabled((prevState) => ({
          ...prevState,
          [currentStage + 1]: true,
        }));

        setCurrentStage(currentStage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleOpenModalConfirm = () => {
    let hasError = false;
    const updatedErrorFirstProject: Partial<typeof errorFirstProject> = {};

    Object.keys(firstProject).forEach((key) => {
      if (
        key !== "note" &&
        key !== "document_related_link" &&
        key !== "project_start_date" &&
        key !== "project_actual_start_date" &&
        key !== "project_expected_end_date" &&
        key !== "project_actual_end_date"
      ) {
        if (!firstProject[key as keyof ProjectType]) {
          updatedErrorFirstProject[key as keyof typeof errorFirstProject] =
            "Vui lòng không được để trống!";
          hasError = true;
        }
      }
    });

    console.log("updatedErrorFirstProject", updatedErrorFirstProject);

    if (hasError) {
      setErrorBusinessData((prevErrorBusinessData) => ({
        ...prevErrorBusinessData,
        ...updatedErrorFirstProject,
      }));
    } else {
      setOpenModalConfirmAction(true);
    }
  };

  // xử lý API
  const handleCallAPIUpdateProfile = () => {
    setIsLoading(true);

    // const additionalData = { ...studentData };

    // const data = {
    //   role_name: selectedRole,
    //   ...additionalData,
    //   roll_number: studentData.roll_number.toUpperCase,
    // };

    // dispatch(updateUserProfile(data)).then((resUpdate) => {
    //   console.log("resUpdate", resUpdate);
    //   if (updateUserProfile.fulfilled.match(resUpdate)) {
    //     const user = getUserFromSessionStorage();

    //     if (user) {
    //       user.role_name = "Student";
    //       user.fullname = data.fullname;
    //       user.status = true;
    //       saveUserToSessionStorage(user);
    //     }
    //     setLoginInfo(user);

    //     toast.success("Đăng kí tạo tài khoản thành công");
    //     router.push("/");
    //   } else {
    //     toast.error(`${resUpdate.payload}`);
    //   }
    //   setIsLoading(false);
    // });
  };

  return (
    <div className="container py-10">
      <ButtonBack functionBack={() => setSelectedRole("")} />

      <div className="stage-header">
        {[1, 2, 3].map((stageNum) => (
          <button
            key={stageNum}
            className={`stage btn ${stageEnabled[stageNum] ? "" : "disabled"} ${
              currentStage === stageNum ? "active" : ""
            }`}
            onClick={() => handleStageClick(stageNum)}
          >
            {stageNum}. {getStageName(stageNum)}
          </button>
        ))}
      </div>

      <div className="container py-4">{getStageContent(currentStage)}</div>

      <div className="flex justify-end gap-5" style={{ marginRight: "50px" }}>
        {currentStage > 1 && (
          <button
            className="font-semibold btn-cancel px-4 py-2"
            onClick={handleBackStage}
          >
            Quay lại
          </button>
        )}

        {currentStage < 3 && (
          <button
            className="font-semibold btn-continue px-4 py-2"
            onClick={handleContinueStage}
          >
            Tiếp tục
          </button>
        )}

        {currentStage === 3 && (
          <button
            className="font-semibold btn-continue px-4 py-2"
            onClick={handleOpenModalConfirm}
          >
            Xác nhận
          </button>
        )}
      </div>

      {openModalConfirmAction && (
        <CustomModal
          open={openModalConfirmAction}
          title={<h2 className="text-2xl font-semibold">Xác nhận tạo</h2>}
          body={
            "Bạn có chắc muốn tạo tài khoản với những thông tin mà bạn đã điền hay không?"
          }
          actionClose={() => setOpenModalConfirmAction(false)}
          buttonClose={"Hủy"}
          actionConfirm={handleCallAPIUpdateProfile}
          buttonConfirm={"Xác nhận"}
          styleWidth={"max-w-xl"}
          status={"Pending"} //truyền pending để hiện button action
        />
      )}

      {isLoading && <SpinnerLoading />}
    </div>
  );
};

export default RegisterBusinessForm;
