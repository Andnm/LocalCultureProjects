"use client";

import OtpRegister from "@/src/components/auth/OtpRegister";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { forgotPassword, resetPassword } from "@/src/redux/features/authSlice";
import { useAppDispatch } from "@/src/redux/store";
import { Card, Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const [resEmailForm, setResEmailForm] = useState<any>({
    otpExpired: "",
    otpStored: "",
  });
  const [isOpenOtpForm, setIsOpenOtpForm] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errorOtp, setErrorOtp] = React.useState<string>("");

  const inputsOtpRef: React.RefObject<HTMLInputElement[]> = React.useRef([]);

  const handleFormSubmitEmail = async (values: any) => {
    try {
      const dataBody = {
        email: form.getFieldValue("email"),
      };

      const resForgotPassword = await dispatch(forgotPassword(dataBody));

      console.log("resForgotPassword: ", resForgotPassword);

      if (forgotPassword.fulfilled.match(resForgotPassword)) {
        setResEmailForm({
          otpExpired: resForgotPassword.payload.otpExpired,
          otpStored: resForgotPassword.payload.otpStored,
        });
        setIsOpenOtpForm(true);
      } else {
        toast.error(`${resForgotPassword.payload}`);
      }
    } catch (error) {
      console.error("Error change password:", error);
      message.error("Có lỗi xảy ra đổi mật khẩu");
    }
  };

  const confirmOTP = async () => {
    setLoadingData(true);

    const otp = [
      inputsOtpRef.current![0].value,
      ...inputsOtpRef.current!.slice(1).map((input) => input.value),
    ].join("");

    const dataBody = {
      otp: parseInt(otp, 10),
      otpExpired: resEmailForm.otpExpired,
      otpStored: resEmailForm.otpStored,
      email: form.getFieldValue("email"),
    };

    dispatch(resetPassword(dataBody)).then((resOtp) => {
      if (resetPassword.rejected.match(resOtp)) {
        setErrorOtp(resOtp.payload as string);
      } else if (resetPassword.fulfilled.match(resOtp)) {
        router.push("/");
        setIsOpenOtpForm(false);
        toast.success(`${resOtp.payload}`);
      }

      setLoadingData(false);
    });
  };

  const resendOTP = () => {
    setErrorOtp("");
    setLoadingData(true);
    dispatch(forgotPassword({ email: form.getFieldValue("email") })).then(
      (resSendOtp: any) => {
        console.log("resSendOtp: ", resSendOtp.payload);

        if (forgotPassword.rejected.match(resSendOtp)) {
          //do something
          toast.error(`${resSendOtp.payload}`);
        } else if (forgotPassword.fulfilled.match(resSendOtp)) {
          setResEmailForm({
            otpExpired: resSendOtp.payload.otpExpired,
            otpStored: resSendOtp.payload.otpStored,
          });
          toast.success("OTP đã được gửi lại, vui lòng kiểm tra!");
        }
        setLoadingData(false);
      }
    );
  };

  return (
    <>
      {!isOpenOtpForm ? (
        <div className="container">
          <Card
            title="Đặt lại mật khẩu của bạn"
            bordered={false}
            className="w-[500px] mx-auto mt-10"
          >
            <p className="text-lg">Nhập email bạn muốn lấy lại mật khẩu:</p>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmitEmail}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "Địa chỉ email không hợp lệ!",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>
              <Form.Item className="flex justify-end">
                <Button type="primary" htmlType="submit">
                  Gửi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ) : (
        <OtpRegister
          email={form.getFieldValue("email")}
          verifyAction={confirmOTP}
          inputsRef={inputsOtpRef}
          error={errorOtp}
          setError={() => setErrorOtp("")}
          resendOtp={resendOTP}
        />
      )}

      {loadingData && <SpinnerLoading />}
    </>
  );
};

export default Page;
