import SecondStage from "@/app/(home)/(others)/(routes)/register/_components/business/SecondStage";
import FirstStage from "@/app/(home)/(others)/(routes)/register/_components/business/FirstStage";
import ThirdStage from "@/app/(home)/(others)/(routes)/register/_components/business/ThirdStage";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import { useAppDispatch } from "@/src/redux/store";
import { useAuthContext } from "@/src/utils/context/auth-provider";
import { BusinessDataType } from "@/app/(home)/(others)/(routes)/register/_types/business.type";
import { ResponsibleType } from "@/app/(home)/(others)/(routes)/register/_types/responsible.type";
import { ProjectType } from "@/app/(home)/(others)/(routes)/register/_types/project.type";
import toast from "react-hot-toast";
import { extractProjectDates, validateEmail } from "@/src/utils/handleFunction";
import {
  checkBusinessInfo,
  checkResponsibleInfo,
} from "@/src/redux/features/userSlice";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import {
  createNewProject,
  createNewProjectWithAuthentication,
  createNewProjectWithoutAuthentication,
} from "@/src/redux/features/projectSlice";
import { useRouter } from "next/navigation";

import "../../../app/(home)/(others)/(routes)/register/style.scss";
import CustomModal from "./CustomModal";
import SpinnerLoading from "../loading/SpinnerLoading";
import { useUserLogin } from "@/src/hook/useUserLogin";
import {
  checkEmailExist,
  createNewBusinessByBusinessName,
  getAllAdmin,
} from "@/src/redux/features/authSlice";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import ModalConfirmUpdateBusiness from "../project/ModalConfirmUpdateBusiness";
import ModalConfirmUpdateResponsible from "../project/ModalConfirmUpdateResponsible";

interface ModalProps {
  open: boolean;
  actionClose?: () => void;
  actionConfirm?: () => void;
  buttonClose?: string;
  buttonConfirm?: string;
  setDataTable?: any;
  setDataTableOrigin?: any;
  dataTable?: any;
  dataTableOrigin?: any;
}

