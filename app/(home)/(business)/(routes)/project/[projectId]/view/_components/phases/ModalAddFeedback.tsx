"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Descriptions,
  Spin,
  Table,
  Radio,
  Avatar,
  Button,
  message,
  Form,
} from "antd";
import TextNotUpdate from "@/src/components/shared/TextNotUpdate";
import {
  changeStatusFromEnToVn,
  formatCurrency,
  formatDate,
} from "@/src/utils/handleFunction";
import { useAppDispatch } from "@/src/redux/store";
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
import { getCostInCategory } from "@/src/redux/features/costSlice";
import { PaymentMethodEnum } from "@/src/utils/enum/payment.enum";
import { createPaymentUrl } from "@/src/redux/features/paymentSlice";
import toast from "react-hot-toast";
import { uploadFeedback } from "@/src/redux/features/phaseSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  actionConfirm?: any;
  dataPhase: any;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>; //cái này set cho data list
}

const ModalAddFeedback: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, actionConfirm, dataPhase, setPhaseData } =
    props;

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const handleAddFeedback = async () => {
    try {
      const dataBody = {
        phaseId: dataPhase.id,
        feedback: form.getFieldValue("feedback"),
      };
      const res = await dispatch(uploadFeedback(dataBody));
      if (uploadFeedback.fulfilled.match(res)) {
        toast.success("Thêm feedback thành công!");
      } else {
        toast.error(`${res.payload}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      message.error("Có lỗi xảy ra khi thêm feedback");
    }
  };

  const handleConfirm = async () => {
    try {
      await form.validateFields();
      confirm({
        centered: true,
        cancelText: "Quay lại",
        okText: "Xác nhận thêm",
        title: `Bạn có chắc muốn tạo feedback này?`,
        onOk: async () => {
          await handleAddFeedback();
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
      title={"Vui lòng nhập feedback của bạn"}
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={[
        <Button
          className="btn-submit"
          key="submit"
          type="text"
          onClick={() => {
            onClose();
          }}
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
          name="feedback"
          label="Feedback"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập nội dung muốn feedback!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Vui lòng nhập feedback" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddFeedback;
