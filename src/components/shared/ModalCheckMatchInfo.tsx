"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Avatar,
  Descriptions,
  Divider,
  Dropdown,
  Image,
  Modal,
  Rate,
  Menu,
  MenuProps,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  object: string;
  data: any; //dùng để phát hiện những field thay đôi
  onSubmit?: () => void;
  setIsChangeInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalCheckMatchInfo: React.FC<Props> = (props) => {
  const {
    onSubmit,
    open,
    onClose,
    data,
    object,
    setIsChangeInfo,
  } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      centered
      width={700}
      title={<span className="inline-block m-auto">CẢNH BÁO </span>}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {}}
      closable
      footer={[
        <>
          <Button
            danger
            className="btn-submit"
            key="submit"
            type="text"
            onClick={() => {
              onClose();
            }}
          >
            Tiếp tục mà không thay đổi
          </Button>

          <Button
            className="btn-submit"
            key="submit"
            onClick={() => {
              setIsChangeInfo(true);
              onClose();
            }}
          >
            Tiếp tục với thông tin mới
          </Button>
        </>,
      ]}
    >
      <p>
        Có sự thay đổi thông tin của <span className="font-bold">{object}</span> ở các ô:
        {data.length > 0 ? (
          <ul>
            {data.map((changedField: string, index: number) => (
              <li key={index}>{changedField}</li>
            ))}
          </ul>
        ) : (
          <span></span>
        )}
      </p>
    </Modal>
  );
};

export default ModalCheckMatchInfo;