export default function ModalCreateProject({
  open,
  actionClose,
  setDataTable,
  setDataTableOrigin,
  dataTable,
  dataTableOrigin,
}: ModalProps) {
  const closeByClickBackground = () => {
    if (actionClose) {
      actionClose();
    }
  };

  const styleOverlay: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  const [shouldCallCreateProject, setShouldCallCreateProject] =
    useState<boolean>(false);

  const [userLogin, setUserLogin] = useUserLogin();
  // XỬ LÝ STATE CREATE
  // business

  const [businessData, setBusinessData] = useState({
    fullname: userLogin?.fullname,
    business_sector: "",
    other_business_sector: "",
    business_description: "",
    address: "",
    address_detail: "",
    link_web: "",
    businessEmail: "",
  });

  const [errorBusinessData, setErrorBusinessData] = useState({
    fullname: "",
    business_sector: "",
    other_business_sector: "",
    business_description: "",
    address: "",
    address_detail: "",
    link_web: "",
    businessEmail: "",
  });

  const [responsiblePerson, setResponsiblePerson] = useState({
    fullname: "",
    position: "",
    email: "",
    phone_number: "",
    other_contact: "",
    businessEmail: "",
  });

  const [errorResponsiblePerson, setErrorResponsiblePerson] = useState({
    fullname: "",
    position: "",
    email: "",
    phone_number: "",
    other_contact: "",
    businessEmail: "",
  });

  //   Cập nhập giá trị nếu đã login sẵn và có thông tin
  useEffect(() => {
    if (
      userLogin &&
      (userLogin.role_name === "Business" ||
        userLogin.role_name === "ResponsiblePerson")
    ) {
      setBusinessData((prevData) => ({
        ...prevData,
        fullname: userLogin?.fullname || "",
        businessEmail: userLogin?.email || "",
        business_sector: userLogin?.business_sector || "",
        other_business_sector: "",
        business_description: userLogin?.business_description || "",
        address: userLogin?.address || "",
        address_detail: userLogin?.address_detail || "",
        link_web: userLogin?.link_web || "",
      }));

      setResponsiblePerson((prevData) => ({
        ...prevData,
        fullname: userLogin?.responsiblePerson?.fullname || "",
        position: userLogin?.responsiblePerson?.position || "",
        email: userLogin?.responsiblePerson?.email || "",
        phone_number: userLogin?.responsiblePerson?.phone_number || "",
        other_contact: userLogin?.responsiblePerson?.other_contact || "",
        businessEmail: userLogin?.responsiblePerson?.businessEmail || "",
      }));
    } else {
      setBusinessData({
        fullname: "",
        business_sector: "",
        other_business_sector: "",
        business_description: "",
        address: "",
        address_detail: "",
        link_web: "",
        businessEmail: "",
      });

      setResponsiblePerson({
        fullname: "",
        position: "",
        email: "",
        phone_number: "",
        other_contact: "",
        businessEmail: "",
      });
    }
  }, [userLogin]);

  const [firstProject, setFirstProject] = useState({
    name_project: "",
    business_type: "",
    purpose: "",
    target_object: "",
    note: "",
    request: "",
    project_implement_time: "",
    project_start_date: "",
    project_actual_start_date: "",
    is_extent: false,
    project_expected_end_date: "",
    project_actual_end_date: "",
    expected_budget: "",
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

  const [selectedJuridicalFiles, setSelectedJuridicalFiles] = useState([]);
  const [juridicalFilesOrigin, setJuridicalFilesOrigin] = useState<any>([]);
  const [errorFile, setErrorFile] = useState("");

  const [stageEnabled, setStageEnabled] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });

  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalConfirmAction, setOpenModalConfirmAction] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loginInfo, setLoginInfo }: any = useAuthContext();

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
        return "Thông tin chi tiết";
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
            userLogin={userLogin}
          />
        );
      case 2:
        return (
          <SecondStage
            responsiblePerson={responsiblePerson}
            setResponsiblePerson={setResponsiblePerson}
            errorResponsiblePerson={errorResponsiblePerson}
            setErrorResponsiblePerson={setErrorResponsiblePerson}
            userLogin={userLogin}
          />
        );
      case 3:
        return (
          <ThirdStage
            firstProject={firstProject}
            setFirstProject={setFirstProject}
            errorFirstProject={errorFirstProject}
            setErrorFirstProject={setErrorFirstProject}
            selectedJuridicalFiles={selectedJuridicalFiles}
            setSelectedJuridicalFiles={setSelectedJuridicalFiles}
            juridicalFilesOrigin={juridicalFilesOrigin}
            setJuridicalFilesOrigin={setJuridicalFilesOrigin}
            errorFile={errorFile}
            setErrorFile={setErrorFile}
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

        if (!validateEmail(businessData.businessEmail)) {
          updatedErrorBusinessData.businessEmail = "Email không hợp lệ!";
          hasError = true;
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

      // console.log("updatedErrorBusinessData", updatedErrorBusinessData);

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
        if (key !== "other_contact" && key !== "businessEmail") {
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
        key !== "project_actual_end_date" &&
        key !== "is_extent"
      ) {
        if (!firstProject[key as keyof ProjectType]) {
          updatedErrorFirstProject[key as keyof typeof errorFirstProject] =
            "Vui lòng không được để trống!";
          hasError = true;
        }
      }
    });

    if (hasError) {
      setErrorFirstProject((prevErrorFirstProject) => ({
        ...prevErrorFirstProject,
        ...updatedErrorFirstProject,
      }));
    } else {
      setOpenModalConfirmAction(true);
    }
  };

  // xử lý thay đổi info
  const [
    openModalConfirmChangeBusinessInfo,
    setOpenModalConfirmChangeBusinessInfo,
  ] = useState<boolean>(false);

  const [
    openModalConfirmChangeResponsibleInfo,
    setOpenModalConfirmChangeResponsibleInfo,
  ] = useState<boolean>(false);

  const [isChangeBusinessInfo, setIsChangeBusinessInfo] =
    useState<boolean>(false);

  const [isChangeResponsibleInfo, setIsChangeResponsibleInfo] =
    useState<boolean>(false);

  //lưu response của check business hoặc responsible
  const [resultData, setResultData] = useState<any>(null);

  const [resultCase, setResultCase] = useState<number>(0);

  // xử lý api
  // luồng đi
  // đầu tiên gọi api để check business -> gọi api check responsible
  // lưu kết quả làm 5 trường hợp vào state result case số thứ tự 1 2 3 4 5
  // 1. res check business mà [] và res check responsible mà [] -> tự gọi api create project
  // 2. res check business mà [] -> res check responsible mà khác [] -> open modal confirm update responsible -> truyền handle api create project vào button update ở modal responsible
  // 3. res check business mà khác [] -> res check responsible mà [] -> open modal confirm update business -> truyền handle api create project vào button update ở modal business
  // 4. res check business mà khác [] -> res check responsible mà khác [] ->  open modal confirm update business ->
  //-> open modal confirm update responsible -> truyền handle api create project vào button update ở modal responsible
  // 5. có lỗi xảy
  //=> chốt là thay vì truyền api trực tiếp sẽ chỉ set state là should call api create
  // bắt useEffect cái state đó và gọi hàm create

  const handleProcessConfirmCreateProject = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenModalConfirmAction(false);
    // showToastsError

    //nếu không login thì gọi hàm create ngay không cần thông qua bước check
    if (userLogin?.role_name === null || userLogin?.role_name === undefined) {
      setShouldCallCreateProject(true);
      return;
    }

    const businessInfo = {
      businessName: businessData.fullname ?? "",
      businessEmail: businessData.businessEmail,
      business_description: businessData.business_description,
      business_sector: businessData.business_sector,
      address: businessData.address,
      address_detail: businessData.address_detail,
    };

    const responsiblePersonInfo = {
      fullname: responsiblePerson.fullname,
      phone_number: responsiblePerson.phone_number,
      position: responsiblePerson.position,
      email_responsible_person: responsiblePerson.email,
    };

    try {
      setIsLoading(true);

      const businessResponseCheck = await dispatch(
        checkBusinessInfo(businessInfo)
      ).unwrap();

      const responsibleResponseCheck = await dispatch(
        checkResponsibleInfo(responsiblePersonInfo)
      ).unwrap();

      setResultData({
        business: businessResponseCheck,
        responsible: responsibleResponseCheck,
      });

      switch (true) {
        case businessResponseCheck.length === 0 &&
          responsibleResponseCheck.length === 0:
          setResultCase(1);
          setShouldCallCreateProject(true);
          break;
        case businessResponseCheck.length === 0 &&
          responsibleResponseCheck.length > 0:
          setResultCase(2);
          setOpenModalConfirmChangeResponsibleInfo(true);
          break;
        case businessResponseCheck.length > 0 &&
          responsibleResponseCheck.length === 0:
          setResultCase(3);
          setOpenModalConfirmChangeBusinessInfo(true);
          break;
        case businessResponseCheck.length > 0 &&
          responsibleResponseCheck.length > 0:
          setResultCase(4);
          setOpenModalConfirmChangeResponsibleInfo(true);
          setOpenModalConfirmChangeBusinessInfo(true);
          break;
        default:
          setResultCase(5);
          break;
      }
    } catch (error) {
      // console.log("error check: ", error);
      setResultCase(5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallApiToCreateProject = async () => {
    setIsLoading(true);

    toast("Tiến trình xử lý sẽ hơi lâu, vui lòng chờ trong giây lát!", {
      style: {
        borderRadius: "10px",
        background: "#FFAF45",
        color: "white",
        fontWeight: 500,
      },
    });

    let createProjectActionAPI;
    if (userLogin?.role_name === null || userLogin?.role_name === undefined) {
      createProjectActionAPI = createNewProjectWithoutAuthentication;
    } else {
      createProjectActionAPI = createNewProjectWithAuthentication;
    }

    try {
      const dataIsCreatedByAdmin = userLogin && userLogin.role_name === "Admin";

      let juridicalFilesURLs = [];

      if (juridicalFilesOrigin.length > 0) {
        const uploadPromises: any[] = [];
        const uploadedFiles = [];

        const juridicalFilesDownload = juridicalFilesOrigin.map((file: any) => {
          const randomFileName = juridicalFilesOrigin[0]?.name;
          const storageRef = ref(storage, `khoduan/${randomFileName}`);
          const uploadTask = uploadBytes(storageRef, file);
          uploadPromises.push(uploadTask);
          uploadedFiles.push({ path: `khoduan/${randomFileName}`, file });
          return uploadTask.then(() => getDownloadURL(storageRef));
        });

        await Promise.all(uploadPromises);
        juridicalFilesURLs = await Promise.all(juridicalFilesDownload);
      }

      //kiểm tra business đã tồn tại chưa để lấy first project
      const resCheckBusinessEmailExist = await dispatch(
        checkEmailExist(businessData?.businessEmail)
      );

      const dataIsFirstProject =
        resCheckBusinessEmailExist.payload &&
        resCheckBusinessEmailExist.payload.isConfirmByAdmin !== null &&
        resCheckBusinessEmailExist.payload.isConfirmByAdmin !== undefined
          ? !resCheckBusinessEmailExist.payload.isConfirmByAdmin
          : false;

      const projectTimeline = extractProjectDates(
        firstProject.project_implement_time
      );

      const dataBody = {
        is_created_by_admin: dataIsCreatedByAdmin,
        ...businessData,
        ...responsiblePerson,
        ...firstProject,
        businessName: businessData.fullname,
        businessEmail: businessData.businessEmail,
        email_responsible_person: responsiblePerson.email,
        is_change_business_info: isChangeBusinessInfo,
        is_change_responsible_info: isChangeResponsibleInfo,
        document_related_link: juridicalFilesURLs,
        project_start_date: projectTimeline.project_start_date,
        project_expected_end_date: projectTimeline.project_expected_end_date,
        is_first_project: dataIsFirstProject,
      };

      const resCreateProject = await dispatch(createProjectActionAPI(dataBody));

      if (createProjectActionAPI.rejected.match(resCreateProject)) {
        toast.error(`${resCreateProject.payload}`);
        return;
      } else {
        try {
          const resGetAllAdmin = await dispatch(getAllAdmin());

          await Promise.all(
            resGetAllAdmin.payload.map(async (email: any) => {
              const dataBodyNoti = {
                notification_type: dataIsFirstProject
                  ? NOTIFICATION_TYPE.REQUEST_CONFIRM_FIRST_PROJECT_TO_ADMIN
                  : NOTIFICATION_TYPE.CREATE_PROJECT,
                information: dataIsFirstProject
                  ? "Có một dự án lần đầu đăng đang cần được phê duyệt!"
                  : "Có một dự án mới cần được duyệt",
                sender_email: businessData.businessEmail,
                receiver_email: email,
              };

              const resNoti = await dispatch(
                createNewNotification(dataBodyNoti)
              );
              console.log(resNoti);
            })
          );

          toast.success(
            `Đăng dự án thành công thành công, vui lòng chờ xác minh!`
          );

          if (setDataTable) {
            if (dataTable) {
              setDataTable([resCreateProject.payload, ...dataTable]);
            }
          }

          if (setDataTableOrigin) {
            if (dataTableOrigin) {
              setDataTable([resCreateProject.payload, ...dataTableOrigin]);
            }
          }

          if (actionClose) {
            actionClose();
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      // console.log("error create project: ", error);
    } finally {
      setShouldCallCreateProject(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldCallCreateProject) {
      handleCallApiToCreateProject();
    }
  }, [shouldCallCreateProject]);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeByClickBackground}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 blur-sm opacity-20" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center relative z-50">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`relative z-40 w-full 
                   max-w-full
                   transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-end"
                  >
                    <X className="cursor-pointer" onClick={actionClose} />
                  </Dialog.Title>

                  <div className="mt-2">
                    <div className="container">
                      <div className="stage-header">
                        {[1, 2, 3].map((stageNum) => (
                          <button
                            key={stageNum}
                            className={`stage btn ${
                              stageEnabled[stageNum] ? "" : "disabled"
                            } ${currentStage === stageNum ? "active" : ""}`}
                            onClick={() => handleStageClick(stageNum)}
                          >
                            {stageNum}. {getStageName(stageNum)}
                          </button>
                        ))}
                      </div>

                      <div className="container py-4">
                        {getStageContent(currentStage)}
                      </div>

                      <div
                        className="flex justify-end gap-5"
                        style={{ marginRight: "50px" }}
                      >
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
                          title={
                            <h2 className="text-2xl font-semibold">
                              Xác nhận tạo
                            </h2>
                          }
                          body={
                            "Bạn có chắc muốn đăng ký tạo tài khoản với những thông tin mà bạn đã điền hay không?"
                          }
                          actionClose={() => setOpenModalConfirmAction(false)}
                          buttonClose={"Hủy"}
                          actionConfirm={handleProcessConfirmCreateProject}
                          buttonConfirm={"Xác nhận"}
                          styleWidth={"max-w-xl"}
                          status={"Pending"} //truyền pending để hiện button action
                        />
                      )}

                      {openModalConfirmChangeResponsibleInfo && (
                        <ModalConfirmUpdateResponsible
                          open={openModalConfirmChangeResponsibleInfo}
                          onClose={() => {
                            setOpenModalConfirmChangeResponsibleInfo(false);
                          }}
                          data={resultData?.responsible}
                          resultCase={resultCase}
                          setIsChangeResponsibleInfo={
                            setIsChangeResponsibleInfo
                          }
                          setShouldCallCreateProject={
                            setShouldCallCreateProject
                          }
                        />
                      )}

                      {openModalConfirmChangeBusinessInfo && (
                        <ModalConfirmUpdateBusiness
                          open={openModalConfirmChangeBusinessInfo}
                          onClose={() => {
                            setOpenModalConfirmChangeBusinessInfo(false);
                          }}
                          data={resultData?.business}
                          resultCase={resultCase}
                          setIsChangeBusinessInfo={setIsChangeBusinessInfo}
                          setShouldCallCreateProject={
                            setShouldCallCreateProject
                          }
                        />
                      )}

                      {isLoading && <SpinnerLoading />}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="overlay" style={styleOverlay}></div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
