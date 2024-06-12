"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  message,
  Checkbox,
  CheckboxProps,
  Divider,
  UploadFile,
  UploadProps,
  Select,
  Spin,
} from "antd";
import { Form } from "antd";
const { confirm } = Modal;
import { CiEdit } from "react-icons/ci";
import { BiPlus, BiTrash } from "react-icons/bi";
import axios from "axios";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";

interface Props {
  open: boolean;
  onClose: () => void;
  dataSubjectCode: any;
  setDataSubjectCode: React.Dispatch<React.SetStateAction<any[]>>;
  onSubmit: () => void;
}

const contentStyle: React.CSSProperties = {
  padding: 50,
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const ModalConfigSubjectCode: React.FC<Props> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();

  const { onSubmit, open, onClose, dataSubjectCode, setDataSubjectCode } =
    props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [editModel, setEditModel] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const disabled = async () => {
    var result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const handleOpenEditMode = (model: any) => {
    setEditModel(model);
    form.setFieldsValue(model);
  };

  const handleOpenAddMode = () => {
    setEditModel(null);
    setIsAdding(true);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoadingSubmit(true);

      const newValue = form.getFieldValue("value");
      const newId =
        dataSubjectCode.length > 0
          ? Math.max(...dataSubjectCode.map((item: any) => item.id)) + 1
          : 1;
      const newSubjectCode = {
        id: newId,
        value: newValue,
        label: newValue,
      };

      if (!editModel) {
        // Add
        await axios.post(
          `${process.env.NEXT_PUBLIC_MOCK_API_URL}/subject_code`,
          newSubjectCode
        );
        setDataSubjectCode((prev) => [...prev, newSubjectCode]);
      } else {
        // Edit
        const updatedData = dataSubjectCode.map((item: any) =>
          item.id === editModel.id
            ? { ...item, value: newValue, label: newValue }
            : item
        );
        setDataSubjectCode(updatedData);

        await axios.put(
          `${process.env.NEXT_PUBLIC_MOCK_API_URL}/subject_code/${editModel.id}`,
          { ...editModel, value: newValue, label: newValue }
        );
      }

      setEditModel(null);
      setIsAdding(false);
      form.resetFields();
      onSubmit();
      message.success(
        editModel ? "Cập nhật mã môn thành công" : "Thêm mã môn thành công"
      );
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteModel = (subject: any) => {
    Modal.confirm({
      cancelText: "Hủy",
      okText: "Xác nhận",
      title: "Bạn có chắc muốn xóa mã môn học này?",
      onOk: async () => {
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_MOCK_API_URL}/subject_code/${subject.id}`
          );
          setDataSubjectCode((prev) =>
            prev.filter((item) => item.id !== subject.id)
          );
          message.success("Xóa mã môn học thành công");
        } catch (error) {
          console.error("Error deleting data:", error);
          message.error("Có lỗi xảy ra khi xóa dữ liệu");
        }
      },
    });
  };

  return (
    <>
      <Modal
        width={1000}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          setEditModel(null);
          setIsAdding(false);
          form.resetFields();
        }}
        footer={false}
        style={{ top: 10 }}
      >
        <div className="my-6">
          <div className="grid grid-cols-3 gap-6">
            {dataSubjectCode.map((item: any, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 mx-5"
                style={{ border: "1px solid #D3D3D3" }}
              >
                <span className="mr-4">{item.value}</span>
                <div className="flex gap-2">
                  <Button
                    icon={<CiEdit />}
                    onClick={() => handleOpenEditMode(item)}
                  />
                  <Button
                    icon={<BiTrash />}
                    onClick={() => handleDeleteModel(item)}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center w-full">
              <Button
                icon={<BiPlus />}
                onClick={handleOpenAddMode}
                className="w-full mx-5 h-full"
                type="dashed"
              >
                Thêm mã môn học
              </Button>
            </div>
          </div>

          {/* edit */}

          {(editModel || isAdding) && (
            <>
              <Divider
                className=""
                style={{
                  borderWidth: "medium",
                  borderColor: "#EEEEEE",
                }}
              ></Divider>
              <h5 className="text-center">
                {editModel ? "Cập nhật mã môn" : "Thêm mã môn"}
              </h5>
              <Form form={form} layout="vertical" className="px-10 ">
                <Form.Item
                  name="value"
                  label="Mã môn"
                  rules={[{ required: true, message: "Vui lòng nhập mã môn!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-end gap-4">
                    {loadingSubmit && <SpinnerLoading />}
                    <Button
                      onClick={() => {
                        setEditModel(null);
                        setIsAdding(false);
                      }}
                      style={{ marginLeft: "8px" }}
                    >
                      Hủy
                    </Button>
                    <Button type="primary" onClick={handleSave}>
                      Lưu
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalConfigSubjectCode;
