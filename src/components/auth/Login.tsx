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

interface LoginProps {
  actionClose: () => void;
}

const Login: React.FC<LoginProps> = ({ actionClose }) => {
  const [formData, handleInputChange] = useInputChange({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(login(formData)).then((result) => {
      if (login.rejected.match(result)) {
        //do something
        // console.log(result.payload);
      } else if (login.fulfilled.match(result)) {
        const user = result.payload;
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

        actionClose();
      }
    });
  };

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider).then(async (data: any) => {
      dispatch(loginWithGoogle(data?.user?.accessToken) as any).then(
        (result: any) => {
          if (loginWithGoogle.fulfilled.match(result)) {
            const user = result.payload;
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
            actionClose();
          } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
          }
        }
      );
    });
  };

  return (
    <>
      <div className="blur-bg-overlay"></div>

      <div className="flex justify-center items-center h-5/6">
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
                    required
                    value={formData.email}
                    onChange={(event) => handleInputChange(event, "email")}
                  />
                  <label>Email</label>
                </div>

                <div className="input-field">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(event) => handleInputChange(event, "password")}
                  />
                  <label>Password</label>
                </div>

                <Link href="#" className="forgot-pass">
                  Quên mật khẩu?
                </Link>

                <br />
                {error && <span className="text-red-500 text-sm">{error}</span>}

                <button type="submit">Đăng nhập</button>
              </div>

              <div className="bottom-link">
                <span> Bạn chưa có tài khoản? </span>
                <p>Đăng kí</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {loading && <SpinnerLoading />}
    </>
  );
};

export default Login;
