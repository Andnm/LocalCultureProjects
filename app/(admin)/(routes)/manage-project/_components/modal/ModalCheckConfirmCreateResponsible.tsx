"use client";

import React, { useState } from "react";
import { Modal, Input, Button, Select } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  resultCase: number; //dùng để xét trường hợp và click button chạy function cho đúng
  onSubmit?: () => void;
  setIsCreateAccount: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldCallAddResponsiblePerson: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const ModalCheckConfirmCreateResponsible: React.FC<Props> = (props) => {
  const {
    onSubmit,
    open,
    onClose,
    setIsCreateAccount,
    resultCase,
    setShouldCallAddResponsiblePerson,
  } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      centered
      width={700}
      title={<span className="inline-block m-auto">THÔNG BÁO</span>}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
      }}
      closable
      footer={[
        <>
          <Button
            className="btn-submit"
            key="submit"
            type="text"
            onClick={() => {
              onClose();
            }}
          >
            Huỷ
          </Button>

          <Button
            className="btn-submit btn-continue-with-new-info"
            key="submit"
            onClick={async () => {
              setIsCreateAccount(false);
              onClose();
              if (resultCase === 1 || resultCase === 2) {
                setShouldCallAddResponsiblePerson(true);
              }
            }}
          >
            Tiếp tục mà không tạo tài khoản
          </Button>

          <Button
            danger
            className="btn-submit"
            key="submit"
            type="text"
            onClick={async () => {
              setIsCreateAccount(true);
              onClose();
              if (resultCase === 1 || resultCase === 2) {
                setShouldCallAddResponsiblePerson(true);
              }
            }}
          >
            Tiếp tục và tạo tài khoản
          </Button>
        </>,
      ]}
    >
      <p>
        Bạn có muốn tạo tài khoản người phụ trách luôn với những thông tin này?
      </p>
    </Modal>
  );
};

export default ModalCheckConfirmCreateResponsible;
