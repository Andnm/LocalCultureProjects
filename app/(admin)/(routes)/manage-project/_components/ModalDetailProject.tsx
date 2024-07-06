"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Tabs,
  Divider,
} from "antd";
import { BiAddToQueue, BiEdit, BiPlus } from "react-icons/bi";
import { UploadOutlined } from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import { Check, Trash } from "lucide-react";
import StatusCell from "./StatusCell";
import { formatDate } from "@/src/utils/handleFunction";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  dataTable: any;
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  selectedProject: any;
  setSelectedProject: React.Dispatch<React.SetStateAction<any>>;
  status: string;
  actionConfirm?: any;
}

const ModalDetailProject: React.FC<Props> = (props) => {
  const {
    onSubmit,
    open,
    onClose,
    dataTable,
    setDataTable,
    selectedProject,
    setSelectedProject,
    status,
    actionConfirm,
  } = props;

  console.log("selectedProject: ", selectedProject);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [businessUser, setBusinessUser] = React.useState<any>();
  const [responsiblePersonList, setResponsiblePersonList] = React.useState<
    any[]
  >([]);

  //xử lý thêm người phụ trách
  const [formAddResponsiblePerson] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        ...selectedProject,
        // business_id: businessUser?.id,
        // responsible_person_id: responsiblePersonList[0]?.id,
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

      setBusinessUser(
        selectedProject?.user_projects?.find(
          (up: any) => up.user.role_name === "Business"
        )?.user
      );

      console.log(
        "business data: ",
        selectedProject?.user_projects?.find(
          (up: any) => up.user.role_name === "Business"
        )?.user
      );

      setResponsiblePersonList(
        selectedProject.user_projects
          .filter((up: any) => up.user.role_name === "ResponsiblePerson")
          .map((up: any) => up)
      );
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

  const handleSave = async () => {
    try {
      const values = await formAddResponsiblePerson.validateFields();
      setLoadingSubmit(true);

      setIsAdding(false);
      formAddResponsiblePerson.resetFields();
      //call api ....

      message.success(`Thêm người phụ trách thành công`);
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Có lỗi xảy ra khi thêm người phụ trách");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal
      style={{ top: 10 }}
      width={1200}
      title={
        <div className="inline-block m-auto">
          <div className="flex items-center">
            {editMode ? (
              <>Chỉnh sửa thông tin chi tiết</>
            ) : (
              <>
                <p>Thông tin chi tiết</p>
                <Button
                  type="text"
                  icon={<BiEdit />}
                  onClick={() => setEditMode((prev) => !prev)}
                  style={{ marginLeft: 10 }}
                />
              </>
            )}
          </div>
        </div>
      }
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
        form.resetFields();
        formAddResponsiblePerson.resetFields();
        setEditMode(false);
        setIsAdding(false);
      }}
      footer={[
        editMode && [
          <>
            <Button
              className="btn-submit"
              key="cancel"
              type="text"
              onClick={() => {
                setEditMode((prev) => !prev);
                setIsAdding(false);
              }}
            >
              Huỷ
            </Button>
            <Button
              className="btn-submit btn-continue-with-new-info"
              key="update"
              onClick={async () => {
                confirm({
                  cancelText: "Quay lại",
                  okText: "Xác nhận",
                  title:
                    "Bạn có chắc là muốn thay đổi những nội dung đã chỉnh sửa?",
                  async onOk() {},
                  onCancel() {},
                });
              }}
            >
              Thay đổi
            </Button>
          </>,
        ],
        status === "Pending" && (
          <Button
            danger
            onClick={async () => {
              confirm({
                cancelText: "Quay lại",
                okText: "Xác nhận",
                title: "Bạn có chắc là muốn phê duyệt dự án này? ",
                async onOk() {
                  actionConfirm();
                },
                onCancel() {},
              });
            }}
          >
            <Check className="h-3 w-3" /> Xác nhận phê duyệt
          </Button>
        ),
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        ref={formRef}
        onFinish={handleFormSubmit}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Thông tin doanh nghiệp" key="1">
            {/* doanh nghiệp  */}
            <div>
              <div className="grid grid-cols-3 px-4 ">
                <Form.Item label="Tên doanh nghiệp" className="mx-3">
                  <Input disabled={!editMode} value={businessUser?.fullname} />
                </Form.Item>
                <Form.Item label="Địa chỉ email" className="mx-3">
                  <Input disabled={!editMode} value={businessUser?.email} />
                </Form.Item>
                <Form.Item label="Lĩnh vực kinh doanh" className="mx-3">
                  <Select
                    disabled={!editMode}
                    value={businessUser?.business_sector}
                  >
                    <Option value="Nông nghiệp">Nông nghiệp</Option>
                    <Option value="Thủ công nghiệp">Thủ công nghiệp</Option>
                    <Option value="Du lịch">Du lịch</Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Mô tả doanh nghiệp" className="mx-3">
                  <TextArea
                    rows={4}
                    disabled={!editMode}
                    value={businessUser?.description}
                  />
                </Form.Item>
                <Form.Item label="Địa chỉ doanh nghiệp" className="mx-3">
                  <Input disabled={!editMode} value={businessUser?.address} />
                </Form.Item>
                <Form.Item label="Địa chỉ cụ thể" className="mx-3">
                  <Input
                    disabled={!editMode}
                    value={businessUser?.address_detail}
                  />
                </Form.Item>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đề tài" key="2">
            {/* đề tài */}
            <div>
              <div className="grid grid-cols-3 px-4 ">
                <Form.Item
                  name="name_project"
                  label="Tên dự án"
                  className="mx-3"
                >
                  <Input disabled={!editMode} />
                </Form.Item>
                <Form.Item
                  name="business_type"
                  label="Loại hình dự án"
                  className="mx-3"
                >
                  <Select disabled={!editMode}>
                    <Option value="Lên ý tưởng">Lên ý tưởng</Option>
                    <Option value="Triển khai thực tế">
                      Triển khai thực tế
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="project_implement_time"
                  label="Thời gian thực hiện Dự án"
                  className="mx-3"
                >
                  <Select disabled={!editMode}>
                    <Option value="Học kì Hè 2024 (Từ 5/2024 tới 8/2024)">
                      Học kì Hè 2024 (Từ 5/2024 tới 8/2024)
                    </Option>
                    <Option value="Học kì Thu 2024 (Từ 9/2024 tới 12/2024)">
                      Học kì Thu 2024 (Từ 9/2024 tới 12/2024)
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="purpose"
                  label="Mục đích dự án"
                  className="mx-3"
                >
                  <TextArea rows={4} disabled={!editMode} />
                </Form.Item>
                <Form.Item
                  name="target_object"
                  label="Đối tượng mục tiêu"
                  className="mx-3"
                >
                  <TextArea rows={4} disabled={!editMode} />
                </Form.Item>
                <Form.Item
                  name="request"
                  label="Yêu cầu cụ thể"
                  className="mx-3"
                >
                  <TextArea rows={4} disabled={!editMode} />
                </Form.Item>
                <Form.Item
                  name="note"
                  label="Các lưu ý khác nếu có"
                  className="mx-3"
                >
                  <TextArea rows={4} disabled={!editMode} />
                </Form.Item>
                <Form.Item
                  name="expected_budget"
                  label="Ngân sách dự kiến"
                  className="mx-3"
                >
                  <Select disabled={!editMode}>
                    <Option value="Dưới 5.000.000 VNĐ">
                      Dưới 5.000.000 VNĐ
                    </Option>
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
                    disabled={!editMode}
                  >
                    <Button icon={<UploadOutlined />}>Tải PDF</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="project_status"
                  label="Trạng thái"
                  className="mx-3"
                >
                  <StatusCell status={status} />
                </Form.Item>
                <Form.Item label="Ngày tạo" className="mx-3">
                  <Input
                    disabled
                    defaultValue={formatDate(selectedProject?.createdAt)}
                  />
                </Form.Item>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Người phụ trách" key="3">
            {/* người phụ trách */}
            <div>
              {responsiblePersonList.map(
                (responsiblePerson: any, index: number) => (
                  <div key={index}>
                    <div className="flex flex-row items-center gap-3 mb-3">
                      <h3 className=" font-bold">
                        Người phụ trách {index + 1}
                      </h3>
                      <Button
                        danger
                        onClick={async () => {
                          confirm({
                            cancelText: "Quay lại",
                            okText: "Xác nhận",
                            title:
                              "Bạn có chắc là muốn xóa người phụ trách này ra khỏi dự án? ",
                            async onOk() {
                              //xử lý để xóa
                            },
                            onCancel() {},
                          });
                        }}
                      >
                        <Trash className="h-3 w-3" /> Xóa
                      </Button>
                      {responsiblePerson?.user?.password === undefined ||
                        (responsiblePerson?.user?.password === null && (
                          <Button
                            className="flex flex-row"
                            onClick={async () => {
                              confirm({
                                cancelText: "Quay lại",
                                okText: "Xác nhận",
                                title:
                                  "Bạn có chắc là muốn kích hoạt tài khoản cho người này? ",
                                async onOk() {
                                  //xử lý để kích tài khoản
                                },
                                onCancel() {},
                              });
                            }}
                          >
                            <BiAddToQueue className="h-3 w-3" /> Kích hoạt tài
                            khoản
                          </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 px-4 ">
                      <Form.Item label="Họ và tên" className="mx-3">
                        <Input
                          disabled={!editMode}
                          value={responsiblePerson?.user?.fullname}
                        />
                      </Form.Item>
                      <Form.Item label="Địa chỉ email" className="mx-3">
                        <Input
                          disabled={!editMode}
                          value={responsiblePerson?.user?.email}
                        />
                      </Form.Item>
                      <Form.Item label="Số điện thoại" className="mx-3">
                        <Input
                          disabled={!editMode}
                          value={responsiblePerson?.user?.phone_number}
                        />
                      </Form.Item>
                      <Form.Item label="Chức vụ" className="mx-3">
                        <Input
                          disabled={!editMode}
                          value={responsiblePerson?.user?.position}
                        />
                      </Form.Item>

                      <Form.Item label="Phân quyền" className="mx-3">
                        <Select
                          disabled={!editMode}
                          value={responsiblePerson?.user_project_status}
                        >
                          <Option value="Responsible_Person_View">Xem</Option>
                          <Option value="Responsible_Person_Edit">
                            Chỉnh sửa
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                )
              )}

              <Button
                icon={<BiPlus />}
                onClick={() => {
                  setIsAdding((prev) => !prev);
                  formAddResponsiblePerson.resetFields();
                }}
                className="mx-5 h-full ml-7"
                type="dashed"
              >
                Thêm người phụ trách
              </Button>

              {isAdding && (
                <>
                  <Divider
                    className=""
                    style={{
                      borderWidth: "medium",
                      borderColor: "#EEEEEE",
                    }}
                  ></Divider>
                  <h5 className="text-center">Thêm người phụ trách</h5>
                  <Form form={formAddResponsiblePerson} layout="vertical">
                    <div className="grid grid-cols-3 px-4">
                      <Form.Item
                        className="mx-3"
                        name="fullname"
                        label="Họ và tên"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập họ và tên`,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        className="mx-3"
                        name="email"
                        label="Địa chỉ email"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập email`,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        className="mx-3"
                        name="phone_number"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập số điện thoại`,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        className="mx-3"
                        name="position"
                        label="Chức vụ"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập số chức vụ`,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        className="mx-3"
                        name="user_project_status"
                        label="Phân quyền"
                       
                      >
                        <Select defaultValue={"Responsible_Person_View"}>
                          <Option value="Responsible_Person_View">Xem</Option>
                          <Option value="Responsible_Person_Edit">
                            Chỉnh sửa
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <div className="flex justify-end gap-4 mr-3">
                        {loadingSubmit && <SpinnerLoading />}
                        <Button
                          onClick={() => {
                            setIsAdding(false);
                          }}
                          style={{ marginLeft: "8px" }}
                        >
                          Hủy
                        </Button>
                        <Button type="primary" onClick={handleSave}>
                          Thêm
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                  <Divider
                    className=""
                    style={{
                      borderWidth: "medium",
                      borderColor: "#EEEEEE",
                    }}
                  ></Divider>
                </>
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default ModalDetailProject;
