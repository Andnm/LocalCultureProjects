"use client";

import Footer from "@/src/components/landing/Footer";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { CHOOSE_LIST_ROLE } from "@/src/constants/register";
import OtpRegister from "@/src/components/auth/OtpRegister";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useAppDispatch } from "@/src/redux/store";
import {
  login,
  sendOtpRegister,
  verifyOtp,
} from "@/src/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/utils/context/auth-provider";
import AdminSpinnerLoading from "@/src/components/loading/AdminSpinnerLoading";
import RegisterStudentForm from "./_components/student/RegisterStudentForm";
import RegisterBusinessForm from "./_components/business/RegisterBusinessForm";
import { updateUserProfile } from "@/src/redux/features/userSlice";
import toast from "react-hot-toast";
import { StudentDataType } from "./_types/student.type";
import CustomModal from "@/src/components/shared/CustomModal";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { getUserFromSessionStorage, saveUserToSessionStorage } from "@/src/redux/utils/handleUser";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [userLogin, setUserLogin] = useUserLogin();
  const [selectedRole, setSelectedRole] = useState("");
  const [openOtpForm, setOpenOtpForm] = useState<boolean | undefined>();
  const [errorOtp, setErrorOtp] = React.useState("");
  const [loadingUI, setLoadingUI] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const { loginInfo, setLoginInfo }: any = useAuthContext();
  const inputsOtpRef: React.RefObject<HTMLInputElement[]> = React.useRef([]);

  const handleSelectedRole = (value: any) => {
    setSelectedRole(value);
  };

  const confirmOTP = async () => {
    setLoadingData(true);
    const otp = [
      inputsOtpRef.current![0].value,
      ...inputsOtpRef.current!.slice(1).map((input) => input.value),
    ].join("");

    const data = {
      otp: parseInt(otp, 10),
      email: userLogin?.email,
    };

    console.log("data", data);
    // setOpenOtpForm(false);

    dispatch(verifyOtp(data)).then((resOtp) => {
      console.log("result", resOtp.payload);
      if (verifyOtp.rejected.match(resOtp)) {
        setErrorOtp(resOtp.payload as string);
      } else if (verifyOtp.fulfilled.match(resOtp)) {
        const user = getUserFromSessionStorage();

        if (user) {
          user.status = true;
          saveUserToSessionStorage(user);
        }
        setOpenOtpForm(false);
      }

      setLoadingData(false);
    });
  };

  const resendOTP = () => {
    setErrorOtp("");
    setLoadingData(true);
    dispatch(sendOtpRegister({ email: userLogin?.email })).then(
      (resSendOtp: any) => {
        console.log("resSendOtp", resSendOtp.payload);

        if (sendOtpRegister.rejected.match(resSendOtp)) {
          //do something
          toast.error(`${resSendOtp.payload}`);
        } else if (sendOtpRegister.fulfilled.match(resSendOtp)) {
          toast.success("OTP đã được gửi lại, vui lòng kiểm tra!");
        }
        setLoadingData(false);
      }
    );
  };

  useEffect(() => {
    if (openOtpForm === undefined) {
      setLoadingUI(true);
    } else {
      setLoadingUI(false);
    }
  }, [openOtpForm]);

  //   xử lý nếu đứa đăng nhập status là false thì sẽ gửi otp
  useEffect(() => {
    setOpenOtpForm(!userLogin?.status);

    if (userLogin?.status === false) {
      dispatch(sendOtpRegister({ email: userLogin.email })).then(
        (resSendOtp: any) => {
          if (sendOtpRegister.rejected.match(resSendOtp)) {
            //do something
            // console.log("resSendOtp", resSendOtp);
          } else if (sendOtpRegister.fulfilled.match(resSendOtp)) {
            console.log("resSendOtp", resSendOtp.payload);
            setOpenOtpForm(true);
          }
        }
      );
    }
  }, [userLogin]);

  return (
    <>
      {loadingUI ? (
        <AdminSpinnerLoading />
      ) : !openOtpForm ? (
        selectedRole === "" ? (
          <div className="choose-role-background">
            <div className="choose-role-container">
              <h4 className="text-xl font-semibold">
                Bạn sử dụng trang với vai trò?
              </h4>

              <div className="list-role">
                {CHOOSE_LIST_ROLE.map((item, index) => (
                  <div
                    className="card-item"
                    key={index}
                    onClick={() => handleSelectedRole(item.value)}
                  >
                    <div className="card-item-image">
                      <img src={item.img} alt="img" />
                    </div>

                    <h6 className="card-item-role-name text-lg font-medium">
                      {item.roleName}
                    </h6>
                    <p className="card-item-description text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedRole === "Student" ? (
          <RegisterStudentForm
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        ) : (
          <RegisterBusinessForm
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        )
      ) : (
        <OtpRegister
          email={userLogin?.email}
          verifyAction={confirmOTP}
          inputsRef={inputsOtpRef}
          error={errorOtp}
          setError={() => setErrorOtp("")}
          resendOtp={resendOTP}
        />
      )}

      {loadingData && <SpinnerLoading />}

      <Footer />
    </>
  );
};

export default RegisterPage;
