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
import { BiPlus } from "react-icons/bi";
import { UploadOutlined } from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  dataTable: any;
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  selectedProject: any;
  setSelectedProject: React.Dispatch<React.SetStateAction<any>>;
}

const ModalEditProject: React.FC<Props> = (props) => {
  const {
    onSubmit,
    open,
    onClose,
    dataTable,
    setDataTable,
    selectedProject,
    setSelectedProject,
  } = props;

  console.log("selectedProject: ", selectedProject);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();

  const businessUser = selectedProject?.user_projects?.find(
    (up: any) => up.user.role_name === "Business"
  )?.user;

  const responsiblePersonList = selectedProject?.user_projects
    .filter((up: any) => up.user.role_name === "ResponsiblePerson")
    .map((up: any) => up.user);

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        ...selectedProject,
        business_id: businessUser?.id,
        responsible_person_id: responsiblePersonList[0]?.id,
      });

      if (selectedProject.document_related_link) {
        setFileList([
          {
            uid: "-1",
            name: "document",
            status: "done",
            url: selectedProject.document_related_link[0],
          },
        ]);
      }
    }
  }, [selectedProject]);

  const handleFormSubmit = async (values: any) => {
    setConfirmLoading(true);
    let documentLink = selectedProject.document_related_link;

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      const storageRef = ref(storage, `documents/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await uploadTask;
        documentLink = await getDownloadURL(storageRef);
      } catch (error) {
        message.error("File upload failed");
        setConfirmLoading(false);
        return;
      }
    }

    const updatedProject = {
      ...selectedProject,
      ...values,
      document_related_link: documentLink,
    };

    const updatedDataTable = dataTable.map((project: any) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setDataTable(updatedDataTable);
    setSelectedProject(updatedProject);
    onClose();
    setConfirmLoading(false);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <Modal
      style={{ top: 10 }}
      width={1200}
      title={<span className="inline-block m-auto">Thông tin chi tiết</span>}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={
        false /* [
        <>
          <Button
            danger
            className="btn-submit"
            key="submit"
            type="text"
            onClick={() => {
              onClose();
              form.resetFields();
            }}
          >
            Huỷ
          </Button>

          <Button
            className="btn-submit"
            key="submit"
            onClick={async () => {
              confirm({
                cancelText: "Quay lại",
                okText: "Xác nhận",
                title:
                  "Bạn có chắc là muốn thay đổi những nội dung đã chỉnh sửa?",
                async onOk() {
                  handleFormSubmit();
                },
                onCancel() {},
              });
            }}
          >
            Thay đổi
          </Button>
        </>,
      ]*/
      }
    >
      <Form
        form={form}
        layout="vertical"
        ref={formRef}
        onFinish={handleFormSubmit}
      >
        <div>
          <h3 className="ml-3 font-bold">Đề tài</h3>
          <div className="grid grid-cols-3 px-4 ">
            <Form.Item name="name_project" label="Tên dự án" className="mx-3">
              <Input />
            </Form.Item>
            <Form.Item
              name="business_type"
              label="Loại hình dự án"
              className="mx-3"
            >
              <Select>
                <Option value="len y tuong">Lên ý tưởng</Option>
                <Option value="trien khai thuc te">Triển khai thực tế</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="project_implement_time"
              label="Thời gian thực hiện Dự án"
              className="mx-3"
            >
              <Select>
                <Option value="Học kì Hè 2024 (Từ 5/2024 tới 8/2024)">
                  Học kì Hè 2024 (Từ 5/2024 tới 8/2024)
                </Option>
                <Option value="Học kì Thu 2024 (Từ 9/2024 tới 12/2024)">
                  Học kì Thu 2024 (Từ 9/2024 tới 12/2024)
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="purpose" label="Mục đích dự án" className="mx-3">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="target_object"
              label="Đối tượng mục tiêu"
              className="mx-3"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="request" label="Yêu cầu cụ thể" className="mx-3">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="note"
              label="Các lưu ý khác nếu có"
              className="mx-3"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="expected_budget"
              label="Ngân sách dự kiến"
              className="mx-3"
            >
              <Select>
                <Option value="Dưới 5.000.000 VNĐ">Dưới 5.000.000 VNĐ</Option>
                <Option value="Từ 5.000.000 tới dưới 15.000.000 VNĐ">
                  Từ 5.000.000 tới dưới 15.000.000 VNĐ
                </Option>
                <Option value="Từ 15.000.000 tới dưới 25.000.000 VNĐ">
                  Từ 15.000.000 tới dưới 25.000.000 VNĐ
                </Option>
                <Option value="Từ 25.000.000 VNĐ trở lên">
                  Từ 25.000.000 VNĐ trở lên
                </Option>
                <Option value="Chưa xác định, tùy thuộc vào ý tưởng được đề xuất">
                  Chưa xác định, tùy thuộc vào ý tưởng được đề xuất
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="document_related_link"
              label="Tài liệu đính kèm"
              className="mx-3"
            >
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>Tải PDF</Button>
              </Upload>
            </Form.Item>
          </div>
          <Divider
            className=""
            style={{
              marginTop: "12px",
              borderWidth: "medium",
              borderColor: "#EEEEEE",
            }}
          ></Divider>
        </div>

        {/* <div>
          <h3 className="ml-3 font-bold">Thông tin doanh nghiệp</h3>
          <div className="grid grid-cols-3 px-4 ">
            <Form.Item label="Tên doanh nghiệp">
              <Input disabled value={selectedProject?.business?.fullname} />
            </Form.Item>
            <Form.Item label="Địa chỉ email">
              <Input disabled value={selectedProject?.business?.email} />
            </Form.Item>
            <Form.Item label="Lĩnh vực kinh doanh">
              <Input
                disabled
                value={selectedProject?.business?.business_sector}
              />
            </Form.Item>
            <Form.Item label="Mô tả doanh nghiệp">
              <TextArea
                rows={4}
                disabled
                value={selectedProject?.business?.description}
              />
            </Form.Item>
            <Form.Item label="Địa chỉ doanh nghiệp">
              <Input disabled value={selectedProject?.business?.address} />
            </Form.Item>
          </div>
          <Divider
            className=""
            style={{
              marginTop: "12px",
              borderWidth: "medium",
              borderColor: "#EEEEEE",
            }}
          ></Divider>
        </div> */}

        <div>
          {responsiblePersonList.map(
            (responsiblePerson: any, index: number) => (
              <>
                <h3 className=" font-bold">Người phụ trách {index + 1}</h3>
                <div className="grid grid-cols-3 px-4 ">
                  <Form.Item label="Họ và tên" className="mx-3">
                    <Input disabled value={responsiblePerson?.fullname} />
                  </Form.Item>
                  <Form.Item label="Địa chỉ email" className="mx-3">
                    <Input disabled value={responsiblePerson?.email} />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" className="mx-3">
                    <Input disabled value={responsiblePerson?.phone_number} />
                  </Form.Item>
                  <Form.Item label="Chức vụ" className="mx-3">
                    <Input disabled value={responsiblePerson?.position} />
                  </Form.Item>
                </div>
              </>
            )
          )}

          <Button
            icon={<BiPlus />}
            onClick={() => {}}
            className="w-full mx-5 h-full"
            type="dashed"
          >
            Thêm người phụ trách
          </Button>
        </div>

        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit" loading={confirmLoading}>
            Cập nhập
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalEditProject;
