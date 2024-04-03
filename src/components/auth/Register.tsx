"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { useInputChange } from "@/src/hook/useInputChange";
import "@/src/styles/auth/auth-style.scss";
import {
  login,
  loginWithGoogle,
  register,
  sendOtpRegister,
  verifyOtp,
} from "@/src/redux/features/authSlice";
import SpinnerLoading from "../loading/SpinnerLoading";
import OtpRegister from "./OtpRegister";
import { FcGoogle } from "react-icons/fc";
import { auth, googleAuthProvider } from "@/src/utils/configFirebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "@/src/utils/handleFunction";
import { useAuthContext } from "@/src/utils/context/auth-provider";

interface RegisterProps {
  switchFromRegisterToLogin: () => void;
  actionClose: () => void;
}

const Register: React.FC<RegisterProps> = ({
  switchFromRegisterToLogin,
  actionClose,
}) => {
  const [formData, handleInputChange] = useInputChange({
    email: "",
    password: "",
  });

  const [formError, setFormError] = React.useState({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loginInfo, setLoginInfo }: any = useAuthContext();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newFormError = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newFormError.email = "Vui lòng không để trống email!";
    } else if (!validateEmail(formData.email)) {
      newFormError.email = "Email không hợp lệ!";
    }

    if (!formData.password.trim()) {
      newFormError.password = "Vui lòng không để trống password";
    } else if (!validatePassword(formData.password)) {
      newFormError.password =
        "Password phải bao gồm ít nhất 1 ký tự thường, 1 ký tự in hoa, 1 ký tự số. Không bao gồm khoảng trắng và độ dài ít nhất 8 kí tự";
    }

    setFormError(newFormError);

    if (newFormError.email || newFormError.password) {
      return;
    }

    dispatch(register(formData)).then((result: any) => {
      if (register.rejected.match(result)) {
        toast.error(`${result.payload}`);
      } else if (register.fulfilled.match(result)) {
        setLoginInfo(formData);

        dispatch(login(formData)).then((resLogin: any) => {
          if (login.fulfilled.match(resLogin)) {
            if (resLogin.payload.role_name === "Lecturer") {
              router.push("/lecturer-board");
            } else {
              router.push("/register");
              actionClose();
            }
          } else {
            toast.error(
              "Có lỗi xảy ra lúc đăng nhập ngay sau khi đăng kí. Vui lòng thử lại sau!"
            );
          }
        });
      }
    });
  };

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider).then(async (data: any) => {
      dispatch(loginWithGoogle(data?.user?.accessToken) as any).then(
        (result: any) => {
          const user = result.payload;

          if (loginWithGoogle.fulfilled.match(result)) {
            if (user.status === true && user.role_name !== null) {
              switch (user?.role_name) {
                case "Admin":
                  router.push("/dashboard");
                  break;
                case "Business":
                  router.push("/business-board");
                  break;
                case "Student":
                  router.push("/student-board");
                  break;
                case "Lecturer":
                  router.push("/lecturer-board");
                  break;
                default:
                  router.push("/");
                  break;
              }
            } else {
              router.push("/register");
            }
            actionClose();
          } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
          }
        }
      );
    });
  };

  return (
    <div className="form-popup-container">
      <div className="overlay"></div>

      <div className="main-popup flex justify-center items-center h-5/6">
        <div className={`form-container register-container`}>
          <IoIosCloseCircleOutline
            className="close-btn"
            onClick={actionClose}
          />

          <div className="form-box">
            <div className="form-details">
              <h2>Tạo tài khoản</h2>
              <p className="px-3 white-text">
                Để trở thành một phần của cộng đồng chúng tôi, vui lòng đăng ký
                bằng thông tin cá nhân của bạn
              </p>
            </div>

            <div className="form-content">
              <h2>ĐĂNG KÍ</h2>
              <form className="form" onSubmit={handleRegister}>
                <div
                  onClick={handleLoginWithGoogle}
                  className="btn-login-gg flex items-center justify-center bg-white cursor-pointer
                   px-6 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 gap-2"
                >
                  <FcGoogle className="w-5 h-5" />{" "}
                  <span>Đăng kí với Google</span>
                </div>

                <div className="break-line my-6">
                  <hr />
                  <div className="text">
                    <p>Hoặc</p>
                  </div>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(event) => {
                      handleInputChange(event, "email");
                      setFormError((prevState) => ({
                        ...prevState,
                        email: "",
                      }));
                    }}
                  />
                  <label>Nhập email của bạn</label>
                </div>
                {formError.email && (
                  <span className="text-red-500 text-xs">
                    {formError.email}
                  </span>
                )}

                <div className="input-field">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => {
                      handleInputChange(event, "password");
                      setFormError((prevState) => ({
                        ...prevState,
                        password: "",
                      }));
                    }}
                  />
                  <label>Tạo password</label>
                </div>
                {formError.password && (
                  <span className="text-red-500 text-xs">
                    {formError.password} <br />
                  </span>
                )}

                <br />

                <button type="submit">Đăng kí</button>
              </form>

              <div className="bottom-link">
                <span> Đã có sẵn tài khoản? </span>
                <p onClick={switchFromRegisterToLogin}>Đăng nhập</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <SpinnerLoading />}
    </div>
  );
};

export default Register;
