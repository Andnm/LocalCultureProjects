import { Form, Modal, Input, Button, Select, DatePicker } from "antd";
import React, { useRef, useState } from "react";
import moment from "moment";
import { updateUserProfile } from "@/src/redux/features/userSlice";
import { useAppDispatch } from "@/src/redux/store";
import toast from "react-hot-toast";
import TextArea from "antd/es/input/TextArea";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const ModalUpdateDescription: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, userData, setUserData } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (open) {
      form.setFieldsValue({
        description: userData?.description,
        
      });
    }
  }, [open, userData, form]);

  const handleSubmit = async (values: any) => {
    setConfirmLoading(true);
    try {
      const updatedData = {
        ...userData,
        ...values,
      };

      await dispatch(updateUserProfile(updatedData)).then((resUpdate) => {

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
    title={<span className="inline-block m-auto">Cập nhật mô tả</span>}
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
        name="description"
        label="Mô tả"
      >
        <TextArea />
      </Form.Item>
     
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={confirmLoading}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  </Modal>
  );
};

export default ModalUpdateDescription;
