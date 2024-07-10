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

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  actionConfirm?: any;
  dataPhase: any;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>; //cái này set cho data list
}

const ModalChoosePaymentMethod: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, actionConfirm, dataPhase, setPhaseData } =
    props;

  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const dispatch = useAppDispatch();

  const handlePaymentSelection = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentError(null);
  };

  const handleCheckPaymentClick = () => {
    if (!selectedPaymentMethod) {
      setPaymentError("Vui lòng chọn phương thức muốn thanh toán");
      return;
    } else {
      confirm({
        centered: true,
        cancelText: "Hủy",
        okText: "Xác nhận",
        title: `Bạn có chắc muốn thanh toán giai đoạn này?`,
        onOk: async () => {
          try {
            const resCreatePaymentUrl = await dispatch(
              createPaymentUrl({
                paymentMethod: selectedPaymentMethod,
                phaseId: dataPhase?.id,
              })
            );

            console.log("resCreatePaymentUrl: ", resCreatePaymentUrl);

            if (createPaymentUrl.fulfilled.match(resCreatePaymentUrl)) {
              const redirectUrl =
                selectedPaymentMethod === PaymentMethodEnum.MOMO
                  ? resCreatePaymentUrl.payload.payUrl
                  : resCreatePaymentUrl.payload;

              window.location.href = redirectUrl;
              toast.success(
                "Bạn sẽ được chuyển đến trang thanh toán trong chốc lát!"
              );
            } else {
              toast.error(`${resCreatePaymentUrl.payload}`);
            }
          } catch (error) {
            console.error("Error deleting data:", error);
            message.error("Có lỗi khi tạo link thanh toán!");
          }
        },
      });
    }
  };

  return (
    <Modal
      centered
      width={"500px"}
      title={"Vui lòng chọn phương thức thanh toán"}
      open={open}
      onCancel={() => {
        onClose();
        setSelectedPaymentMethod(null);
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
          onClick={handleCheckPaymentClick}
        >
          Xác nhận
        </Button>,
      ]}
      maskClosable={false}
    >
      <div className="flex justify-center gap-5">
        <Avatar
          shape="square"
          size={64}
          src="https://play-lh.googleusercontent.com/dQbjuW6Jrwzavx7UCwvGzA_sleZe3-Km1KISpMLGVf1Be5N6hN6-tdKxE5RDQvOiGRg"
          alt="MoMo"
          onClick={() => handlePaymentSelection(PaymentMethodEnum.MOMO)}
          style={{
            border:
              selectedPaymentMethod === PaymentMethodEnum.MOMO
                ? "2px solid blue"
                : "2px solid white",
            cursor: "pointer",
          }}
        />
        <Avatar
          shape="square"
          size={64}
          src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg"
          alt="VNPay"
          onClick={() => handlePaymentSelection(PaymentMethodEnum.VNPAY)}
          style={{
            border:
              selectedPaymentMethod === PaymentMethodEnum.VNPAY
                ? "2px solid blue"
                : "2px solid #f6f6f6",
            cursor: "pointer",
          }}
        />
      </div>
      {paymentError && (
        <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          {paymentError}
        </div>
      )}
    </Modal>
  );
};

export default ModalChoosePaymentMethod;
