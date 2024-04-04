import React, { useEffect, useState } from "react";
import FirstStage from "./FirstStage";
import ButtonBack from "@/src/components/shared/ButtonBack";
import { StudentDataType } from "../../_types/student.type";
import CustomModal from "@/src/components/shared/CustomModal";
import { useAppDispatch } from "@/src/redux/store";
import { updateUserProfile } from "@/src/redux/features/userSlice";
import toast from "react-hot-toast";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { useRouter } from "next/navigation";
import {
  getUserFromSessionStorage,
  saveUserToSessionStorage,
} from "@/src/redux/utils/handleUser";
import { useAuthContext } from "@/src/utils/context/auth-provider";
import { useUserLogin } from "@/src/hook/useUserLogin";

interface RegisterStudentFormProps {
  selectedRole: any;
  setSelectedRole: any;
}

const RegisterStudentForm: React.FC<RegisterStudentFormProps> = ({
  selectedRole,
  setSelectedRole,
}) => {
  const [userLogin, setUserLogin] = useUserLogin();

  const [studentData, setStudentData] = useState<StudentDataType>({
    fullname: "",
    phone_number: "",
    roll_number: "",
    description: "",
  });

  const [errorStudentForm, setErrorStudentForm] = useState({
    fullname: "",
    phone_number: "",
    roll_number: "",
    description: "",
  });

  const { loginInfo, setLoginInfo }: any = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [stageEnabled, setStageEnabled] = useState<Record<number, boolean>>({
    1: true,
    2: false,
  });
  const [openModalConfirmAction, setOpenModalConfirmAction] = useState(false);

  const [currentStage, setCurrentStage] = useState(1);

  const handleStageClick = (stage: any) => {
    setCurrentStage(stage);
  };

  const getStageName = (stage: any) => {
    switch (stage) {
      case 1:
        return "Cập nhập thông tin cá nhân";
      default:
        return "";
    }
  };

  const getStageContent = (stage: any) => {
    switch (stage) {
      case 1:
        return (
          <FirstStage
            studentData={studentData}
            setStudentData={setStudentData}
            errorStudentForm={errorStudentForm}
            setErrorStudentForm={setErrorStudentForm}
          />
        );
      default:
        return null;
    }
  };

  const handleOpenModalConfirm = () => {
    let hasError = false;
    const updatedErrorStudentForm: Partial<typeof errorStudentForm> = {};

    Object.keys(studentData).forEach((key) => {
      if (key !== "description" && !studentData[key as keyof StudentDataType]) {
        updatedErrorStudentForm[key as keyof typeof errorStudentForm] =
          "Vui lòng không được để trống!";
        hasError = true;
      }
    });

    if (!/^(0|84)\d{9,10}$/.test(studentData.phone_number)) {
      updatedErrorStudentForm.phone_number = "Số điện thoại không hợp lệ!";
      hasError = true;
    }

    if (!/^ss|se|sa/i.test(studentData.roll_number)) {
      updatedErrorStudentForm.roll_number = "Mã số sinh viên không hợp lệ!";
      hasError = true;
    }

    if (hasError) {
      setErrorStudentForm((prevErrorStudentForm) => ({
        ...prevErrorStudentForm,
        ...updatedErrorStudentForm,
      }));
    } else {
      setOpenModalConfirmAction(true);
    }
  };

  // Xử lý API update profile
  const handleCallAPIUpdateProfile = () => {
    setIsLoading(true);

    const additionalData = { ...studentData };

    const data = {
      role_name: selectedRole,
      ...additionalData,
      roll_number: studentData.roll_number.toUpperCase,
    };

    dispatch(updateUserProfile(data)).then((resUpdate) => {
      console.log("resUpdate", resUpdate);
      if (updateUserProfile.fulfilled.match(resUpdate)) {
        const user = getUserFromSessionStorage();

        if (user) {
          user.role_name = "Student";
          user.fullname = data.fullname;
          user.status = true;
          saveUserToSessionStorage(user);
        }
        setLoginInfo(user);

        toast.success("Đăng kí tạo tài khoản thành công");
        router.push("/");
      } else {
        toast.error(`${resUpdate.payload}`);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (userLogin) {
      setStudentData({
        fullname: userLogin.fullname || "",
        phone_number: "",
        roll_number: "",
        description: "",
      });
    }
  }, [userLogin]);

  return (
    <div className="container py-10">
      <ButtonBack functionBack={() => setSelectedRole("")} />

      <div className="stage-header">
        {[1].map((stageNum) => (
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
        <button
          className="font-semibold btn-continue px-4 py-2"
          onClick={handleOpenModalConfirm}
        >
          Xác nhận
        </button>
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

export default RegisterStudentForm;
