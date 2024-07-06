"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RootState, useAppDispatch, useAppSelector } from "@/src/redux/store";
import { login, loginWithGoogle } from "@/src/redux/features/authSlice";
import { useInputChange } from "@/src/hook/useInputChange";

import "@/src/styles/auth/auth-style.scss";
import SpinnerLoading from "../loading/SpinnerLoading";
import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth, googleAuthProvider } from "@/src/utils/configFirebase";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { validateEmail } from "@/src/utils/handleFunction";
import { useAuthContext } from "@/src/utils/context/auth-provider";

interface LoginProps {
  actionClose: () => void;
  switchFromLoginToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({
  switchFromLoginToRegister,
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
  const { loading }: any = useAppSelector((state: RootState) => state.auth);
  const { loginInfo, setLoginInfo }: any = useAuthContext();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
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
    }

    setFormError(newFormError);

    if (newFormError.email || newFormError.password) {
      return;
    }

    dispatch(login(formData)).then((result: any) => {
      setLoginInfo(formData);
      const user = result.payload;

      if (login.rejected.match(result)) {
        toast.error(`${result.payload}`);
        //do something
        // console.log(result.payload);
      } else if (login.fulfilled.match(result)) {
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
      }
    });
  };

  const handleLoginWithGoogle = async () => {
    try {
      const data = await signInWithPopup(auth, googleAuthProvider);
      const user = data.user;
      const accessToken = await user.getIdToken();
      const result = await dispatch(loginWithGoogle(accessToken) as any);
      const userData  = result.payload;

      if (loginWithGoogle.fulfilled.match(result)) {
        if (userData.status === true && userData.role_name !== null) {
          switch (userData?.role_name) {
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
        toast.error(`${result.payload}`);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="form-popup-container">
      <div className="overlay"></div>

      <div className="main-popup flex justify-center items-center h-5/6">
        <div className={`form-container`}>
          <IoIosCloseCircleOutline
            className="close-btn"
            onClick={actionClose}
          />

          <div className="form-box">
            <div className="form-details">
              <h2>Chào mừng bạn quay lại</h2>
              <p className="px-3 white-text">
                Vui lòng đăng nhập bằng thông tin cá nhân của bạn để duy trì kết
                nối với chúng tôi
              </p>
            </div>

            <form className="form-content" onSubmit={handleLogin}>
              <h2>ĐĂNG NHẬP</h2>
              <div className="form">
                <div
                  onClick={handleLoginWithGoogle}
                  className="btn-login-gg flex items-center justify-center bg-white cursor-pointer
                   px-6 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 gap-2"
                >
                  <FcGoogle className="w-5 h-5" />{" "}
                  <span>Đăng nhập với Google</span>
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
                    placeholder=" "
                    onChange={(event) => {
                      handleInputChange(event, "email");
                      setFormError((prevState) => ({
                        ...prevState,
                        email: "",
                      }));
                    }}
                  />
                  <label>Email</label>
                </div>
                {formError.email && (
                  <span className="text-red-500 text-sm">
                    {formError.email}
                  </span>
                )}

                <div className="input-field">
                  <input
                    type="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={(event) => {
                      handleInputChange(event, "password");
                      setFormError((prevState) => ({
                        ...prevState,
                        password: "",
                      }));
                    }}
                  />
                  <label>Password</label>
                </div>
                {formError.password && (
                  <span className="text-red-500 text-sm">
                    {formError.password} <br />
                  </span>
                )}

                <Link href="#" className="forgot-pass">
                  Quên mật khẩu?
                </Link>

                <br />

                <button type="submit">Đăng nhập</button>
              </div>

              <div className="bottom-link">
                <span> Bạn chưa có tài khoản? </span>
                <p onClick={switchFromLoginToRegister}>Đăng kí</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {loading && <SpinnerLoading />}
    </div>
  );
};

export default Login;
