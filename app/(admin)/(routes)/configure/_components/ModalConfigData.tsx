"use client";

import React, { useRef, useState } from "react";
import { Button, Input, Modal, message, Divider, Form } from "antd";
import { CiEdit } from "react-icons/ci";
import { BiPlus, BiTrash } from "react-icons/bi";
import axios from "axios";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";

interface ModalConfigDataProps {
  open: boolean;
  onClose: () => void;
  dataConfig: any[];
  setDataConfig: React.Dispatch<React.SetStateAction<any[]>>;
  onSubmit: () => void;
  tagApi: string;
  linkApi: string;
  text: string;
}

const ModalConfigData: React.FC<ModalConfigDataProps> = ({
  open,
  onClose,
  dataConfig,
  setDataConfig,
  tagApi,
  linkApi,
  text,
  onSubmit,
}) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [editModel, setEditModel] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoadingSubmit(true);

      // Kiểm tra nếu tagApi là project_implement_time thì kiểm tra giá trị nhập vào
      if (tagApi === "project_implement_time") {
        const regex =
          /^Học kì (?:Xuân|Hạ|Thu|Đông) \d{4} \(Từ \d{1,2}\/\d{4} tới \d{1,2}\/\d{4}\)$/;
        if (!regex.test(values.value)) {
          message.error(
            "Định dạng giá trị không đúng. Vui lòng nhập theo định dạng 'Học kì [mùa] [năm] (Từ MM/yyyy tới MM/yyyy)!'"
          );
          setLoadingSubmit(false);
          return;
        }
      }

      const newConfigData = {
        id: editModel
          ? editModel.id
          : dataConfig.length > 0
          ? Math.max(...dataConfig.map((item) => item.id)) + 1
          : 1,
        value: values.value,
        label: values.value,
      };

      if (editModel) {
        const updatedData = dataConfig.map((item) =>
          item.id === editModel.id ? newConfigData : item
        );
        setDataConfig(updatedData);
        await axios.put(`${linkApi}/${tagApi}/${editModel.id}`, newConfigData);
      } else {
        setDataConfig([...dataConfig, newConfigData]);
        await axios.post(`${linkApi}/${tagApi}`, newConfigData);
      }

      setEditModel(null);
      setIsAdding(false);
      form.resetFields();
      onSubmit();
      message.success(
        editModel ? `Cập nhật ${text} thành công` : `Thêm ${text} thành công`
      );
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteModel = (model: any) => {
    Modal.confirm({
      cancelText: "Hủy",
      okText: "Xác nhận",
      title: `Bạn có chắc muốn xóa ${text} này?`,
      onOk: async () => {
        try {
          await axios.delete(`${linkApi}/${tagApi}/${model.id}`);
          setDataConfig(dataConfig.filter((item) => item.id !== model.id));
          message.success(`Xóa ${text} thành công`);
        } catch (error) {
          console.error("Error deleting data:", error);
          message.error("Có lỗi xảy ra khi xóa dữ liệu");
        }
      },
    });
  };

  return (
    <Modal
      width={1000}
      visible={open}
      title={text}
      onCancel={() => {
        onClose();
        setEditModel(null);
        setIsAdding(false);
        form.resetFields();
      }}
      footer={null}
      style={{ top: 10 }}
    >
      <div className="my-6">
        <div className="grid grid-cols-3 gap-6">
          {dataConfig.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 mx-5"
              style={{ border: "1px solid #D3D3D3" }}
            >
              <span className="mr-4">{item.value}</span>
              <div className="flex gap-2">
                <Button
                  icon={<CiEdit />}
                  onClick={() => {
                    setEditModel(item);
                    form.setFieldsValue(item);
                  }}
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
              onClick={() => {
                setIsAdding(true);
                setEditModel(null);
                form.resetFields();
              }}
              className="w-full mx-5 h-full"
              type="dashed"
            >
              Thêm {text}
            </Button>
          </div>
        </div>

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
              {editModel ? `Cập nhật ${text}` : `Thêm ${text}`}
            </h5>
            <Form form={form} layout="vertical" className="px-10">
              <Form.Item
                name="value"
                label={text}
                rules={[{ required: true, message: `Vui lòng nhập ${text}!` }]}
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
  );
};

export default ModalConfigData;
