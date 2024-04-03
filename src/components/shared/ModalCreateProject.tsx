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
import {
  extractProjectDates,
  generateRandomString,
  removeCommas,
  validateEmail,
} from "@/src/utils/handleFunction";
import { updateUserProfile } from "@/src/redux/features/userSlice";
import {
  getUserFromSessionStorage,
  saveUserToSessionStorage,
} from "@/src/redux/utils/handleUser";
import {
  checkExistResponsiblePersonByEmail,
  createResponsiblePerson,
} from "@/src/redux/features/responsiblePersonSlice";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import { createNewProject } from "@/src/redux/features/projectSlice";
import { useRouter } from "next/navigation";

import "../../../app/(home)/(others)/(routes)/register/style.scss";
import CustomModal from "./CustomModal";
import SpinnerLoading from "../loading/SpinnerLoading";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { checkEmailExist } from "@/src/redux/features/authSlice";

interface ModalProps {
  open: boolean;
  actionClose?: () => void;
  actionConfirm?: () => void;
  buttonClose?: string;
  buttonConfirm?: string;
}

export default function ModalCreateProject({
  open,
  actionClose,
  buttonClose,
  actionConfirm,
  buttonConfirm,
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
    if (userLogin && userLogin.role_name === "Business") {
      setBusinessData((prevData) => ({
        ...prevData,
        fullname: userLogin.fullname || "",
        businessEmail: userLogin.email || "",
        business_sector: userLogin.business_sector || "",
        other_business_sector: "",
        business_description: userLogin.business_description || "",
        address: userLogin.address || "",
        address_detail: userLogin.address_detail || "",
        link_web: userLogin.link_web || "",
      }));

      setResponsiblePerson((prevData) => ({
        ...prevData,
        fullname: userLogin.responsiblePerson.fullname || "",
        position: userLogin.responsiblePerson.position || "",
        email: userLogin.responsiblePerson.email || "",
        phone_number: userLogin.responsiblePerson.phone_number || "",
        other_contact: userLogin.responsiblePerson.other_contact || "",
        businessEmail: userLogin.responsiblePerson.businessEmail || "",
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

  const [selectedJuridicalFiles, setSelectedJuridicalFiles] = useState([]);
  const [juridicalFilesOrigin, setJuridicalFilesOrigin] = useState([]);
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

    console.log("updatedErrorFirstProject", updatedErrorFirstProject);

    console.log("firstProject", firstProject);

    if (hasError) {
      setErrorFirstProject((prevErrorFirstProject) => ({
        ...prevErrorFirstProject,
        ...updatedErrorFirstProject,
      }));
    } else {
      setOpenModalConfirmAction(true);
    }
  };

  // xử lý api
  const handleCallAPIUpdateProfile = async () => {
    setOpenModalConfirmAction(false);
    setIsLoading(true);

    toast("Tiến trình xử lý sẽ hơi lâu, vui lòng chờ trong giây lát!", {
      style: {
        borderRadius: "10px",
        background: "#FFAF45",
        color: "white",
        fontWeight: 500,
      },
    });

    try {
      // XỬ LÝ UPDATE PROFILE
      const dataUpdateProfile = {
        ...businessData,
      };

      const resUpdate = await dispatch(updateUserProfile(dataUpdateProfile));
      console.log("resUpdate", resUpdate);

      if (updateUserProfile.fulfilled.match(resUpdate)) {
        const user = getUserFromSessionStorage();

        if (user) {
          user.role_name = "Business";
          user.fullname = dataUpdateProfile.fullname;
          user.status = true;
          saveUserToSessionStorage(user);
        }
        setLoginInfo(user);
      } else {
        toast.error(`Có lỗi xảy ra ở bước 1!`);
        toast.error(`${resUpdate.payload}`);
        return;
      }

      // XỬ LÝ TẠO NGƯỜI PHỤ TRÁCH
      const resCheckResEmailExist = await dispatch(
        checkExistResponsiblePersonByEmail(responsiblePerson.email)
      );

      console.log("resCheckResEmailExist", resCheckResEmailExist);

      // check nếu tồn tại thì sẽ thêm vào, còn nếu chưa tồn tại thì tạo mới

      if (
        checkExistResponsiblePersonByEmail.fulfilled.match(
          resCheckResEmailExist
        )
      ) {
        if (!resCheckResEmailExist.payload) {
          const resCreateResponsiblePerson = await dispatch(
            createResponsiblePerson({
              ...responsiblePerson,
              businessEmail: resUpdate.payload.email,
            })
          );

          console.log("resCreateResponsiblePerson", resCreateResponsiblePerson);

          if (
            createResponsiblePerson.rejected.match(resCreateResponsiblePerson)
          ) {
            toast.error(`Có lỗi xảy ra ở bước 2!`);
            toast.error(`${resCreateResponsiblePerson.payload}`);
            return;
          }
        } else {
          toast.error(`Người phụ trách này đã tồn tại ở doanh nghiệp khác!`);
          return;
        }
      } else {
        toast.error(`Có lỗi xảy ra ở kiểm tra người phụ trách tồn tại!`);
        toast.error(`${resCheckResEmailExist.payload}`);
        return;
      }

      // XỬ LÝ TẠO PROJECT
      let juridicalFilesURLs: any = [];

      if (juridicalFilesOrigin.length > 0) {
        const uploadPromises: any[] = [];
        const uploadedFiles: any[] = [];

        const juridicalFilesDownload = juridicalFilesOrigin.map((file) => {
          const randomFileName = generateRandomString();
          const storageRef = ref(storage, `khoduan/${randomFileName}`);
          const uploadTask = uploadBytes(storageRef, file);
          uploadPromises.push(uploadTask);
          uploadedFiles.push({ path: `khoduan/${randomFileName}`, file });
          return uploadTask.then(() => getDownloadURL(storageRef));
        });

        await Promise.all(uploadPromises);

        juridicalFilesURLs = await Promise.all(juridicalFilesDownload);
      }

      // FE thì sẽ gọi api check exist email
      //(kiểm tra cái isAdminConfirm nữa để xem tk đó như thế nào rồi
      //thay đổi is_first_project cho phù hợp)

      const resCheckBusinessEmailExist = await dispatch(
        checkEmailExist(businessData?.businessEmail)
      );
      // nếu isConfirmByAdmin mà là true thì tức là đã đăng dự án đầu rồi và đã được duyệt
      // nếu là false thì tức là mới
      console.log(
        "resCheckBusinessEmailExist",
        resCheckBusinessEmailExist.payload
      );

      // if (resCheckBusinessEmailExist.payload.isConfirmByAdmin) {
      //   setFirstProject((prevData) => {
      //       ...prevData,
      //       is_first_project
      //   })
      // }

      const projectTimeline = extractProjectDates(
        firstProject.project_implement_time
      );

      const dataFirstProject = {
        ...firstProject,
        document_related_link: juridicalFilesURLs,
        expected_budget: removeCommas(firstProject.expected_budget as any),
        businessEmail: resUpdate.payload.email,
        email_responsible_person: responsiblePerson.email,
        project_start_date: projectTimeline.project_start_date,
        project_expected_end_date: projectTimeline.project_expected_end_date,
        businessName: businessData.fullname,
      };

      const resCreateProject = await dispatch(
        createNewProject(dataFirstProject)
      );

      console.log("resCreateProject", resCreateProject);

      if (createNewProject.rejected.match(resCreateProject)) {
        toast.error(`Có lỗi xảy ra ở bước 3!`);
        toast.error(`${resCreateProject.payload}`);
        return;
      } else {
        toast.success(
          `Đăng ký tạo tài khoản doanh nghiệp thành công, vui lòng chờ xác minh!`
        );

        if (actionClose) {
          actionClose();
        }
        router.push("/");
      }
    } catch (error) {
      console.error("Error occurred while updating profile:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

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
                          actionConfirm={handleCallAPIUpdateProfile}
                          buttonConfirm={"Xác nhận"}
                          styleWidth={"max-w-xl"}
                          status={"Pending"} //truyền pending để hiện button action
                        />
                      )}

                      {isLoading && <SpinnerLoading />}
                    </div>
                  </div>

                  {/* <div className="mt-4 flex gap-4 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={actionClose}
                      style={{ borderRadius: "10px" }}
                    >
                      {buttonClose}
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={actionConfirm}
                      style={{ borderRadius: "10px" }}
                    >
                      {buttonConfirm}
                    </button>
                  </div> */}
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
