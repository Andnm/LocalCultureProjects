"use client";

import React from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { useAppDispatch } from "@/src/redux/store";
import toast from "react-hot-toast";
import { changePassword, logout } from "@/src/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/utils/context/auth-provider";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const ModalChangePassword: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose } = props;
  const router = useRouter();
  const { loginInfo, setLoginInfo }: any = useAuthContext();

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const handleLogout = async () => {
    try {
      setLoginInfo(null);
      await dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCallApiToChangePassword = async () => {
    try {
      const dataBody = {
        oldPassword: form.getFieldValue("oldPassword"),
        newPassword: form.getFieldValue("newPassword"),
      };

      const res = await dispatch(changePassword(dataBody));
      if (changePassword.fulfilled.match(res)) {
        toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại!");
        await handleLogout();
      } else {
        toast.error(`${res.payload}`);
      }
    } catch (error) {
      console.error("Error change password:", error);
      message.error("Có lỗi xảy ra đổi mật khẩu");
    }
  };

  const handleConfirm = async () => {
    try {
      await form.validateFields();
      confirm({
        centered: true,
        cancelText: "Quay lại",
        okText: "Xác nhận thay",
        title: `Bạn có chắc muốn thay đổi mật khẩu?`,
        onOk: async () => {
          await handleCallApiToChangePassword();
          onClose();
        },
        onCancel: () => {},
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      centered
      width={"500px"}
      title={"Vui lòng nhập mật khẩu hiện tại của bạn"}
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          className="btn-submit"
          key="cancel"
          type="text"
          onClick={onClose}
        >
          Huỷ
        </Button>,
        <Button
          className="btn-submit btn-continue-with-new-info"
          key="submit"
          onClick={handleConfirm}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu hiện tại của bạn!",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới của bạn!",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Nhập lại mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lại mật khẩu mới của bạn!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu mới không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;
