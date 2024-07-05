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
  data: any; //dùng để phát hiện những field thay đôi
  resultCase: number; //dùng để xét trường hợp và click button chạy function cho đúng
  onSubmit?: () => void;
  setIsChangeResponsibleInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldCallCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmUpdateResponsible: React.FC<Props> = (props) => {
  const {
    onSubmit,
    open,
    onClose,
    data,
    setIsChangeResponsibleInfo,
    resultCase,
    setShouldCallCreateProject,
  } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      centered
      width={700}
      title={<span className="inline-block m-auto">CẢNH BÁO </span>}
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
              setIsChangeResponsibleInfo(false);
              onClose();
              if (resultCase === 2 || resultCase === 4) {
                setShouldCallCreateProject(true);
              }
            }}
          >
            Tiếp tục mà không thay đổi
          </Button>

          <Button
            danger
            className="btn-submit"
            key="submit"
            type="text"
            onClick={async () => {
              setIsChangeResponsibleInfo(true);
              onClose();
              if (resultCase === 2 || resultCase === 4) {
                setShouldCallCreateProject(true);
              }
            }}
          >
            Tiếp tục với thông tin mới
          </Button>
        </>,
      ]}
    >
      <p>
        Có sự thay đổi thông tin của{" "}
        <span className="font-bold">Người phụ trách</span> ở các ô:
        {data.length > 0 ? (
          <ul>
            {data.map((changedField: string, index: number) => (
              <li key={index}>- {changedField}</li>
            ))}
          </ul>
        ) : (
          <span></span>
        )}
      </p>
    </Modal>
  );
};

export default ModalConfirmUpdateResponsible;
