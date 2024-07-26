import { Form, Modal, Input, Button, Select, DatePicker } from "antd";
import React, { useRef, useState } from "react";
import moment from "moment";
import { updateUserProfile } from "@/src/redux/features/userSlice";
import { useAppDispatch } from "@/src/redux/store";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: (updatedData: any) => void;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const ModalUpdateInfo: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, userData, setUserData } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (open) {
      form.setFieldsValue({
        fullname: userData?.fullname,
        phone_number: userData?.phone_number,
        address: userData?.address,
        address_detail: userData?.address_detail,
        email: userData?.email,
        gender: userData?.gender,
        dob: userData?.dob ? moment(userData?.dob) : null,
      });
    }
  }, [open, userData, form]);

  const handleSubmit = async (values: any) => {
    setConfirmLoading(true);
    try {
      const updatedData = {
        ...userData,
        ...values,
        dob: values.dob ? values.dob : null,
      };

      await dispatch(updateUserProfile(updatedData)).then((resUpdate) => {
        console.log("resUpdate: ", resUpdate);

        if (updateUserProfile.fulfilled.match(resUpdate)) {
          toast.success("Cập nhập thành công!");
          setUserData(updatedData);
          onClose();
        } else {
          toast.error(`${resUpdate.payload}`);
        }
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      width={1200}
      title={<span className="inline-block m-auto">Cập nhật thông tin</span>}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="fullname"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone_number" label="Số điện thoại">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>
        <Form.Item name="address_detail" label="Địa chỉ chi tiết">
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
        >
          <Input />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-36">
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính">
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="dob" label="Ngày sinh">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={confirmLoading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateInfo;
